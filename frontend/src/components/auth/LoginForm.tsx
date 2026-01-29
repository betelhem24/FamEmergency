import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginUser } from '../../store/thunks';
import { clearError } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Crosshair, ArrowRight } from 'lucide-react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/patient-dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center mb-10">
                <div className="p-4 bg-medical-navy rounded-[2rem] shadow-2xl mb-6 shadow-medical-navy/20">
                    <Crosshair className="text-medical-cyan w-10 h-10 animate-pulse" />
                </div>
                <h1 className="text-3xl font-black text-medical-navy italic tracking-tighter">FAM_EMERGENCY</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Life-Support Node Access</p>
            </div>

            <div className="medical-glass p-8 bg-white/70 backdrop-blur-2xl shadow-2xl border-white/60">
                <h2 className="text-xl font-black text-medical-navy mb-8 italic">Authorized Entry</h2>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            <Mail size={14} className="text-medical-cyan" /> Network ID (Email)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="medical-input"
                            placeholder="operator@secure.node"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            <Lock size={14} className="text-medical-cyan" /> Secure Keyphrase
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="medical-input"
                            placeholder="••••••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-medical-navy text-white rounded-2xl font-black shadow-2xl shadow-medical-navy/30 hover:shadow-medical-navy/50 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                    >
                        <span className="text-sm uppercase tracking-widest">{loading ? 'Verifying...' : 'Initiate Session'}</span>
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        New Operator?{' '}
                        <Link to="/register" className="text-medical-cyan hover:text-medical-navy transition-colors">
                            Register Node
                        </Link>
                    </p>
                </div>
            </div>

            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.3em] mt-8 opacity-50">
                Protected by E2E Medical Grade Encryption
            </p>
        </div>
    );
};

export default LoginForm;
