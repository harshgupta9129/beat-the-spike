import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, ArrowRight, ChevronRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
            {/* Hero Section */}
            <section className="flex flex-col items-center text-center py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">Live Health Tracking</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500"
                >
                    MASTER YOUR <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">METABOLIC HEALTH</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed"
                >
                    Track your sugar intake, visualize your spikes, and gain AI-powered insights to optimize your energy levels and long-term health.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                        >
                            Get Started <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </Link>
                    <Link to="/about">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white/[0.03] text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/[0.08] transition-colors"
                        >
                            Learn More
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-6 mt-10">
                {[
                    {
                        icon: <Shield className="w-8 h-8 text-emerald-400" />,
                        title: "Smart Shield",
                        desc: "Visual feedback on your daily limits to keep you in the safe zone."
                    },
                    {
                        icon: <Activity className="w-8 h-8 text-blue-400" />,
                        title: "Real-time Analytics",
                        desc: "Monitor your glucose spikes as they happen with dynamic charts."
                    },
                    {
                        icon: <Zap className="w-8 h-8 text-yellow-400" />,
                        title: "AI Insights",
                        desc: "Get personalized metabolic advice based on your consumption habits."
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-3">{feature.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
};

export default Home;
