import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, ShieldAlert, Activity, Droplet, BellRing, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSensors } from '../hooks/useSensors';

const PatientHome: React.FC = () => {
    const { user } = useAuth();
    const [fallTriggered, setFallTriggered] = useState(false);

    useSensors(() => {
        setFallTriggered(true);
    });

    const patientName = user?.name || "Patient";
    const userId = user?.id || "USER-PENDING";

    return (
        <div className="space-y-8 pt-4 pb-24 h-full overflow-y-auto no-scrollbar relative animate-in fade-in duration-700">
            {/* Fall Detection Overlay */}
            <AnimatePresence>
                {fallTriggered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-red-600/95 flex flex-col items-center justify-center p-10 text-center"
                    >
                        <div className="bg-white p-8 rounded-full mb-10 animate-bounce shadow-2xl">
                            < BellRing size={64} className="text-red-600" />
                        </div>
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Fall Detected!</h2>
                        <p className="text-white/90 font-black text-xs uppercase tracking-[0.3em] mb-12 max-w-xs">Emergency broadcast initiated. Unified response active.</p>

                        <div className="flex flex-col w-full gap-5">
                            <button
                                onClick={() => setFallTriggered(false)}
                                className="w-full py-7 bg-white text-red-600 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 pointer-events-auto !important"
                            >
                                <X size={20} /> I am okay
                            </button>
                            <button className="w-full py-7 bg-black/30 border border-white/20 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all pointer-events-auto !important">
                                Contact Response Hub
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Big Red SOS Button at Top */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2"
            >
                <button className="w-full relative group pointer-events-auto !important">
                    <div className="absolute inset-0 bg-red-600 rounded-[3rem] blur-[60px] opacity-20 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-10 rounded-[3rem] flex flex-col items-center justify-center shadow-[0_30px_60px_rgba(239,68,68,0.2)] border border-red-400/20 active:scale-[0.97] transition-all">
                        <div className="bg-white/10 p-5 rounded-3xl mb-6 border border-white/20">
                            <Phone className="text-white fill-white" size={40} />
                        </div>
                        <h3 className="font-black text-3xl text-white tracking-widest uppercase italic leading-none">Brodcast: SOS</h3>
                        <p className="text-red-100/60 text-[10px] font-black tracking-[0.4em] uppercase mt-3">Clinical priority enabled</p>
                    </div>
                </button>
            </motion.div>

            {/* Pulsing Status Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-4 py-2"
            >
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></span>
                </div>
                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] drop-shadow-md">Identity Sync Active</p>
            </motion.div>

            {/* Giant Identity Card - CLEAN SURFACE (One Blur Only) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[4rem] p-12 text-center shadow-2xl relative overflow-hidden mx-2 border border-white/5"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <ShieldAlert size={180} />
                </div>

                {/* Giant QR Code */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-8 rounded-[3.5rem] mx-auto w-fit mb-12 shadow-2xl border border-slate-100"
                >
                    <QRCodeSVG value={`https://famemergency.com/v/${userId}`} size={220} />
                </motion.div>

                <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-tight italic leading-none">{patientName}</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 mb-10">Global Clinical ID Node</p>

                {/* Info Box - NO NESTED BLURS */}
                <div className="flex items-center justify-center gap-6 mt-10">
                    <div className="bg-white/[0.03] px-8 py-4 rounded-3xl border border-white/5 flex-1">
                        <div className="flex items-center justify-center gap-2 text-red-500 mb-1">
                            <Droplet size={18} fill="currentColor" />
                            <span className="text-2xl font-black text-white">{user?.bloodType || 'N/A'}</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Blood Type</p>
                    </div>
                    <div className="bg-white/[0.03] px-8 py-4 rounded-3xl border border-white/5 flex-1">
                        <div className="flex items-center justify-center gap-2 text-medical-cyan mb-1">
                            <Activity size={18} />
                            <span className="text-xs font-black text-white uppercase truncate max-w-[100px]">{user?.allergies?.[0] || 'None'}</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Top Allergy</p>
                    </div>
                </div>
            </motion.div>

            {/* Daily Check-In Section */}
            <div className="px-5 pb-20">
                <div className="bg-white/[0.03] p-10 rounded-[3rem] border border-white/5 text-center shadow-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 italic">Compliance Verification Loop</p>
                    <button className="w-full py-5 bg-medical-cyan text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all pointer-events-auto !important">
                        DAILY SYNC: I AM OKAY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientHome;
