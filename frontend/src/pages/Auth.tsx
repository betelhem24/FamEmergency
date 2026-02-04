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
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        medicalLicense: '',
        department: '',
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
        setError(null);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const trimmedEmail = formData.email.trim();
            const trimmedPassword = formData.password.trim();
            const trimmedName = formData.name.trim();

            const payload = isLogin
                ? { email: trimmedEmail, password: trimmedPassword }
                : { ...formData, name: trimmedName, email: trimmedEmail, password: trimmedPassword, role };

            console.log('[AUTH_DEBUG] Sending payload:', payload);

            const MAX_RETRIES = 10;
            const INITIAL_DELAY_MS = 2000; // 2 seconds
            const MAX_DELAY_MS = 30000; // 30 seconds
            const JITTER_MS = 500; // ±500ms variance

            let response: Response | undefined;
            for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                try {
                    response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    if (response.ok) break; // Break if successful response
                    // If not OK (e.g. 500), we might want to retry, or just break depending on logic.
                    // For now, let's treat 500s as retriable, 400s as permanent.
                    if (response.status < 500 && response.status !== 429) break;
                } catch (error) {
                    if (attempt < MAX_RETRIES - 1) {
                        const exponentialDelay = Math.min(
                            Math.pow(2, attempt) * INITIAL_DELAY_MS,
                            MAX_DELAY_MS
                        );
                        const jitter = Math.random() * (JITTER_MS * 2) - JITTER_MS;
                        const delayWithJitter = Math.max(0, exponentialDelay + jitter);

                        console.log(`[RETRY] Attempt ${attempt + 1}: Backend unreachable. Retrying in ${Math.round(delayWithJitter)}ms...`, error);
                        await new Promise(resolve => setTimeout(resolve, delayWithJitter));
                    } else {
                        throw error;
                    }
                }

                // Backoff logic needs to be here if we want to retry on non-OK status codes too
                // For simplified 'connection failed' retries, the catch block handles it.
                // If we want to retry on 500s, we need a wait here.
                if (response && !response.ok) {
                    // Adding delay for server errors if we decide to retry them
                    // (Simplified for this fix: we rely on the loop)
                }
            }

            if (!response) throw new Error('Network error: Unable to connect to server');

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Auth failed');

            login(data.user, data.token);
            navigate(data.user.role === 'DOCTOR' ? '/doctor' : '/');
        } catch (error: any) {
            console.error('Auth failed', error);
            setError(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden font-sans antialiased relative selection:bg-[var(--accent-primary)] selection:text-black">
            {/* CLEAN SURFACE: Root Background Blur Only */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[var(--accent-primary)]/10 blur-[180px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[var(--accent-glow)]/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 backdrop-blur-[12px] bg-black/20" />
            </div>

            {/* ARTCHITECTURE 1: HEADER (TOP 10%) */}
            <header className="absolute top-[8%] left-1/2 -translate-x-1/2 w-full text-center z-50 pointer-events-none">
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-3"
                >
                    <div className="pointer-events-auto absolute top-[-40px] right-8">
                        <button onClick={cycleTheme} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all text-[var(--accent-primary)]">
                            <ThemeIcon size={20} />
                        </button>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-white leading-none drop-shadow-2xl">
                        FamEmergency
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] w-8 bg-[var(--accent-primary)]/30" />
                        <span className="text-[10px] font-black text-[var(--accent-primary)] drop-shadow-md">
                            Identity Command Node
                        </span>
                        <div className="h-[1px] w-8 bg-[var(--accent-primary)]/30" />
                    </div>
                </motion.div>
            </header>

            {/* ARCHITECTURE 2: INPUT FLIGHT (CENTERED) */}
            <main className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm z-10 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6" // Increased spacing
                >
                    {/* ROLE TOGGLE - Fix Overlap: Added more margin bottom */}
                    <div className="flex bg-white/[0.03] p-1.5 rounded-3xl border border-white/5 mb-12">
                        <button
                            type="button"
                            onClick={() => {
                                setRole('PATIENT');
                                setError(null);
                            }}
                            className={`flex-1 py-4 rounded-2xl text-[9px] font-black transition-all flex items-center justify-center gap-2 ${role === 'PATIENT' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'
                                }`}
                        >
                            <Heart size={14} className={role === 'PATIENT' ? 'text-red-500' : ''} /> Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setRole('DOCTOR');
                                setError(null);
                            }}
                            className={`flex-1 py-4 rounded-2xl text-[9px] font-black transition-all flex items-center justify-center gap-2 ${role === 'DOCTOR' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'
                                }`}
                        >
                            <Stethoscope size={14} className={role === 'DOCTOR' ? 'text-blue-500' : ''} /> Doctor
                        </button>
                    </div>

                    {/* ERROR MESSAGE DISPLAY */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-[10px] font-black italic flex items-center gap-3 backdrop-blur-md"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="signup-fields"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/60" size={18} />
                                        <input
                                            type="text"
                                            placeholder="LEGAL IDENTITY NAME"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-xs text-white placeholder:text-slate-600 focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.06] outline-none transition-all font-black"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required={!isLogin}
                                        />
                                    </div>

                                    {role === 'DOCTOR' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/60" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="MEDICAL LICENSE ID"
                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-xs text-white placeholder:text-slate-600 focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.06] outline-none transition-all font-black"
                                                    value={formData.medicalLicense}
                                                    onChange={(e) => setFormData({ ...formData, medicalLicense: e.target.value })}
                                                    required={role === 'DOCTOR'}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Stethoscope className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/60" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="DEPARTMENT"
                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-xs text-white placeholder:text-slate-600 focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.06] outline-none transition-all font-black"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/60" size={18} />
                            <input
                                type="email"
                                placeholder="ACCESS CHANNEL (EMAIL)"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-xs text-white placeholder:text-slate-600 focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.06] outline-none transition-all font-black"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/60" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="ENCRYPTION KEY"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-16 pr-24 text-xs text-white placeholder:text-slate-600 focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.06] outline-none transition-all font-black"
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
            <footer className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-[99] flex flex-col gap-4">
                {/* MAIN COMMANDS */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            if (isLogin) {
                                handleSubmit(null as any);
                            } else {
                                setIsLogin(true);
                                setError(null);
                            }
                        }}
                        disabled={loading}
                        className={`py-5 rounded-3xl flex items-center justify-center gap-3 transition-all font-black text-[10px] pointer-events-auto !important ${isLogin
                            ? 'bg-[var(--accent-primary)] text-black shadow-[0_20px_40px_rgba(6,182,212,0.2)] active:scale-95'
                            : 'bg-white/[0.03] text-slate-500 border border-white/5 hover:bg-white/[0.06]'
                            }`}
                    >
                        {loading && isLogin ? <GlassSpinner /> : "Sign In"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (!isLogin) {
                                handleSubmit(null as any);
                            } else {
                                setIsLogin(false);
                                setError(null);
                            }
                        }}
                        disabled={loading}
                        className={`py-5 rounded-3xl flex items-center justify-center gap-3 transition-all font-black text-[10px] pointer-events-auto !important ${!isLogin
                            ? 'bg-white text-black shadow-2xl active:scale-95'
                            : 'bg-white/[0.03] text-slate-500 border border-white/5 hover:bg-white/[0.06]'
                            }`}
                    >
                        {loading && !isLogin ? <GlassSpinner /> : "Sign Up"}
                    </button>
                </div>

                <p className="text-center text-[8px] font-black text-slate-600 italic">
                    <ShieldCheck size={10} className="inline mr-2 text-[var(--accent-primary)]" /> Secure Hybrid Channel Loop
                </p>
            </footer>
        </div>
    );
};

export default Auth;
