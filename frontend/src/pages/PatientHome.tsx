import React, { useState, useEffect } from 'react';
import { Phone, ShieldAlert, Activity, Droplet, BellRing, X, QrCode, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSensors } from '../hooks/useSensors';
import { useEmergency } from '../context/EmergencyContext';
import SecureChat from '../components/SecureChat';

const PatientHome: React.FC = () => {
    const { user } = useAuth();
    const { triggerSOS, sosTriggered } = useEmergency();
    const navigate = useNavigate();
    const [chatOpen, setChatOpen] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [doctorModalOpen, setDoctorModalOpen] = useState(false);
    const [activeDoctor, setActiveDoctor] = useState({ id: '', name: '' });
    const [fallTriggered, setFallTriggered] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const fetchDoctors = async () => {
        setLoadingDoctors(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctor/list`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setDoctors(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleOpenDoctorChat = () => {
        fetchDoctors();
        setDoctorModalOpen(true);
    };

    const startChat = (dr: any) => {
        setActiveDoctor({ id: dr._id || dr.id, name: dr.name });
        setDoctorModalOpen(false);
        setChatOpen(true);
    };

    useSensors(() => {
        if (!fallTriggered && !sosTriggered) {
            setFallTriggered(true);
            setCountdown(10);
        }
    });

    useEffect(() => {
        let timer: any;
        if (fallTriggered && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (fallTriggered && countdown === 0) {
            triggerSOS('FALL_DETECTED');
            setFallTriggered(false);
        }
        return () => clearInterval(timer);
    }, [fallTriggered, countdown, triggerSOS]);

    const patientName = user?.name || "Patient";

    return (
        <div className="space-y-6 pt-4 pb-24 h-full overflow-y-auto no-scrollbar relative animate-in fade-in duration-700 bg-[var(--bg-primary)] px-4">
            {/* Fall Detection Overlay */}
            <AnimatePresence>
                {fallTriggered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-red-600/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
                    >
                        <div className="bg-white p-8 rounded-full mb-10 animate-pulse shadow-2xl">
                            <BellRing size={64} className="text-red-600" />
                        </div>
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Fall Detected!</h2>
                        <p className="text-white/90 font-black text-sm uppercase tracking-[0.2em] mb-4">Are you okay?</p>
                        <div className="text-7xl font-black text-white mb-12 tabular-nums">{countdown}</div>

                        <div className="flex flex-col w-full gap-5">
                            <button
                                onClick={() => setFallTriggered(false)}
                                className="w-full py-6 bg-white text-red-600 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 pointer-events-auto"
                            >
                                <X size={20} /> I am okay
                            </button>
                            <p className="text-white/60 text-[10px] uppercase font-black tracking-widest leading-relaxed">
                                SOS will be triggered automatically if no response
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Doctor Selection Modal */}
            <AnimatePresence>
                {doctorModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6"
                    >
                        <div className="glass-card w-full max-w-md p-8 rounded-[3rem] border-white/10 flex flex-col max-h-[80vh]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Clinical Network</h3>
                                <button onClick={() => setDoctorModalOpen(false)} className="p-2 text-slate-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4 overflow-y-auto no-scrollbar pr-2">
                                {loadingDoctors ? (
                                    <div className="py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Medical Hub...</p>
                                    </div>
                                ) : doctors.length > 0 ? (
                                    doctors.map((dr) => (
                                        <button
                                            key={dr._id || dr.id}
                                            onClick={() => startChat(dr)}
                                            className="w-full flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all group"
                                        >
                                            <div className="flex items-center gap-4 text-left">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                                    <span className="text-sm font-black text-white italic">Dr.</span>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-tight">{dr.name}</p>
                                                    <p className="text-[8px] font-bold text-[var(--accent-primary)]/60 uppercase tracking-widest mt-0.5">Emergency Specialist</p>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-[var(--accent-primary)]/10 rounded-lg text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Phone size={14} />
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center text-slate-500 text-[10px] py-10 uppercase font-black tracking-widest">No active doctors in your sector</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center my-8 gap-4"
            >
                <button
                    onClick={() => !sosTriggered && triggerSOS('SOS')}
                    className={`relative group pointer-events-auto transition-all ${sosTriggered ? 'opacity-20 grayscale cursor-not-allowed' : ''}`}
                >
                    <div className="absolute inset-0 bg-red-600 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-red-400/30 active:scale-95 transition-all animate-sos-pulse">
                        <div className="bg-white/20 p-6 rounded-full mb-3 shadow-inner">
                            <Phone size={48} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">SOS</h2>
                        <p className="text-white/80 text-[9px] font-black uppercase tracking-[0.3em] italic px-8 text-center">{sosTriggered ? 'SIGNALING...' : 'Press to trigger'}</p>
                    </div>
                </button>

                {sosTriggered && (
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Emergency Signal Broadcast In Progress</p>
                )}
            </motion.div>

            {/* Pulsing Status */}
            <div className="flex items-center justify-center gap-4 py-2">
                <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
                </div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] drop-shadow-md">Guardian Pulse: Active</p>
            </div>

            {/* Simplified Status Area - Redundancy Removed (Life-Key moved to Vault) */}
            <div className="flex flex-col gap-4 py-4">
                <div className="glass-card rounded-[2rem] p-6 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-1">Active User</p>
                        <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-none">{patientName}</h4>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-red-500/10 px-3 py-2 rounded-xl text-red-500 border border-red-500/20">
                            <span className="text-[10px] font-black">{user?.bloodType || 'B+'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Activity size={16} />
                        </div>
                        <div>
                            <p className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Heart Rate</p>
                            <p className="text-xs font-black text-white">72 BPM</p>
                        </div>
                    </div>
                    <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Droplet size={16} />
                        </div>
                        <div>
                            <p className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-widest">SpO2</p>
                            <p className="text-xs font-black text-white">98%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Life-Key Quick Launch */}
            <div className="pt-2">
                <button
                    onClick={() => navigate('/lifekey')}
                    className="w-full relative group p-1 active:scale-95 transition-all"
                >
                    <div className="absolute inset-0 bg-[var(--accent-primary)]/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-[var(--accent-primary)] to-[#10b981] rounded-[2.5rem] p-8 flex items-center justify-between border border-white/10 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <QrCode size={120} />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="bg-white/20 p-4 rounded-3xl shadow-inner backdrop-blur-md">
                                <QrCode className="text-white" size={32} />
                            </div>
                            <div className="text-left text-white">
                                <h4 className="font-black text-xl uppercase italic leading-none">Emergency Life-Key</h4>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-2 italic">Instant Bio-Data Access</p>
                            </div>
                        </div>
                        <div className="relative z-10 bg-white/10 p-2 rounded-full backdrop-blur-sm">
                            <ChevronRight size={24} className="text-white" />
                        </div>
                    </div>
                </button>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-4 pb-4">
                <button
                    onClick={() => navigate('/vault')}
                    className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all"
                >
                    <div className="p-3 bg-[var(--accent-primary)]/10 rounded-2xl text-[var(--accent-primary)]">
                        <Activity size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Medical Record</span>
                </button>
                <button
                    onClick={handleOpenDoctorChat}
                    className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all"
                >
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                        <ShieldAlert size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Doctor Chat</span>
                </button>
            </div>

            <SecureChat
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                recipientId={activeDoctor.id}
                recipientName={activeDoctor.name}
            />
        </div>
    );
};

export default PatientHome;
