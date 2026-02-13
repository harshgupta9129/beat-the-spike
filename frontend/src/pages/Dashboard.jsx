import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Onboarding } from '../components/Onboarding';
import { BentoGrid, BentoItem } from '../components/BentoGrid';
import { SugarEntry } from '../components/SugarEntry';
import { SugarShield } from '../components/SugarShield';
import SugarHeatmap from '../components/SugarHeatmap';
import GlobalPulse from '../components/GlobalPulse';
import { generateInsight } from '../services/insightService';
import {
    Activity, Flame, History, Trophy, Zap, Trash2, Droplet,
    Coffee, Cookie, Apple, ChevronDown, ChevronUp, Sparkles, Wind
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis } from 'recharts';

const Dashboard = () => {
    const { profile, history, totalToday, streak, removeEntry, addEntry, initializeData, notification, clearNotification } = useStore();
    const [mounted, setMounted] = useState(false);
    const [insightOpen, setInsightOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        initializeData();
    }, []);

    if (!mounted) return null;

    const percentage = Math.min((totalToday / profile.dailyLimit) * 100, 100);
    const statusColor = percentage > 90 ? '#ef4444' : percentage > 70 ? '#fb923c' : '#10b981';
    const statusColorTailwind = percentage > 90 ? 'text-red-500' : percentage > 70 ? 'text-orange-400' : 'text-emerald-400';

    const insight = generateInsight(profile, history);

    const quickActions = [
        { label: 'Soda', grams: 39, calories: 150, icon: <Droplet className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-400/10', category: 'soda' },
        { label: 'Coffee', grams: 5, calories: 30, icon: <Coffee className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-600/10', category: 'coffee' },
        { label: 'Snack', grams: 12, calories: 120, icon: <Cookie className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-400/10', category: 'snack' },
        { label: 'Fruit', grams: 15, calories: 60, icon: <Apple className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-400/10', category: 'fruit' },
    ];

    const chartData = [...history].slice(0, 8).reverse().map(e => ({
        time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grams: e.sugarGrams
    }));

    return (
        <div className="pb-44 pt-6 px-4 max-w-6xl mx-auto space-y-6">
            <AnimatePresence>
                {!profile.onboarded && <Onboarding />}
            </AnimatePresence>

            <BentoGrid>
                {/* --- 1. BALANCED HERO HUD --- */}
                <BentoItem className="md:col-span-3 flex flex-col md:flex-row items-center justify-between p-8 bg-zinc-900/20 border-white/10 overflow-hidden relative">
                    <div className="flex items-center gap-10">
                        {/* Shield - Perfectly Sized */}
                        <div className="w-40 h-40 relative">
                            <SugarShield total={totalToday} limit={profile.dailyLimit} color={statusColor} />
                            <div className="absolute inset-0 rounded-full blur-[40px] opacity-20 -z-10" style={{ backgroundColor: statusColor }} />
                        </div>

                        {/* Primary Stat */}
                        <div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Current Saturation</p>
                            <motion.h2 key={totalToday} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`text-6xl font-black ${statusColorTailwind} tracking-tighter`}>
                                {totalToday.toFixed(1)}<span className="text-2xl ml-1 text-zinc-600">g</span>
                            </motion.h2>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        className="h-full"
                                        style={{ backgroundColor: statusColor }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500">{percentage.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Streak - Integrated & Balanced */}
                    <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end md:pl-10 md:border-l border-white/5">
                        <div className="flex items-center gap-3 bg-yellow-400/10 px-4 py-2 rounded-2xl border border-yellow-400/20">
                            <Flame className="w-5 h-5 text-yellow-500" fill="currentColor" />
                            <span className="text-2xl font-black text-white">{streak}</span>
                        </div>
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-2 text-right">Day Consistency</p>

                        {/* Updated Points Display */}
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-xl font-black text-purple-400">{profile.points || 0}</span>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">XP Earned</span>
                        </div>
                    </div>
                </BentoItem>

                {/* --- GAMIFICATION TOAST --- */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: -50, x: '-50%' }}
                            className="fixed top-20 left-1/2 z-50 bg-zinc-900/90 backdrop-blur-md border border-yellow-400/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
                        >
                            <div className="bg-yellow-400/20 p-2 rounded-full">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">+{notification.points} XP</h3>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{notification.messages.join(' • ')}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- 2. QUICK LOGGING --- */}
                <BentoItem className="md:col-span-1 p-6 flex flex-col justify-center">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Express Log</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <motion.button
                                key={action.label}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addEntry({ ...action, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), foodName: action.label, sugarGrams: action.grams, calories: action.calories, method: 'Manual' })}
                                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all"
                            >
                                <div className={`${action.color}`}>{action.icon}</div>
                                <span className="text-[9px] font-black text-zinc-400 uppercase">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </BentoItem>

                {/* --- 3. METABOLIC INSIGHT --- */}
                <BentoItem className="md:col-span-2 p-8 bg-zinc-950/40">
                    <div className="flex items-start gap-6">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl">
                            <Wind className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-white leading-tight">{insight.text}</h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{insight.why}</p>
                        </div>
                    </div>
                </BentoItem>

                {/* --- 4. ACTIVITY TIMELINE --- */}
                <BentoItem className="md:col-span-2 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <History className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Live Encounters</h3>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {history.map((entry) => (
                                <motion.div key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5 text-[10px] font-black uppercase text-zinc-500">
                                            {entry.category?.substring(0, 2) || '??'}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-white">{entry.foodName}</p>
                                            <p className="text-[9px] text-zinc-500 font-bold">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-black text-md text-white">{entry.sugarGrams}g</p>
                                        <button onClick={() => removeEntry(entry.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </BentoItem>

                {/* --- 5. INTAKE FLOW CHART --- */}
                <BentoItem className="md:col-span-2 p-8 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Metabolic Flow</h3>
                        <Trophy className="w-4 h-4 text-white/10" />
                    </div>
                    <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <Area type="stepAfter" dataKey="grams" stroke={statusColor} strokeWidth={3} fillOpacity={0.1} fill={statusColor} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </BentoItem>

                {/* --- 6. HEATMAP (FOOTER OF DASHBOARD) --- */}
                <BentoItem className="md:col-span-4 p-8 bg-black/40 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="shrink-0">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">History Map</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight mt-1">Yearly Frequency Analysis</p>
                        </div>
                        <div className="w-full overflow-x-auto pb-2">
                            <SugarHeatmap userId={profile.anonymousID} />
                        </div>
                    </div>
                </BentoItem>
            </BentoGrid>

            <SugarEntry />
            <GlobalPulse />
        </div>
    );
};

export default Dashboard;