import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ShieldCheck, Heart, Stethoscope, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        medicalLicense: '',
        department: '',
    });

    // Inactivity Logout Timer (30 minutes)
    const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

    const resetLogoutTimer = () => {
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = setTimeout(() => {
            console.log("AUTH: Inactivity detected (30m). Logging out...");
            logout();
            navigate('/auth');
        }, 30 * 60 * 1000);
    };

    useEffect(() => {
        window.addEventListener('mousemove', resetLogoutTimer);
        window.addEventListener('keydown', resetLogoutTimer);
        window.addEventListener('touchstart', resetLogoutTimer);
        resetLogoutTimer();

        return () => {
            window.removeEventListener('mousemove', resetLogoutTimer);
            window.removeEventListener('keydown', resetLogoutTimer);
            window.removeEventListener('touchstart', resetLogoutTimer);
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : {
                ...formData,
                role
            };

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            login(data.user, data.token);
            navigate(data.user.role === 'doctor' ? '/doctor' : '/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-4 relative overflow-hidden bg-slate-950">
            {/* Top-aligned App Name - Glowing Glass Style Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-16 pb-8 text-center z-10"
            >
                <div className="inline-block glass-card px-8 py-4 rounded-3xl border border-white/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
                        Fam<span className="text-life-cyan drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">Emergency</span>
                    </h1>
                    <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.4em] mt-1">Life-Saving Identity Portal</p>
                </div>
            </motion.div>

            {/* Main Interactive Container - Pushed to Bottom for Mobile Thumb Access */}
            <div className="flex-1 flex flex-col justify-end pb-6 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card w-full max-w-md mx-auto rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden border border-white/10 shadow-2xl"
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-12 flex justify-center"
                            >
                                <GlassSpinner />
                            </motion.div>
                        ) : (
                            <motion.form
                                key={isLogin ? 'login' : 'signup'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div className="text-center mb-2">
                                    <h2 className="text-xl font-black text-white uppercase tracking-widest italic">
                                        {isLogin ? 'Access Portal' : 'Create Identity'}
                                    </h2>
                                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest">
                                        Authorized {role} Session
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-[9px] font-black uppercase text-center">{error}</div>
                                )}

                                {!isLogin && (
                                    <div className="space-y-1">
                                        <label className="text-[8px] uppercase tracking-widest text-slate-500 font-black ml-1">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={14} />
                                            <input
                                                type="text" required
                                                placeholder="Resident Name"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all"
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-[8px] uppercase tracking-widest text-slate-500 font-black ml-1">Email Hash</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={14} />
                                        <input
                                            type="email" required
                                            placeholder="identity@portal.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[8px] uppercase tracking-widest text-slate-500 font-black ml-1">Security Key</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={14} />
                                        <input
                                            type={showPassword ? 'text' : 'password'} required
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-11 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all"
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {!isLogin && role === 'doctor' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase tracking-widest text-slate-500 font-black ml-1">License ID</label>
                                            <input
                                                type="text" required
                                                placeholder="ML-XXXXXXX"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all"
                                                onChange={(e) => setFormData({ ...formData, medicalLicense: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Bottom Button Cluster */}
                                <div className="pt-6 grid grid-cols-2 gap-3">
                                    <button
                                        type="submit"
                                        className="col-span-2 bg-life-cyan py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                                    >
                                        {isLogin ? 'Establish Session' : 'Register Identity'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="bg-white/5 border border-white/10 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                                    >
                                        {isLogin ? 'Go Sign Up' : 'Go Sign In'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRole(role === 'patient' ? 'doctor' : 'patient')}
                                        className="bg-white/5 border border-white/10 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-life-cyan hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        {role === 'patient' ? <Stethoscope size={12} /> : <Heart size={12} />}
                                        {role === 'patient' ? 'Doctor' : 'Patient'}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;

