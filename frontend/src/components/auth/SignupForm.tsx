import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser } from '../../store/thunks';
import { clearError } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, UserCircle2, Crosshair, FileBadge, Building2 } from 'lucide-react';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'PATIENT' as 'PATIENT' | 'DOCTOR',
        medicalLicense: '',
        department: ''
    });
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
        dispatch(registerUser(formData));
    };

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom duration-700">
            <div className="flex flex-col items-center mb-10">
                <div className="p-4 bg-medical-navy rounded-[2rem] shadow-2xl mb-6 shadow-medical-navy/20">
                    <Crosshair className="text-medical-cyan w-10 h-10 animate-pulse" />
                </div>
                <h1 className="text-3xl font-black text-medical-navy italic tracking-tighter">FAM_EMERGENCY</h1>
                <p className="text-[10px] font-black text-slate-400 mt-2">Node Registration Protocol</p>
            </div>

            <div className="medical-glass p-8 bg-white/70 backdrop-blur-2xl shadow-2xl border-white/60">
                <h2 className="text-xl font-black text-medical-navy mb-8 italic">Create New Operator</h2>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3">
                            <User size={14} className="text-medical-cyan" /> Operator Legal Name
                        </label>
                        <input
                            type="text"
                            className="medical-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3">
                            <Mail size={14} className="text-medical-cyan" /> Network ID (Email)
                        </label>
                        <input
                            type="email"
                            className="medical-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="operator@secure.node"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3">
                            <Lock size={14} className="text-medical-cyan" /> Access Keyphrase
                        </label>
                        <input
                            type="password"
                            className="medical-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3">
                            <UserCircle2 size={14} className="text-medical-cyan" /> Registry Role
                        </label>
                        <select
                            className="medical-input"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'PATIENT' | 'DOCTOR' })}
                        >
                            <option value="PATIENT">STANDARD_PATIENT</option>
                            <option value="DOCTOR">MEDICAL_RESPONDER</option>
                        </select>
                    </div>

                    {formData.role === 'DOCTOR' && (
                        <>
                            <div className="animate-in fade-in slide-in-from-top duration-500">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3">
                                    <FileBadge size={14} className="text-medical-cyan" /> Medical License ID
                                </label>
                                <input
                                    type="text"
                                    className="medical-input"
                                    value={formData.medicalLicense}
                                    onChange={(e) => setFormData({ ...formData, medicalLicense: e.target.value })}
                                    placeholder="LIC-12345678"
                                    required={formData.role === 'DOCTOR'}
                                />
                            </div>

                            <div className="animate-in fade-in slide-in-from-top duration-500 delay-100">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3">
                                    <Building2 size={14} className="text-medical-cyan" /> Department
                                </label>
                                <select
                                    className="medical-input"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    required={formData.role === 'DOCTOR'}
                                >
                                    <option value="">Select Department</option>
                                    <option value="Emergency">Emergency (ER)</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="General">General Practice</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-medical-navy text-white rounded-2xl font-black shadow-2xl shadow-medical-navy/30 hover:shadow-medical-navy/50 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                    >
                        <span className="text-sm">{loading ? 'Registering...' : 'Confirm Registration'}</span>
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400">
                        Known Operator?{' '}
                        <Link to="/login" className="text-medical-cyan hover:text-medical-navy transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>

            <p className="text-[9px] text-center text-slate-400 font-bold mt-8 opacity-50">
                Encrypted Patient Data Protection System v3.1
            </p>
        </div>
    );
};

export default SignupForm;
