
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ArrowRight, User, Ruler, Activity } from 'lucide-react';

const RulerInput = ({ min, max, value, onChange, label, unit }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollPos = (value - min) * 10;
            scrollRef.current.scrollLeft = scrollPos;
        }
    }, []);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollPos = scrollRef.current.scrollLeft;
            const newValue = Math.round(min + scrollPos / 10);
            if (newValue !== value && newValue >= min && newValue <= max) {
                onChange(newValue);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <label className="text-zinc-500 font-bold uppercase text-xs tracking-widest">{label}</label>
                <div className="text-3xl font-black text-white">{value}<span className="text-sm text-zinc-500 ml-1">{unit}</span></div>
            </div>
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="relative h-20 overflow-x-auto no-scrollbar flex items-end gap-2 px-[50%] bg-white/5 rounded-2xl border border-white/10 select-none cursor-ew-resize"
            >
                {Array.from({ length: max - min + 1 }).map((_, i) => {
                    const num = min + i;
                    const isMajor = num % 5 === 0;
                    return (
                        <div key={num} className="flex flex-col items-center flex-shrink-0 w-2">
                            <div className={`w-0.5 rounded-full transition-all ${isMajor ? 'h-8 bg-white' : 'h-4 bg-white/20'}`} />
                            {isMajor && <span className="text-[10px] mt-1 font-bold text-zinc-500">{num}</span>}
                        </div>
                    );
                })}
                <div className="absolute left-1/2 bottom-0 w-0.5 h-12 bg-yellow-400 -translate-x-1/2 pointer-events-none" />
            </div>
        </div>
    );
};

export const Onboarding = () => {
    const [step, setStep] = useState(0);
    const { profile, setProfile, login } = useStore();
    const [usernameInput, setUsernameInput] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');

    const handleUsernameSubmit = async () => {
        if (!usernameInput.trim()) return;
        setIsChecking(true);
        setError('');
        try {
            const success = await login(usernameInput);
            if (success) {
                // Login successful, Onboarding will unmount
            } else {
                // User not found, proceed to registration
                setProfile({ username: usernameInput });
                setStep(s => s + 1);
            }
        } catch (err) {
            setError('Something went wrong. Try again.');
        } finally {
            setIsChecking(false);
        }
    };

    const avatars = ['🥗', '🏃', '🧠', '⚡', '🛡️', '🍬'];

    const steps = [
        {
            title: "Welcome Warrior",
            description: "Enter your username to login or start a new quest.",
            icon: <User className="w-12 h-12 text-emerald-400" />,
            content: (
                <div className="space-y-6">
                    <input
                        type="text"
                        placeholder="Username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all text-center font-bold"
                        onKeyDown={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                    />
                    {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUsernameSubmit}
                        disabled={isChecking || !usernameInput.trim()}
                        className="w-full bg-emerald-500 text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isChecking ? 'Checking...' : 'Continue'}
                    </motion.button>
                </div>
            )
        },
        {
            title: "Warrior Identity",
            description: "Choose your avatar and display name.",
            icon: <User className="w-12 h-12 text-yellow-400" />,
            content: (
                <div className="space-y-8">
                    <div className="flex justify-center gap-4">
                        {avatars.map(a => (
                            <motion.button
                                key={a}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setProfile({ avatar: a })}
                                className={`text-4xl p-3 rounded-2xl transition-all ${profile.avatar === a ? 'bg-yellow-400/20 border-2 border-yellow-400' : 'bg-white/5 border border-transparent'}`}
                            >
                                {a}
                            </motion.button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Display Name..."
                        value={profile.name}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                        onChange={(e) => setProfile({ name: e.target.value })}
                    />
                </div>
            )
        },
        {
            title: "The Basics",
            description: "How are we built? This helps personalize your daily sugar shield.",
            icon: <Activity className="w-12 h-12 text-blue-400" />,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        {['male', 'female', 'other'].map(g => (
                            <motion.button
                                key={g}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setProfile({ gender: g })}
                                className={`p-4 rounded-2xl border-2 capitalize font-bold transition-all ${profile.gender === g ? 'bg-blue-400/20 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]' : 'bg-white/5 border-white/10'}`}
                            >
                                {g}
                            </motion.button>
                        ))}
                    </div>
                    <RulerInput
                        min={10} max={90} value={profile.age} unit="yrs" label="Age"
                        onChange={(val) => setProfile({ age: val })}
                    />
                </div>
            )
        },
        {
            title: "Physical Metrics",
            description: "Height and weight define your metabolism.",
            icon: <Ruler className="w-12 h-12 text-pink-500" />,
            content: (
                <div className="space-y-6">
                    <RulerInput
                        min={120} max={220} value={profile.height} unit="cm" label="Height"
                        onChange={(val) => setProfile({ height: val })}
                    />
                    <RulerInput
                        min={30} max={150} value={profile.weight} unit="kg" label="Weight"
                        onChange={(val) => setProfile({ weight: val })}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="glass p-4 rounded-2xl flex justify-between items-center border-pink-500 border shadow-[0_0_20px_rgba(236,72,153,0.1)]"
                    >
                        <span className="text-zinc-400 font-bold uppercase text-xs">Estimated BMI</span>
                        <span className="text-2xl font-black text-pink-500">{profile.bmi}</span>
                    </motion.div>
                </div>
            )
        }
    ];

    const next = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            setProfile({ onboarded: true });
        }
    };

    const progress = ((step + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-yellow-400 via-blue-400 to-pink-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    className="glass max-w-md w-full p-8 rounded-[48px] neo-shadow relative border border-white/10"
                >
                    <div className="mb-6 flex justify-center">{steps[step].icon}</div>
                    <h1 className="text-3xl font-black mb-2 text-center tracking-tight">{steps[step].title}</h1>
                    <p className="text-zinc-400 text-center mb-10 text-sm leading-relaxed">{steps[step].description}</p>

                    <div className="min-h-[250px]">
                        {steps[step].content}
                    </div>

                    {step > 0 && (
                        <div className="mt-12 flex justify-between items-center">
                            <motion.button
                                disabled={step === 1}
                                whileHover={{ x: -4 }}
                                onClick={() => setStep(s => s - 1)}
                                className="text-zinc-500 font-bold disabled:opacity-0 transition-opacity"
                            >
                                Back
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, x: 4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={next}
                                disabled={step === 1 && !profile.name.trim()}
                                className="bg-white text-black px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
                            >
                                {step === steps.length - 1 ? "Start Quest" : "Continue"}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
