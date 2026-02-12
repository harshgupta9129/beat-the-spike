
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    anonymousID: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    age: { type: Number, required: true },
    height: { type: Number, default: 170 },
    weight: { type: Number, default: 70 },
    bmi: { type: Number, required: true },
    dailyLimit: { type: Number, default: 30 },
    avatar: { type: String, default: '👤' },
    onboarded: { type: Boolean, default: false },
    activity: {
        steps: { type: Number, default: 4500 },
        sleepHours: { type: Number, default: 7 }
    },
    currentStreak: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
