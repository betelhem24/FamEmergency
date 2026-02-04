import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-500">
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-50"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, var(--bg-secondary) 0%, var(--bg-primary) 70%)' }}
            />
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-[var(--accent-primary)] rounded-full blur-[120px]"
                        style={{
                            opacity: 0.1,
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
