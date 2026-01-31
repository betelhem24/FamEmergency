import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Heart, Stethoscope, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const { login } = useAuth();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            navigate(data.user.role === 'DOCTOR' ? '/doctor' : '/dashboard');
        } catch (error) {
            console.error('Auth failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#020617] text-white overflow-hidden flex flex-col font-sans antialiased relative">
            {/* GRADIENT BLOOMS */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-medical-cyan/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-life-cyan/15 blur-[120px] rounded-full" />
            </div>

            {/* TOP: FIXED HEADER */}
            <header className="relative z-50 pt-16 px-10 text-center flex-shrink-0">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h1 className="text-5xl font-extrabold tracking-tighter italic text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        FamEmergency
                    </h1>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <Activity size={12} className="text-medical-cyan animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-medical-cyan opacity-70">
                            Identity Link Portal
                        </span>
                    </div>
                </motion.div>
            </header>

            {/* MIDDLE: SCROLLABLE INPUTS (FLEX-GROW) */}
            <main className="flex-1 flex flex-col justify-center px-8 z-10 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 max-w-md mx-auto w-full"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative group">
                                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-medical-cyan/40 group-focus-within:text-medical-cyan transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="LEGAL FULL NAME"
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder:text-gray-500 focus:border-medical-cyan/50 focus:bg-white/[0.08] outline-none transition-all font-semibold"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-medical-cyan/40 group-focus-within:text-medical-cyan transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="PORTAL ACCESS EMAIL"
                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder:text-gray-500 focus:border-medical-cyan/50 focus:bg-white/[0.08] outline-none transition-all font-semibold"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-medical-cyan/40 group-focus-within:text-medical-cyan transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="ENCRYPTION KEY"
                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-5 pl-14 pr-24 text-sm text-white placeholder:text-gray-500 focus:border-medical-cyan/50 focus:bg-white/[0.08] outline-none transition-all font-semibold"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-medical-cyan/60 hover:text-medical-cyan transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <input type="submit" className="hidden" />
                    </form>
                </motion.div>
            </main>

            {/* BOTTOM: ACTION CLUSTER (Z-INDEX 999) */}
            <footer className="relative z-[999] px-8 pb-12 pt-6 flex-shrink-0">
                <div className="max-w-md mx-auto glass-card rounded-[2.5rem] p-6 shadow-2xl pointer-events-auto">
                    {/* ROLE TOGGLE */}
                    <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('PATIENT')}
                            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${role === 'PATIENT' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-400'
                                }`}
                        >
                            <Heart size={12} className={role === 'PATIENT' ? 'text-red-400' : ''} /> Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('DOCTOR')}
                            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${role === 'DOCTOR' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-400'
                                }`}
                        >
                            <Stethoscope size={12} className={role === 'DOCTOR' ? 'text-blue-400' : ''} /> Doctor
                        </button>
                    </div>

                    {/* MAIN BUTTONS */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`group relative overflow-hidden py-5 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-widest ${isLogin
                                    ? 'bg-life-cyan text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95'
                                    : 'bg-white/5 text-slate-400 border border-white/10'
                                }`}
                        >
                            {loading && isLogin ? <GlassSpinner size="xs" /> : "Sign In"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className={`py-5 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-widest active:scale-95 ${!isLogin
                                    ? 'bg-medical-navy text-white shadow-lg active:scale-95'
                                    : 'bg-white/5 text-slate-400 border border-white/10'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3 opacity-40">
                        <ShieldCheck size={14} className="text-medical-cyan" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white">Hybrid Link Secure</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Auth;
