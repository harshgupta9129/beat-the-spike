
import React from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", damping: 20, stiffness: 100 }
    }
};

export const BentoItem = ({ children, className = "" }) => {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            className={`glass rounded-[32px] p-6 neo-shadow overflow-hidden relative group ${className}`}
        >
            {children}
        </motion.div>
    );
};

export const BentoGrid = ({ children }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto px-4 py-8"
        >
            {children}
        </motion.div>
    );
};
