import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-medical-cyan selection:text-[#020617] overflow-hidden relative">
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020617] via-[#020617] to-[#0f172a] pointer-events-none" />
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-medical-cyan/10 rounded-full blur-[120px]"
                        style={{
                            width: '40rem',
                            height: '40rem',
                            left: (Math.random() * 100) + '%',
                            top: (Math.random() * 100) + '%',
                        }}
                    />
                ))}
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8 pb-32 max-w-md md:max-w-2xl lg:max-w-4xl min-h-screen flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default Layout;
