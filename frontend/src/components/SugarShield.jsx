
import React from 'react';
import { motion } from 'framer-motion';

export const SugarShield = ({ total, limit, color }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min((total / limit) * 100, 100);
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-full aspect-square">
            <svg className="w-full h-full transform -rotate-90">
                {/* Background track */}
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-white/5"
                />
                {/* Progress stroke */}
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">Safe Remaining</span>
                <span className="text-5xl font-black text-white">{Math.max(0, limit - total).toFixed(0)}</span>
                <span className="text-zinc-500 font-bold">grams</span>
            </div>
        </div>
    );
};
