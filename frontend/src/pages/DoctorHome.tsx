import React, { useState, useEffect } from 'react';
import { ScanLine, BarChart3, Users, ShieldAlert, X, AlertCircle, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import SecureChat from '../components/SecureChat';
import { EmergencyMap } from '../components/Map/EmergencyMap';

const DoctorHome: React.FC = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<any[]>([]);
    const [chatOpen, setChatOpen] = useState(false);
    const [activeChatRecipient, setActiveChatRecipient] = useState({ id: '', name: '' });
    const doctorName = user?.name || "Doctor";
    const [patients, setPatients] = useState<any[]>([]);
    const [loadingPatients, setLoadingPatients] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.emit('doctor:join');

        socket.on('emergency:alert', (data) => {
            console.log('[DOCTOR] Received alert:', data);
            setAlerts(prev => {
                const exists = prev.find(a => a.emergencyId === data.emergencyId);
                if (exists) return prev;
                return [data, ...prev];
            });
        });

        socket.on('emergency:cancelled', (data) => {
            console.log('[DOCTOR] Alert cancelled:', data);
            setAlerts(prev => prev.filter(a => a.emergencyId !== data.emergencyId));
        });

        return () => {
            socket.off('emergency:alert');
            socket.off('emergency:cancelled');
        };
    }, [socket]);

    const handleResolveAlert = (id: string) => {
        setAlerts(prev => prev.filter((a: any) => a.emergencyId !== id));
    };

    const fetchPatients = async () => {
        setLoadingPatients(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctor/patients`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setPatients(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch patients', error);
        } finally {
            setLoadingPatients(false);
        }
    };

    return (
        <div className="space-y-6 pt-4 pb-24 px-4 overflow-y-auto h-full no-scrollbar bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">
                        Dr. {doctorName.split(' ')[0]}
                    </h1>
                    <p className="text-[var(--accent-primary)]/60 text-[9px] font-black tracking-[0.4em] uppercase mt-3 italic">Emergency Command Center</p>
                </div>
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
                </div>
            </header>

            {/* Active Alerts Feed */}
            <AnimatePresence>
                {alerts.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 mb-6"
                    >
                        {alerts.map((alert) => (
                            <motion.div
                                key={alert.emergencyId}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <button onClick={() => handleResolveAlert(alert.emergencyId)} className="text-red-500/40 hover:text-red-500 transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-500 p-3 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                                        <ShieldAlert size={24} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Live {alert.type} Alert</span>
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                                        </div>
                                        <h4 className="text-xl font-black text-[var(--text-primary)] italic uppercase tracking-tighter leading-none mb-2">
                                            {alert.userName || 'Unknown Patient'}
                                        </h4>
                                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-red-200/60">
                                            <span className="flex items-center gap-1"><AlertCircle size={10} /> {alert.severity}</span>
                                            <span className="flex items-center gap-1 leading-none italic underline">Map Tracking Active</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setActiveChatRecipient({ id: alert.userId, name: alert.userName });
                                        setChatOpen(true);
                                    }}
                                    className="w-full mt-4 py-3 bg-white/5 border border-white/10 text-[var(--text-primary)] rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all"
                                >
                                    Open Secure Chat
                                </button>
                                <button
                                    onClick={() => navigate('/doctor/scan')} // In real app, navigate to specific tracking page
                                    className="w-full mt-2 py-3 bg-red-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all"
                                >
                                    Respond to Emergency
                                </button>

                                {alert.familyContacts && alert.familyContacts.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-red-500/20 space-y-3">
                                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-500/60">Emergency Family Guardians</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {alert.familyContacts.map((contact: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                                                    <div>
                                                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase">{contact.name}</p>
                                                        <p className="text-[8px] text-slate-500 uppercase font-bold">{contact.relationship}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a href={`tel:${contact.phone}`} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                            <Phone size={14} />
                                                        </a>
                                                        <a href={`sms:${contact.phone}`} className="p-2 bg-white/5 text-white/40 rounded-xl hover:bg-white/10 transition-all">
                                                            <MessageCircle size={14} />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live Map Tracking Hub - Full Width Focus */}
            <div className="relative h-[450px] w-full rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                <EmergencyMap activeAlerts={alerts} />

                {/* Overlay Status */}
                <div className="absolute top-6 left-6 z-[40]">
                    <div className="glass-card px-4 py-2 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Coverage: Global Sector-8</span>
                    </div>
                </div>
            </div>

            {/* Patient Directory Section */}
            <div className="glass-card p-8 rounded-[3rem] border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                            <Users size={24} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Medical Support Network</h4>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Registry: {patients.length} Registered Patients</p>
                        </div>
                    </div>
                    <button onClick={fetchPatients} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                        <ScanLine size={18} className="text-slate-500" />
                    </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                    {loadingPatients ? (
                        <div className="py-10 text-center">
                            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Scanning Registry...</p>
                        </div>
                    ) : (
                        patients.map((patient) => (
                            <div key={patient.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:bg-white/[0.06] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
                                        <span className="text-xs font-black text-white uppercase">{patient.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight">{patient.name}</p>
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{patient.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/doctor/profile/${patient.id || patient._id}`)}
                                        className="px-4 py-2 bg-white/5 text-white/60 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-black transition-all"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveChatRecipient({ id: patient.id || patient._id, name: patient.name });
                                            setChatOpen(true);
                                        }}
                                        className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                                    >
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <SecureChat
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                recipientId={activeChatRecipient.id}
                recipientName={activeChatRecipient.name}
            />
        </div>
    );
};

export default DoctorHome;
