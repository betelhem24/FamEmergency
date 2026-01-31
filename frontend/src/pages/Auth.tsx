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
            // Requirement: Connect to live backend (logic will be finalized in controllers stage)
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
            {/* GPU Boost & Mobile Optimizations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .glass-accel { transform: translateZ(0); }
                @media (max-width: 768px) {
                    .glass-blur { backdrop-filter: blur(10px) !important; }
                }
            `}} />

            {/* BACKGROUND DYNAMICS */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-medical-navy/40 to-transparent" />
                <div className="absolute top-[10%] left-[10%] w-[80vw] h-[80vw] bg-medical-cyan/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-life-cyan/5 blur-[100px] rounded-full" />
            </div>

            {/* HEADER: GLOWING GLASS (REQUIREMENT) */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-20 pt-20 px-8 text-center"
            >
                <div className="inline-block relative">
                    <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase relative z-10 transition-all">
                        FamEmergency
                    </h1>
                    <div className="absolute inset-0 blur-3xl bg-medical-cyan/40 -z-10 scale-125 animate-pulse" />
                </div>
                <p className="mt-6 text-[11px] text-medical-cyan font-black uppercase tracking-[0.5em] opacity-80">
                    Live Response & Critical Support Node
                </p>
            </motion.header>

            {/* SPACER */}
            <div className="flex-1" />

            {/* INTERACTIVE CLUSTER: BOTTOM (REQUIREMENT) */}
            <motion.div
                initial={{ y: 500 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 120 }}
                className="relative z-30 p-8 pb-12 pt-10 rounded-t-[4rem] bg-white/[0.03] backdrop-blur-3xl border-t border-white/10 shadow-[0_-30px_60px_rgba(0,0,0,0.6)] glass-accel glass-blur"
            >
                {/* ROLE TOGGLE (REQUIREMENT) */}
                <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 mb-8 shadow-inner">
                    <button
                        onClick={() => setRole('PATIENT')}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${role === 'PATIENT' ? 'bg-life-cyan text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500'
                            }`}
                    >
                        <Heart size={14} className={role === 'PATIENT' ? 'animate-pulse' : ''} /> Patient
                    </button>
                    <button
                        onClick={() => setRole('DOCTOR')}
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${role === 'DOCTOR' ? 'bg-medical-navy text-white shadow-lg shadow-blue-500/10' : 'text-slate-500'
                            }`}
                    >
                        <Stethoscope size={14} /> Doctor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-medical-cyan opacity-40">
                                    <UserIcon size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="IDENTITY: FULL NAME"
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 text-sm text-white placeholder:text-white/20 focus:border-medical-cyan/50 outline-none transition-all font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-medical-cyan opacity-40">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="COMMUNICATION NODE: EMAIL"
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 text-sm text-white placeholder:text-white/20 focus:border-medical-cyan/50 outline-none transition-all font-bold"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-medical-cyan opacity-40">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="ENCRYPTION KEY: PASSWORD"
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-24 text-sm text-white placeholder:text-white/20 focus:border-medical-cyan/50 outline-none transition-all font-bold"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-8 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <EyeOff size={18} className="text-slate-500" /> : <Eye size={18} className="text-medical-cyan opacity-60" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-life-cyan py-6 rounded-3xl flex items-center justify-center gap-4 shadow-3xl shadow-cyan-500/40 active:scale-95 transition-all mt-8 group"
                    >
                        {loading ? <GlassSpinner size="sm" /> : (
                            <>
                                <span className="text-white font-black text-sm uppercase tracking-[0.3em] italic">
                                    {isLogin ? "INITIALIZE LINK" : "ESTABLISH IDENTITY"}
                                </span>
                                <ChevronRight size={20} className="text-white group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 flex items-center justify-between px-2">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        {isLogin ? "Generate New Resident Identity" : "Access Established Portal"}
                    </button>
                    <div className="flex items-center gap-2 opacity-20">
                        <ShieldCheck size={14} className="text-medical-cyan" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">TLS 1.3</span>
                    </div>
                </div>

                {/* BOTTOM GRIP */}
                <div className="mt-12 h-1.5 w-16 bg-white/5 rounded-full mx-auto shadow-inner" />
            </motion.div>
        </div>
    );
};

export default Auth;
