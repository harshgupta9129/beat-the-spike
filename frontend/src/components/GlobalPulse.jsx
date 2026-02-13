
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Activity } from 'lucide-react';

const messages = [
    "Someone in Lucknow just neutralized a spike with a 10m walk!",
    "Maria in Brazil logged a sugar-free streak of 5 days!",
    "Alex in New York swapped soda for sparkling water.",
    "New user joined from Tokyo!",
    "Community goal reached: 100k grams of sugar avoided today."
];

const GlobalPulse = () => {
    const [currentMessage, setCurrentMessage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % messages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-50">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentMessage}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-full shadow-2xl mx-4"
                >
                    <div className="relative">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    </div>
                    <p className="text-[11px] font-bold text-zinc-300 font-mono tracking-tight text-center">
                        {messages[currentMessage]}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default GlobalPulse;
