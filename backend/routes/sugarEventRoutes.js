
import express from 'express';
import SugarEvent from '../models/SugarEvent.js';
import User from '../models/User.js';

const router = express.Router();

// Log a new sugar event
router.post('/', async (req, res) => {
    try {
        const { userId, foodName, sugarGrams, method, calories, category, timestamp } = req.body;
        const event = new SugarEvent({
            userId,
            itemName: foodName,
            sugarGrams,
            method,
            calories,
            category,
            timestamp
        });
        await event.save();

        // --- Gamification Logic ---
        let pointsEarned = 0;
        const pointsMessages = [];

        const eventTime = new Date(timestamp || Date.now());

        // 1. Time Bonus: Log before 6 PM (18:00)
        if (eventTime.getHours() < 18) {
            pointsEarned += 3;
            pointsMessages.push("Early Bird Bonus (+3 XP)");
        }

        // 2. Healthy Choice: Low sugar (< 5g) and not an exercise entry
        const isExercise = category === 'exercise' || foodName.toLowerCase().includes('walk');
        if (!isExercise && sugarGrams < 5) {
            pointsEarned += 5;
            pointsMessages.push("Healthy Choice (+5 XP)");
        }

        // 3. Exercise & Corrective Action
        if (isExercise) {
            pointsEarned += 5; // Base points for activity
            pointsMessages.push("Activity Bonus (+5 XP)");

            // Check for recent spike to award Quick Action bonus
            const previousEvent = await SugarEvent.findOne({
                userId,
                _id: { $ne: event._id },
                timestamp: { $lt: eventTime }
            }).sort({ timestamp: -1 });

            if (previousEvent && previousEvent.sugarGrams > 20) {
                const diffMinutes = (eventTime - new Date(previousEvent.timestamp)) / 1000 / 60;
                if (diffMinutes <= 30) {
                    pointsEarned += 7;
                    pointsMessages.push("Spike Crushed! (+7 XP)");

                    // Mark previous event as corrected
                    previousEvent.correctiveActionCompleted = true;
                    await previousEvent.save();
                }
            }
        }

        // --- Streak Logic ---
        const user = await User.findById(userId);
        const eventDate = new Date(timestamp || Date.now());
        eventDate.setHours(0, 0, 0, 0);

        let lastLogDate = user.lastLogDate ? new Date(user.lastLogDate) : null;
        if (lastLogDate) lastLogDate.setHours(0, 0, 0, 0);

        const updateOps = { $inc: { points: pointsEarned } };

        // If no last log or last log was before today
        if (!lastLogDate || eventDate.getTime() > lastLogDate.getTime()) {
            const yesterday = new Date(eventDate);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            if (lastLogDate && lastLogDate.getTime() === yesterday.getTime()) {
                // Consecutive day
                updateOps.$inc.currentStreak = 1;
            } else {
                // Streak broken or first time
                updateOps.$set = { currentStreak: 1 };
            }
            // Always update lastLogDate to today if it's a new day log
            if (!updateOps.$set) updateOps.$set = {};
            updateOps.$set.lastLogDate = eventDate;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateOps, { new: true });

        res.status(201).json({
            ...event.toObject(),
            pointsEarned,
            pointsMessages,
            streak: updatedUser.currentStreak
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get events for a user (for Heatmap)
router.get('/:userId', async (req, res) => {
    try {
        const events = await SugarEvent.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
