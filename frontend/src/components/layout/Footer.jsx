import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Heart, ArrowUpRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full px-4 pb-10 mt-20">
            <div className="max-w-6xl mx-auto p-8 md:p-12 rounded-[40px] bg-white/[0.02] backdrop-blur-xl border border-white/5 relative overflow-hidden group">
                {/* Subtle Background Glow */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
                    
                    {/* Brand Section */}
                    <div className="md:col-span-5 flex flex-col items-start gap-4">
                        <div className="flex items-center gap-2 group/logo">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover/logo:rotate-12 transition-transform duration-300">
                                <span className="text-black font-black text-sm">⚡</span>
                            </div>
                            <h3 className="text-xl font-black tracking-tighter text-white uppercase">
                                Beat The Spike
                            </h3>
                        </div>
                        <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-sm">
                            Master your metabolism with real-time insights. Join thousands of users making smarter, data-driven nutritional choices every day.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            {[
                                { icon: Github, href: "#", color: "hover:text-white" },
                                { icon: Twitter, href: "#", color: "hover:text-[#1DA1F2]" },
                                { icon: Mail, href: "#", color: "hover:text-emerald-400" }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    href={social.href}
                                    className={`text-zinc-500 transition-colors duration-300 ${social.color}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div className="md:col-span-3 flex flex-col gap-4">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Navigation</h4>
                        <nav className="flex flex-col gap-3">
                            {['Home', 'About', 'Dashboard', 'Privacy'].map((item) => (
                                <Link 
                                    key={item} 
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group/link"
                                >
                                    {item}
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Status/CTA Column */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">System Status</h4>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-emerald-500">All systems operational</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-normal">
                                Version 2.0.4-stable. Updates are deployed weekly to improve glycemic index accuracy.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                        &copy; {currentYear} BEAT THE SPIKE. ALL RIGHTS RESERVED.
                    </p>
                    
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5 px-4 py-2 bg-white/[0.03] rounded-full border border-white/5">
                        Made with 
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <Heart className="w-3 h-3 text-red-500 fill-red-500/20" />
                        </motion.span>
                        by the Bug Smashers
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;