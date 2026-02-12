
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { Onboarding } from './components/Onboarding';
import { BentoGrid, BentoItem } from './components/BentoGrid';
import { SugarEntry } from './components/SugarEntry';
import { SugarShield } from './components/SugarShield';
import SugarHeatmap from './components/SugarHeatmap';
import GlobalPulse from './components/GlobalPulse';
import { generateInsight } from './services/insightService';
import {
    Activity,
    Flame,
    History,
    Trophy,
    Zap,
    Trash2,
    Droplet,
    Coffee,
    Cookie,
    Apple,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Wind,
    LogOut
} from 'lucide-react';
import {
    AreaChart,
    Area,
    ResponsiveContainer
} from 'recharts';

const App = () => {
    const { profile, history, totalToday, streak, removeEntry, addEntry, resetProgress, initializeData, logout } = useStore();
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
        { label: 'Soda', grams: 39, icon: <Droplet />, color: 'text-blue-400', category: 'soda' },
        { label: 'Coffee', grams: 5, icon: <Coffee />, color: 'text-amber-600', category: 'coffee' },
        { label: 'Snack', grams: 12, icon: <Cookie />, color: 'text-orange-400', category: 'snack' },
        { label: 'Dessert', grams: 25, icon: <Sparkles />, color: 'text-pink-400', category: 'dessert' },
    ];

    const handleQuickAdd = (action) => {
        addEntry({
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            foodName: action.label,
            sugarGrams: action.grams,
            category: action.category,
            method: 'Manual'
        });
    };

    const chartData = history.slice(0, 10).reverse().map(e => ({
        time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grams: e.sugarGrams
    }));

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'soda': return <Droplet className="w-4 h-4 text-blue-400" />;
            case 'snack': return <Cookie className="w-4 h-4 text-orange-400" />;
            case 'dessert': return <Sparkles className="w-4 h-4 text-pink-400" />;
            case 'coffee': return <Coffee className="w-4 h-4 text-amber-600" />;
            case 'fruit': return <Apple className="w-4 h-4 text-red-400" />;
            default: return <Zap className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#060608] text-zinc-100 pb-44 px-4 font-sans selection:bg-emerald-500/30">
            <AnimatePresence>
                {!profile.onboarded && <Onboarding />}
            </AnimatePresence>

            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pt-10 pb-6 flex justify-between items-center max-w-6xl mx-auto"
            >
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="text-4xl bg-white/[0.03] w-14 h-14 rounded-[20px] flex items-center justify-center border border-white/10 shadow-xl"
                    >
                        {profile.avatar}
                    </motion.div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">BEAT THE SPIKE</h1>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1.5">{profile.name} • XP 1,240</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={resetProgress}
                        className="p-4 glass rounded-[20px] hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <History className="w-6 h-6 text-zinc-400" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={logout}
                        className="p-4 glass rounded-[20px] hover:bg-red-500/10 transition-colors border border-white/10 group"
                    >
                        <LogOut className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition-colors" />
                    </motion.button>
                </div>
            </motion.nav>

            <BentoGrid>
                {/* Sugar Shield Hero */}
                <BentoItem className="md:col-span-2 md:row-span-2 flex flex-col items-center justify-center py-12 bg-gradient-to-br from-white/[0.03] to-transparent" >
                    <div className="w-full max-w-[260px] relative">
                        <SugarShield total={totalToday} limit={profile.dailyLimit} color={statusColor} />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute inset-0 rounded-full blur-[40px] -z-10"
                            style={{ backgroundColor: `${statusColor}20` }}
                        />
                    </div>
                    <div className="text-center mt-8">
                        <motion.h2
                            key={totalToday}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className={`text-6xl font-black ${statusColorTailwind} tracking-tighter`}
                        >
                            {totalToday.toFixed(1)}<span className="text-2xl ml-1 opacity-50">g</span>
                        </motion.h2>
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-2">Captured Today</p>
                    </div>
                </BentoItem>

                {/* Dynamic Streak Flame Card */}
                <BentoItem className="md:col-span-1 flex flex-col items-center justify-between text-center">
                    <div className="relative mt-4">
                        <motion.div
                            animate={{
                                scale: [1, 1.2 + (streak * 0.05), 1],
                                filter: [
                                    `drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))`,
                                    `drop-shadow(0 0 ${20 + streak * 5}px rgba(251, 191, 36, 0.7))`,
                                    `drop-shadow(0 0 10px rgba(251, 191, 36, 0.3))`
                                ]
                            }}
                            transition={{ repeat: Infinity, duration: 2 - (streak * 0.1) }}
                            className="w-16 h-16 rounded-[20px] bg-yellow-400/10 flex items-center justify-center border border-yellow-400/30"
                        >
                            <Flame className="w-8 h-8 text-yellow-400" fill="currentColor" />
                        </motion.div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">{streak} Days</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Streak</p>
                    </div>
                    <Trophy className="w-6 h-6 text-white/10 mb-2" />
                </BentoItem>

                {/* Sugar Frequency Heatmap (Replacing previous placeholder or adding new) */}
                <BentoItem className="md:col-span-1 overflow-hidden">
                    <SugarHeatmap userId={profile.anonymousID} />
                </BentoItem>

                {/* Action Suggestion Card */}
                <BentoItem className="md:col-span-2 border-2 border-yellow-400/30 bg-yellow-400/[0.03] overflow-visible relative">
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg shadow-yellow-400/30 animate-pulse">
                        +10 XP MISSION
                    </div>
                    <div className="flex items-start gap-5">
                        <div className="p-4 bg-yellow-400/10 text-yellow-400 rounded-2xl shrink-0">
                            <Wind className="w-7 h-7" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-black text-xl text-yellow-400 leading-tight">{insight.text}</h3>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setInsightOpen(!insightOpen)}
                                className="flex items-center gap-2 text-[11px] text-zinc-500 font-black uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Metabolic Insight {insightOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </motion.button>
                            <AnimatePresence>
                                {insightOpen && (
                                    <motion.p
                                        initial={{ height: 0, opacity: 0, y: -10 }}
                                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                                        exit={{ height: 0, opacity: 0, y: -10 }}
                                        className="text-sm text-zinc-400 leading-relaxed overflow-hidden font-medium italic"
                                    >
                                        {insight.why}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </BentoItem>

                {/* Quick Actions */}
                <BentoItem className="md:col-span-2">
                    <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-5">INSTANT LOG</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action) => (
                            <motion.button
                                key={action.label}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuickAdd(action)}
                                className="flex flex-col items-center gap-3 p-5 rounded-[28px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all shadow-sm group"
                            >
                                <div className={`${action.color} p-3 bg-white/5 rounded-[20px] shadow-inner group-hover:scale-110 transition-transform`}>{action.icon}</div>
                                <div className="text-center">
                                    <span className="block text-sm font-black tracking-tight">{action.label}</span>
                                    <span className="text-[10px] text-zinc-500 font-bold">{action.grams}g Sugar</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </BentoItem>

                {/* Intake Chart */}
                <BentoItem className="md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">INTAKE FLOW</h3>
                        <div className={`p-1.5 px-3 rounded-xl bg-white/5 text-[10px] font-black border border-white/5 ${statusColorTailwind}`}>
                            {percentage.toFixed(0)}% LIMIT REACHED
                        </div>
                    </div>
                    <div className="w-full h-40" style={{ height: 160 }}>
                        <AreaChart width={300} height={160} data={chartData} style={{ width: '100%' }}>
                            <defs>
                                <linearGradient id="colorGrams" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={statusColor} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={statusColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="grams"
                                stroke={statusColor}
                                fillOpacity={1}
                                fill="url(#colorGrams)"
                                strokeWidth={4}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </div>
                </BentoItem>

                {/* History Timeline */}
                <BentoItem className="md:col-span-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <History className="w-5 h-5 text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">Timeline</h3>
                    </div>
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {history.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-16 text-center text-zinc-600"
                                >
                                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-5" />
                                    <p className="text-sm font-black uppercase tracking-widest opacity-30">No encounters yet today</p>
                                </motion.div>
                            ) : (
                                history.map((entry) => (
                                    <motion.div
                                        key={entry.id}
                                        layout
                                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        whileHover={{ scale: 1.01 }}
                                        className="flex items-center justify-between p-5 rounded-[28px] bg-white/[0.02] border border-white/5 group hover:border-white/20 transition-all cursor-default"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-[18px] bg-white/[0.03] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                                {getCategoryIcon(entry.category)}
                                            </div>
                                            <div>
                                                <p className="font-black text-base leading-none">{entry.foodName}</p>
                                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-2 flex items-center gap-2">
                                                    <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {entry.method && <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">{entry.method}</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className={`font-black text-lg tracking-tighter ${entry.sugarGrams > 20 ? 'text-red-500' : 'text-white'}`}>{entry.sugarGrams}g</p>
                                                {entry.calories && <p className="text-[10px] text-zinc-500 font-bold uppercase">{entry.calories} kcal</p>}
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.2, color: "#ef4444" }}
                                                whileTap={{ scale: 0.8 }}
                                                onClick={() => removeEntry(entry.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </BentoItem>
            </BentoGrid>

            <SugarEntry />
            <GlobalPulse />

            {/* Immersive Blur Backgrounds */}
            <div className="fixed top-[-15%] right-[-15%] w-[60%] h-[60%] bg-emerald-500/5 blur-[150px] pointer-events-none -z-10 animate-pulse" />
            <div className="fixed bottom-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-500/5 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
    );
};

export default App;
