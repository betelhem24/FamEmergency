import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ShieldCheck, Heart, Stethoscope, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const { login } = useAuth();
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
        <div className="min-h-[90vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic drop-shadow-lg">FamEmergency</h1>
                    <p className="text-life-cyan/80 text-[10px] font-black uppercase tracking-[0.3em]">Shiny Blue Glass Registry</p>
                </div>

                {/* Header Navigation: Sign In / Sign Up Toggles */}
                {!loading && (
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-life-cyan text-white shadow-lg shadow-cyan-500/30' : 'text-slate-500 hover:text-white'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-life-cyan text-white shadow-lg shadow-cyan-500/30' : 'text-slate-500 hover:text-white'}`}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12"><GlassSpinner /></motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSubmit} className="space-y-4"
                        >
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-[10px] font-black uppercase text-center">{error}</div>
                            )}

                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={16} />
                                        <input
                                            type="text" required
                                            placeholder="Leo Brooks"
                                            className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all font-medium"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={16} />
                                    <input
                                        type="email" required
                                        placeholder="leo@gmail.com"
                                        className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all font-medium"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'} required
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all font-medium"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && role === 'doctor' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">Medical License</label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={16} />
                                            <input
                                                type="text" required
                                                placeholder="ML-48291-X"
                                                className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all font-medium"
                                                onChange={(e) => setFormData({ ...formData, medicalLicense: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black ml-1">Department</label>
                                        <div className="relative group">
                                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={16} />
                                            <input
                                                type="text" required
                                                placeholder="Emergency / Cardiology"
                                                className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all font-medium"
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Submit and Role Role Toggle at Bottom */}
                            <div className="pt-4 space-y-4">
                                <button
                                    type="submit"
                                    className="w-full bg-life-cyan py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    CONFIRM ACCESS
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole(role === 'patient' ? 'doctor' : 'patient')}
                                    className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-life-cyan hover:bg-white/10 transition-all group"
                                >
                                    {role === 'patient' ? <Stethoscope size={14} /> : <Heart size={14} />}
                                    {role === 'patient' ? 'Doctor View' : 'Patient View'}
                                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Auth;
