import React from 'react';
import { Sun, Moon, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const themes: { id: 'dark' | 'light' | 'blue'; icon: any; label: string }[] = [
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'light', icon: Sun, label: 'White' },
        { id: 'blue', icon: Cpu, label: 'Blue' }
    ];

    return (
        <div className="flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-2 rounded-full transition-all flex items-center gap-2 group relative ${theme === t.id ? 'bg-white/10 text-[var(--accent-primary)]' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    title={t.label}
                >
                    <t.icon size={16} />
                    {theme === t.id && (
                        <motion.span
                            layoutId="activeThemeLabel"
                            className="text-[8px] font-black uppercase tracking-widest leading-none pr-1"
                        >
                            {t.label}
                        </motion.span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
