import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_URL = import.meta.env.VITE_API_URL || '';

export const useStore = create(
    persist(
        (set, get) => ({
            profile: {
                name: '',
                username: '', // Added username
                age: 22,
                gender: '',
                height: 170,
                weight: 70,
                bmi: 24.2,
                dailyLimit: 30,
                onboarded: false,
                avatar: '👤',
                activity: { steps: 4500, sleepHours: 7 },
                anonymousID: null,
                anonymousID: null,
                mongoId: null,
                points: 0 // Added points
            },
            history: [],
            totalToday: 0,
            streak: 3,
            totalToday: 0,
            streak: 3,
            loading: false,
            notification: null, // Global notification for gamification

            // HELPER: Calculate BMI locally
            _calcBMI: (w, h) => {
                const heightMeters = h / 100;
                return parseFloat((w / (heightMeters * heightMeters)).toFixed(1));
            },

            login: async (username) => {
                set({ loading: true });
                try {
                    const res = await fetch(`${API_URL}/api/users/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username })
                    });

                    if (res.ok) {
                        const user = await res.json();
                        // Load user data and history
                        set(state => ({
                            profile: { ...state.profile, ...user, mongoId: user._id, onboarded: true }
                        }));
                        await get().initializeData(); // Fetch history
                        return true; // Login success
                    } else if (res.status === 404) {
                        set({ loading: false });
                        return false; // User not found
                    }
                } catch (error) {
                    console.error("Login Error:", error);
                    set({ loading: false });
                    throw error;
                }
            },

            logout: () => {
                set({
                    profile: {
                        name: '',
                        username: '',
                        age: 22,
                        gender: '',
                        height: 170,
                        weight: 70,
                        bmi: 24.2,
                        dailyLimit: 30,
                        onboarded: false,
                        avatar: '👤',
                        activity: { steps: 4500, sleepHours: 7 },
                        anonymousID: null,
                        mongoId: null
                    },
                    history: [],
                    totalToday: 0,
                    streak: 0
                });
                localStorage.removeItem('sugar_warrior_storage'); // Clear persisted state
            },

            setProfile: async (updates) => {
                const currentProfile = get().profile;
                let newProfile = { ...currentProfile, ...updates };

                if (updates.height || updates.weight) {
                    newProfile.bmi = get()._calcBMI(newProfile.weight, newProfile.height);
                }
                set({ profile: newProfile });

                // Backend Sync (Update Only)
                try {
                    if (newProfile.anonymousID) {
                        await fetch(`${API_URL}/api/users/${newProfile.anonymousID}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updates)
                        });
                    }
                } catch (error) {
                    console.error("Sync Error:", error);
                }
            },

            register: async () => {
                set({ loading: true });
                const { profile } = get();
                try {
                    const res = await fetch(`${API_URL}/api/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...profile,
                            onboarded: true, // Ensure backend knows they are ready
                            anonymousID: profile.anonymousID || Math.random().toString(36).substr(2, 9)
                        })
                    });

                    if (res.ok) {
                        const user = await res.json();
                        set(state => ({
                            profile: { ...state.profile, ...user, mongoId: user._id, onboarded: true },
                            loading: false
                        }));
                        return true;
                    } else {
                        throw new Error('Registration failed');
                    }
                } catch (error) {
                    console.error("Registration Error:", error);
                    set({ loading: false });
                    return false;
                }
            },



            addEntry: async (entry) => {
                // Optimistic Update
                const today = new Date().setHours(0, 0, 0, 0);
                set((state) => {
                    const newHistory = [entry, ...state.history];
                    const total = newHistory
                        .filter(e => new Date(e.timestamp).setHours(0, 0, 0, 0) === today)
                        .reduce((acc, curr) => acc + curr.sugarGrams, 0);
                    return { history: newHistory, totalToday: total };
                });

                // Backend Sync
                const { profile } = get();
                if (profile.mongoId) {
                    try {
                        const res = await fetch(`${API_URL}/api/sugar-events`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: profile.mongoId,
                                foodName: entry.foodName,
                                sugarGrams: entry.sugarGrams,
                                calories: entry.calories,
                                category: entry.category,
                                method: entry.method,
                                timestamp: entry.timestamp
                            })
                        });

                        if (res.ok) {
                            const data = await res.json();

                            // Update State with new points and streak
                            set(state => ({
                                streak: data.streak || state.streak, // Update streak
                                profile: {
                                    ...state.profile,
                                    points: (state.profile.points || 0) + (data.pointsEarned || 0)
                                },
                                notification: data.pointsEarned > 0 ? {
                                    points: data.pointsEarned,
                                    messages: data.pointsMessages
                                } : null
                            }));

                            // Auto-clear notification after 4 seconds
                            if (data.pointsEarned > 0) {
                                setTimeout(() => set({ notification: null }), 4000);
                            }

                            return { pointsEarned: data.pointsEarned, messages: data.pointsMessages };
                        }
                    } catch (e) { console.error("Event Sync Failed", e); }
                }
                return null;
            },

            clearNotification: () => set({ notification: null }),

            removeEntry: (id) => set((state) => {
                const newHistory = state.history.filter(e => e.id !== id);
                const today = new Date().setHours(0, 0, 0, 0);
                return {
                    history: newHistory,
                    totalToday: newHistory
                        .filter(e => new Date(e.timestamp).setHours(0, 0, 0, 0) === today)
                        .reduce((acc, curr) => acc + curr.sugarGrams, 0)
                };
            }),

            initializeData: async () => {
                const { profile } = get();
                if (!profile.anonymousID) return;

                set({ loading: true });
                try {
                    const userRes = await fetch(`${API_URL}/api/users/${profile.anonymousID}`);
                    if (userRes.ok) {
                        const user = await userRes.json();
                        const eventsRes = await fetch(`${API_URL}/api/sugar-events/${user._id}`);
                        const events = eventsRes.ok ? await eventsRes.json() : [];

                        // Map Backend Fields (itemName, _id) -> Frontend Fields (foodName, id)
                        const mappedEvents = events.map(e => ({
                            ...e,
                            id: e._id,
                            foodName: e.itemName
                        }));

                        const today = new Date().setHours(0, 0, 0, 0);
                        const total = mappedEvents
                            .filter(e => new Date(e.timestamp).setHours(0, 0, 0, 0) === today)
                            .reduce((acc, curr) => acc + curr.sugarGrams, 0);

                        set({ profile: { ...profile, ...user, mongoId: user._id }, history: mappedEvents, totalToday: total });
                    } else if (userRes.status === 404) {
                        // Self-healing: Backend doesn't know this user (likely deleted). Reset local state.
                        console.warn("User ID invalid (404). Resetting profile.");
                        get().logout(); // Use logout to reset
                    }
                } catch (e) { console.error("Init Error", e); }
                finally { set({ loading: false }); }
            },

            resetProgress: () => set({ history: [], totalToday: 0, streak: 0 })
        }),
        {
            name: 'sugar-warrior-storage', // name of the item in storage
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ profile: state.profile }), // Only persist the profile/ID
        }
    )
);