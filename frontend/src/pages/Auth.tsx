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
        <div className="h-screen bg-slate-950 overflow-hidden flex flex-col relative font-sans antialiased">
            <style dangerouslySetInnerHTML={{
                __html: `
                .glass-accel { transform: translateZ(0); }
                @media (max-width: 768px) {
                    .glass-blur { backdrop-filter: blur(10px) !important; }
                }
            `}} />

            {/* BACKGROUND DYNAMICS */}
            <div className="absolute inset-0 z-0 text-white">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-medical-navy/40 to-transparent" />
                <div className="absolute top-[10%] left-[10%] w-[80vw] h-[80vw] bg-medical-cyan/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-life-cyan/5 blur-[100px] rounded-full" />
            </div>

            {/* HEADER: GLOWING GLASS (TOP-ALIGNED) */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-20 pt-16 px-8 text-center"
            >
                <div className="inline-block relative">
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase relative z-10">
                        FamEmergency
                    </h1>
                    <div className="absolute inset-0 blur-2xl bg-medical-cyan/30 -z-10 scale-110" />
                </div>
                <p className="mt-4 text-[10px] text-medical-cyan font-black uppercase tracking-[0.4em] opacity-80">
                    Priority Response Identity Portal
                </p>
            </motion.header>

            {/* SPACER */}
            <div className="flex-1" />

            {/* INTERACTIVE CLUSTER: MIDDLE -> BOTTOM (REQUIREMENT RESTORATION) */}
            <motion.div
                initial={{ y: 500 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 100 }}
                className="relative z-30 p-8 pb-10 pt-10 rounded-t-[3.5rem] bg-white/[0.03] backdrop-blur-3xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transform translateZ(0)"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="relative"
                            >
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-medical-cyan opacity-40">
                                    <UserIcon size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="LEGAL FULL NAME"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-sm text-white placeholder:text-white/20 focus:border-medical-cyan/50 outline-none transition-all font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-medical-cyan opacity-40">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="PORTAL IDENTITY (EMAIL)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-sm text-white placeholder:text-white/20 focus:border-medical-cyan/50 outline-none transition-all font-bold"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-medical-cyan opacity-40">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="ENCRYPTION KEY"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-24 text-sm text-white placeholder:text-white/20 focus:border-medical-cyan/50 outline-none transition-all font-bold"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-medical-cyan"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* ACTION BUTTONS (SIDE BY SIDE REQUIREMENT) */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`py-5 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-widest ${isLogin ? 'bg-life-cyan text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-400 border border-white/5'
                                }`}
                        >
                            {loading && isLogin ? <GlassSpinner size="xs" /> : "Sign In"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className={`py-5 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-widest ${!isLogin ? 'bg-medical-navy text-white shadow-lg' : 'bg-white/5 text-slate-400 border border-white/5'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* ROLE TOGGLE (BOTTOMMOST REQUIREMENT) */}
                    <div className="mt-6 flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => setRole('PATIENT')}
                            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${role === 'PATIENT' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500'
                                }`}
                        >
                            <Heart size={12} /> Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('DOCTOR')}
                            className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${role === 'DOCTOR' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500'
                                }`}
                        >
                            <Stethoscope size={12} /> Doctor
                        </button>
                    </div>
                </form>

                <div className="mt-8 flex items-center justify-center px-2 opacity-30">
                    <ShieldCheck size={12} className="text-medical-cyan mr-2" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Secured via Dual-DB Encryption Node</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
