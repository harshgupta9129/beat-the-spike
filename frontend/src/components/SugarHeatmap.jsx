
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Actually, let's use a simple custom tooltip for simplicity without installing radix if not present.
// Or just hover title.

const SugarHeatmap = ({ userId }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (userId) {
            // Mock fetching or use store in real app, but component is requested to use MongoDB
            // For now we simulate the grid data with mock + live data
            // In a real implementation: fetch(`/api/sugar-events/${userId}`)
            // Here we will generate a year's worth of empty data and fill with some "events"
            const generateData = () => {
                const days = [];
                const today = new Date();
                for (let i = 0; i < 365; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    days.push({
                        date: date.toISOString().split('T')[0],
                        count: Math.floor(Math.random() * 5), // Mock intensity
                        intensity: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
                    });
                }
                return days.reverse();
            };
            setData(generateData());
        }
    }, [userId]);

    const getColor = (count) => {
        if (count === 0) return 'bg-white/5';
        if (count < 2) return 'bg-emerald-500/40'; // Low sugar
        if (count < 4) return 'bg-yellow-500/60'; // Moderate
        return 'bg-red-600'; // Emergency Red
    };

    return (
        <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Sugar Frequency</h3>
            <div className="flex flex-wrap gap-1 max-w-full justify-center">
                {data.map((day, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.002 }}
                        className={`w-3 h-3 rounded-[2px] ${getColor(day.count)} cursor-pointer hover:ring-2 ring-white/20 transition-all`}
                        title={`${day.date}: ${day.count * 10}g Sugar`}
                    />
                ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-[10px] text-zinc-500 font-bold uppercase justify-end">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/5 rounded-[2px]" />
                    <span>Clean</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500/40 rounded-[2px]" />
                    <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-[2px]" />
                    <span>Spike</span>
                </div>
            </div>
        </div>
    );
};

export default SugarHeatmap;
