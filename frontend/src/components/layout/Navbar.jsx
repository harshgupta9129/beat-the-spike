import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { History, LogOut, LayoutDashboard, Home, Info } from 'lucide-react';

const Navbar = () => {
    const { profile, resetProgress, logout } = useStore();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'HOME', path: '/', icon: Home },
        { name: 'ABOUT', path: '/about', icon: Info },
        { name: 'DASHBOARD', path: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full px-4 py-6"
        >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-3 rounded-[32px] bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300">
                
                {/* Profile Section */}
                <div className="flex items-center gap-4 pl-2">
                    <Link to="/">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[22px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative text-2xl bg-zinc-900 w-14 h-14 rounded-[20px] flex items-center justify-center border border-white/10 shadow-inner overflow-hidden">
                                {profile.avatar || '⚡'}
                            </div>
                        </motion.div>
                    </Link>
                    
                    <div className="flex flex-col">
                        <Link to="/" className="group">
                            <h1 className="text-lg font-black tracking-tighter uppercase leading-none text-white group-hover:text-emerald-400 transition-colors">
                                BEAT THE SPIKE
                            </h1>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                {profile.name || 'Guest'}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-black tracking-widest">
                                {profile.xp || 0} XP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center p-1.5 bg-zinc-950/40 rounded-full border border-white/5 shadow-inner">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative px-6 py-2.5 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
                                isActive(link.path) ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{link.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pr-2">
                    <AnimatePresence>
                        {location.pathname === '/dashboard' && (
                            <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetProgress}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors group"
                                title="Reset Progress"
                            >
                                <History className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {profile.name && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-3 bg-red-500/5 hover:bg-red-500/10 rounded-2xl border border-red-500/10 transition-all group"
                            title="Logout"
                        >
                            <span className="hidden md:block text-[10px] font-black text-red-500/70 group-hover:text-red-500 tracking-tighter">EXIT</span>
                            <LogOut className="w-5 h-5 text-red-500/70 group-hover:text-red-500 transition-colors" />
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;