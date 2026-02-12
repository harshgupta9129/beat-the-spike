
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Create a new user (Register)
router.post('/', async (req, res) => {
    try {
        const { anonymousID, username, age, bmi, name, gender, height, weight, dailyLimit, avatar, activity, onboarded } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const user = new User({
            anonymousID, username, age, bmi, name, gender, height, weight, dailyLimit, avatar, activity, onboarded
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login by Username
router.post('/login', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/:anonymousID', async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findOneAndUpdate(
            { anonymousID: req.params.anonymousID },
            { $set: updates },
            { new: true } // Return updated document
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user by AnonymousID
router.get('/:anonymousID', async (req, res) => {
    try {
        const user = await User.findOne({ anonymousID: req.params.anonymousID });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
