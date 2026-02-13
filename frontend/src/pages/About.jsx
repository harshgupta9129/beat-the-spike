import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-20"
            >
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">OUR MISSION</h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    We're building the future of metabolic awareness. By making sugar tracking simple, visual, and intelligent, we empower you to take control of your health.
                </p>
            </motion.div>

            <div className="grid gap-12">
                {[
                    {
                        title: "The Problem",
                        content: "Modern diets are saturated with hidden sugars, leading to widespread metabolic health issues. Tracking intake is often tedious and demotivating.",
                        icon: <Target className="w-6 h-6 text-red-400" />
                    },
                    {
                        title: "Our Solution",
                        content: "Beat The Spike gamifies health tracking. We combine beautiful design with powerful analytics to make staying healthy addictive in the best way possible.",
                        icon: <Heart className="w-6 h-6 text-pink-400" />
                    },
                    {
                        title: "For Everyone",
                        content: "Whether you're an athlete optimizing performance or someone starting their health journey, our tools adapt to your specific needs and goals.",
                        icon: <Users className="w-6 h-6 text-blue-400" />
                    }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-6 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                        <div className="p-4 rounded-2xl bg-white/5 shrink-0">
                            {item.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-3">{item.title}</h2>
                            <p className="text-zinc-400 leading-relaxed">{item.content}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default About;
