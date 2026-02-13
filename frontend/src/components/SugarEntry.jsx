
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { estimateSugarContent } from '../services/geminiService';
import { Plus, Loader2, Sparkles, X, Check } from 'lucide-react';
import MediaLog from './MediaLog';

export const SugarEntry = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const addEntry = useStore(state => state.addEntry);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!input.trim() || isAnalyzing) return;

        setIsAnalyzing(true);
        // Use geminiService if available, else fall back to basic logic or just log
        // Assuming estimateSugarContent returns { foodName, sugarGrams, calories, category }
        try {
            const result = await estimateSugarContent(input);

            if (result) {
                addEntry({
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: Date.now(),
                    foodName: result.foodName,
                    sugarGrams: result.sugarGrams,
                    calories: result.calories,
                    category: result.category || 'snack',
                    method: 'Manual'
                });
                setInput("");
                setIsExpanded(false);
            }
        } catch (error) {
            console.error("Gemini analysis failed", error);
            // Fallback
            addEntry({
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                foodName: input,
                sugarGrams: 0, // Unknown
                category: 'snack',
                method: 'Manual'
            });
            setInput("");
            setIsExpanded(false);
        }
        setIsAnalyzing(false);
    };

    const handleMediaLog = (data) => {
        addEntry({
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            foodName: data.foodName,
            sugarGrams: data.sugarGrams,
            calories: data.calories,
            category: 'snack', // Default or could assume from AI
            method: data.method
        });
        setIsExpanded(false);
    };

    return (
        <div className="fixed bottom-8 left-0 right-0 z-40 px-4">
            <div className="max-w-xl mx-auto relative">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
                            className="glass p-8 rounded-[40px] mb-6 neo-shadow border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest">AI Vision & Voice Analysis</span>
                                </div>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => setIsExpanded(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </motion.button>
                            </div>

                            <form onSubmit={handleAnalyze} className="relative mb-6">
                                <input
                                    autoFocus
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Describe your meal..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] p-5 pr-20 text-lg focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all placeholder:text-zinc-600"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={isAnalyzing || !input.trim()}
                                    className="absolute right-3 top-3 bottom-3 bg-yellow-400 text-black w-14 rounded-[18px] font-black flex items-center justify-center disabled:opacity-50 shadow-lg shadow-yellow-400/20"
                                >
                                    {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                                </motion.button>
                            </form>

                            <div className="flex flex-col items-center gap-2">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Or Use Multi-Modal Input</p>
                                <MediaLog onLog={handleMediaLog} />
                            </div>

                            <p className="text-[11px] text-zinc-500 mt-6 text-center font-medium">✨ Gemini AI identifies ingredients & estimates metabolic load.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    layout
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                    className={`mx-auto h-20 neo-shadow rounded-[32px] flex items-center justify-center gap-4 transition-all ${isExpanded ? 'w-20 bg-zinc-900 border border-white/20 text-white' : 'w-full max-w-[280px] bg-white text-black'
                        }`}
                >
                    {isExpanded ? (
                        <Plus className="w-10 h-10 rotate-45" />
                    ) : (
                        <>
                            <div className="bg-black/5 p-2 rounded-xl">
                                <Plus className="w-7 h-7" />
                            </div>
                            <span className="font-black text-xl tracking-tight">Add Sugar</span>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};
