import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-navy-deep text-white font-sans selection:bg-life-cyan selection:text-navy-deep overflow-hidden relative">
            {/* Dynamic Background Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            opacity: 0.1,
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%"
                        }}
                        animate={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            transition: {
                                duration: 20 + Math.random() * 20,
                                repeat: Infinity,
                                ease: "linear"
                            }
                        }}
                        className="absolute w-64 h-64 bg-life-cyan/5 rounded-full blur-[100px]"
                    />
                ))}
            </div>

            <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-dark/20 via-navy-deep to-navy-deep pointer-events-none" />

            <main className="relative z-10 container mx-auto px-4 py-8 pb-32 max-w-md md:max-w-2xl lg:max-w-4xl min-h-screen flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default Layout;
