
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Actually, let's use a simple custom tooltip for simplicity without installing radix if not present.
// Or just hover title.

const SugarHeatmap = ({ userId }) => {
    const [data, setData] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        if (userId) {
            const fetchHeatmapData = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/sugar-events/${userId}`);
                    if (res.ok) {
                        const events = await res.json();

                        // Process events into daily aggregate
                        const dateMap = {};
                        events.forEach(event => {
                            const date = new Date(event.timestamp).toISOString().split('T')[0];
                            if (!dateMap[date]) dateMap[date] = 0;
                            dateMap[date] += event.sugarGrams;
                        });

                        // Generate last 365 days
                        const days = [];
                        const today = new Date();
                        for (let i = 0; i < 365; i++) {
                            const d = new Date(today);
                            d.setDate(d.getDate() - i);
                            const dateStr = d.toISOString().split('T')[0];
                            days.push({
                                date: dateStr,
                                count: dateMap[dateStr] ? Math.min(Math.floor(dateMap[dateStr] / 10), 4) : 0, // Normalize for color intensity (0-4)
                                rawGrams: dateMap[dateStr] || 0
                            });
                        }
                        setData(days.reverse());
                    }
                } catch (error) {
                    console.error("Failed to fetch heatmap data", error);
                }
            };
            fetchHeatmapData();
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
