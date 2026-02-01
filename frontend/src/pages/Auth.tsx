import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Heart, Stethoscope, ShieldCheck, Sun, Moon, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const { login } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const cycleTheme = () => {
        if (theme === 'dark') setTheme('light');
        else if (theme === 'light') setTheme('blue');
        else setTheme('dark');
    };

    const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Cpu;

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { ...formData, role };

            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Auth failed');

            login(data.user, data.token);
            // Redirect based on App.tsx routes: Patient is '/', Doctor is '/doctor'
            navigate(data.user.role === 'DOCTOR' ? '/doctor' : '/');
        } catch (error) {
            console.error('Auth failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#020617] text-white overflow-hidden font-sans antialiased relative selection:bg-medical-cyan selection:text-black">
            {/* CLEAN SURFACE: Root Background Blur Only */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-medical-cyan/10 blur-[180px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-life-cyan/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 backdrop-blur-[12px] bg-black/20" />
            </div>

            {/* ARTCHITECTURE 1: HEADER (TOP 10%) */}
            <header className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full text-center z-50 pointer-events-none">
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-3"
                >
                    <div className="pointer-events-auto absolute top-[-40px] right-8">
                        <button onClick={cycleTheme} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all text-medical-cyan">
                            <ThemeIcon size={20} />
                        </button>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-medical-cyan to-white uppercase leading-none drop-shadow-2xl">
                        FamEmergency
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] w-8 bg-medical-cyan/30" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-medical-cyan drop-shadow-md">
                            Identity Command Node
                        </span>
                        <div className="h-[1px] w-8 bg-medical-cyan/30" />
                    </div>
                </motion.div>
            </header>

            {/* ARCHITECTURE 2: INPUT FLIGHT (CENTERED) */}
            <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-medical-cyan/60" size={18} />
                                        <input
                                            type="text"
                                            placeholder="LEGAL IDENTITY NAME"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-xs text-white placeholder:text-slate-600 focus:border-medical-cyan/30 focus:bg-white/[0.06] outline-none transition-all font-black uppercase tracking-widest"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-medical-cyan/60" size={18} />
                            <input
                                type="email"
                                placeholder="ACCESS CHANNEL (EMAIL)"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-xs text-white placeholder:text-slate-600 focus:border-medical-cyan/30 focus:bg-white/[0.06] outline-none transition-all font-black uppercase tracking-widest"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-medical-cyan/60" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="ENCRYPTION KEY"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-6 pl-16 pr-24 text-xs text-white placeholder:text-slate-600 focus:border-medical-cyan/30 focus:bg-white/[0.06] outline-none transition-all font-black uppercase tracking-widest"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <input type="submit" className="hidden" />
                    </form>
                </motion.div>
            </main>

            {/* ARTCHITECTURE 3: ACTIONS (BOTTOM 10%) */}
            <footer className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-[99] flex flex-col gap-6">
                {/* ROLE TOGGLE - CLEAN NO BLUR */}
                <div className="flex bg-white/[0.03] p-1.5 rounded-3xl border border-white/5">
                    <button
                        type="button"
                        onClick={() => setRole('PATIENT')}
                        className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 ${role === 'PATIENT' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'
                            }`}
                    >
                        <Heart size={14} className={role === 'PATIENT' ? 'text-red-500' : ''} /> Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('DOCTOR')}
                        className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 ${role === 'DOCTOR' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'
                            }`}
                    >
                        <Stethoscope size={14} className={role === 'DOCTOR' ? 'text-blue-500' : ''} /> Doctor
                    </button>
                </div>

                {/* MAIN COMMANDS */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => isLogin ? handleSubmit(null as any) : setIsLogin(true)}
                        disabled={loading}
                        className={`py-6 rounded-3xl flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.4em] pointer-events-auto !important ${isLogin
                            ? 'bg-medical-cyan text-black shadow-[0_20px_40px_rgba(6,182,212,0.2)] active:scale-95'
                            : 'bg-white/[0.03] text-slate-500 border border-white/5 hover:bg-white/[0.06]'
                            }`}
                    >
                        {loading && isLogin ? <GlassSpinner /> : "Sign In"}
                    </button>
                    <button
                        type="button"
                        onClick={() => !isLogin ? handleSubmit(null as any) : setIsLogin(false)}
                        disabled={loading}
                        className={`py-6 rounded-3xl flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.4em] pointer-events-auto !important ${!isLogin
                            ? 'bg-white text-black shadow-2xl active:scale-95'
                            : 'bg-white/[0.03] text-slate-500 border border-white/5 hover:bg-white/[0.06]'
                            }`}
                    >
                        {loading && !isLogin ? <GlassSpinner /> : "Sign Up"}
                    </button>
                </div>

                <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-slate-600 italic">
                    <ShieldCheck size={10} className="inline mr-2 text-medical-cyan" /> Secure Hybrid Channel Loop
                </p>
            </footer>
        </div>
    );
};

export default Auth;
