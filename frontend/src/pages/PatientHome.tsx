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
        <div className="space-y-6 pt-2 h-full overflow-hidden relative">
            {/* Fall Detection Overlay */}
            <AnimatePresence>
                {fallTriggered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-red-600/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="bg-white p-6 rounded-full mb-8 animate-bounce shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                            < BellRing size={60} className="text-red-600" />
                        </div>
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Fall Detected!</h2>
                        <p className="text-white/80 font-bold mb-10 max-w-sm">Emergency broadcast initiated. Are you okay? Tapping cancel will stop the alert.</p>

                        <div className="flex flex-col w-full gap-4">
                            <button
                                onClick={() => setFallTriggered(false)}
                                className="w-full py-6 bg-white text-red-600 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <X size={24} /> I am okay
                            </button>
                            <button className="w-full py-6 bg-black/20 border border-white/30 text-white rounded-[2.5rem] font-black uppercase tracking-widest active:scale-95 transition-all">
                                Contact Guardian
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Big Red SOS Button at Top */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-1"
            >
                <button className="w-full relative group">
                    <div className="absolute inset-0 bg-red-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-8 rounded-[2.5rem] flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(239,68,68,0.4)] border border-red-400/40 active:scale-[0.98] transition-all">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 ring-2 ring-white/30">
                            <Phone className="text-white fill-white" size={36} />
                        </div>
                        <h3 className="font-black text-2xl text-white tracking-widest uppercase italic leading-none">EMERGENCY: Tap & Hold</h3>
                        <p className="text-red-100/60 text-[9px] font-black tracking-[0.3em] uppercase mt-2">Immediate Response Activated</p>
                    </div>
                </button>
            </motion.div>

            {/* Pulsing Status Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-center gap-3"
            >
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
                </div>
                <p className="text-sm font-black text-emerald-400 uppercase tracking-[0.4em] drop-shadow-sm leading-none">Medical ID Active</p>
            </motion.div>

            {/* Giant Identity Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[3.5rem] p-10 text-center shadow-2xl relative overflow-hidden mx-1"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <ShieldAlert size={140} />
                </div>

                {/* Giant QR Code */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-[3rem] mx-auto w-fit mb-10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] ring-8 ring-white/5"
                >
                    <QRCodeSVG value={`https://famemergency.com/v/${userId}`} size={180} />
                </motion.div>

                <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tight italic drop-shadow-md leading-none">{patientName}</h2>

                {/* Info Box */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="bg-white/10 px-6 py-2 rounded-2xl border border-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-red-500">
                            <Droplet size={14} fill="currentColor" />
                            <span className="text-lg font-black text-white">{user?.bloodType || 'N/A'}</span>
                        </div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Blood Type</p>
                    </div>
                    <div className="bg-white/10 px-6 py-2 rounded-2xl border border-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-life-cyan">
                            <Activity size={14} />
                            <span className="text-[12px] font-black text-white uppercase truncate max-w-[80px]">{user?.allergies?.[0] || 'None'}</span>
                        </div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Top Allergy</p>
                    </div>
                </div>
            </motion.div>

            {/* Daily Check-In Section */}
            <div className="px-4 pb-10">
                <div className="glass-panel p-6 rounded-[2.5rem] border border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 italic">Social Health Compliance</p>
                    <button className="w-full py-4 bg-life-cyan rounded-2xl font-black text-white uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                        I'M OKAY: DAILY CHECK-IN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientHome;
