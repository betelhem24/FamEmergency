import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Download, Share2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const LifeKeyPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const qrValue = `EMERGENCY_LIFEKEY:${user?.id}:${user?.name}:${user?.bloodType || 'Unknown'}:${user?.allergies?.join(',') || 'None'}`;

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-between pb-12">
            {/* Header */}
            <header className="w-full flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">Emergency</h1>
                    <p className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] mt-1">Life-Key Hub</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl text-transparent">
                    <ChevronLeft size={24} />
                </div>
            </header>

            {/* Main QR Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center w-full max-w-sm"
            >
                <div className="relative group">
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-[3rem] blur-[80px] opacity-20 animate-pulse"></div>

                    <div className="glass-card p-10 rounded-[4rem] border-2 border-white/10 relative overflow-hidden flex flex-col items-center gap-8">
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                            <QRCodeSVG
                                value={qrValue}
                                size={220}
                                level="H"
                                includeMargin={false}
                            />
                        </div>

                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <QrCode size={16} className="text-[var(--accent-primary)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Bio-Data Link</span>
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{user?.name}</h2>
                            <div className="flex items-center justify-center gap-3">
                                <div className="px-3 py-1 bg-red-500/10 rounded-full border border-red-500/30">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{user?.bloodType || 'B+'}</span>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center space-y-4 px-6">
                    <p className="text-sm font-black text-white italic leading-tight uppercase">
                        This Life-Key allows first responders to access your medical vault instantly.
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                        Data is encrypted and only accessible during authorized emergency sessions.
                    </p>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="w-full max-w-sm grid grid-cols-2 gap-4 mt-8">
                <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Download size={18} /> Save Image
                </button>
                <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Share2 size={18} /> Share Key
                </button>
            </div>

            <div className="mt-8 flex items-center gap-2 px-6 py-2 bg-[var(--accent-primary)]/10 rounded-full border border-[var(--accent-primary)]/20">
                <Shield size={14} className="text-[var(--accent-primary)]" />
                <span className="text-[8px] font-black text-[var(--accent-primary)] uppercase tracking-widest">Quantum Encryption Enabled</span>
            </div>
        </div>
    );
};

export default LifeKeyPage;
