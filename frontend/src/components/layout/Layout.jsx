import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#060608] text-zinc-100 font-sans selection:bg-emerald-500/30 flex flex-col relative overflow-x-hidden">
            
            {/* --- IMMERSIVE BACKGROUND LAYER --- */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* Primary Emerald Glow */}
                <div 
                    className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-emerald-500/[0.07] blur-[120px] rounded-full animate-pulse" 
                    style={{ animationDuration: '8s' }} 
                />
                
                {/* Secondary Purple Glow */}
                <div 
                    className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-500/[0.07] blur-[120px] rounded-full animate-pulse" 
                    style={{ animationDelay: '2s', animationDuration: '10s' }} 
                />

                {/* Grain/Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                </div>
            </div>

            {/* --- GLOBAL STYLES (Scrollbar) --- */}
            <style dangerouslySetInnerHTML={{ __html: `
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #060608;
                }
                ::-webkit-scrollbar-thumb {
                    background: #27272a;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #3f3f46;
                }
            `}} />

            {/* --- CORE STRUCTURE (Logic Intact) --- */}
            <Navbar />
            
            <main className="flex-grow relative z-10">
                {/* UX Note: The content is wrapped in a container 
                    to ensure consistent max-width across all pages 
                */}
                <div className="max-w-6xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Layout;