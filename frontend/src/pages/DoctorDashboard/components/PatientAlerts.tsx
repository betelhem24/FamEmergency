import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { Radio, MapPin, Clock, User, ArrowRight, ShieldAlert } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PatientAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/emergency/active`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlerts(res.data.emergencies);
            } catch (err) {
                console.error('Failed to fetch alerts', err);
            }
        };
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h3 className="text-xl font-black text-medical-navy italic">Active Emergency Queue</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regional Dispatch Node: ACTIVE</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{alerts.length} Signals Locked</span>
                </div>
            </div>

            {alerts.length === 0 ? (
                <div className="medical-glass p-20 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="p-6 bg-slate-50 rounded-full mb-6 border border-slate-100">
                        <Radio size={48} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Active Distress Signals Detected</p>
                    <span className="text-[9px] mt-2 text-slate-300 uppercase italic tracking-tighter">System Scanning Nominal...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {alerts.map(alert => (
                        <div key={alert._id} className="medical-glass p-8 bg-white border-transparent hover:border-red-200 transition-all group cursor-pointer shadow-xl hover:shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                                    <ShieldAlert size={24} className="text-red-500 animate-pulse" />
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Signal Hash</div>
                                    <div className="text-[10px] font-mono font-black text-slate-400 uppercase">{alert._id.substring(0, 12)}...</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-2xl font-black text-medical-navy tracking-tight mb-1 italic uppercase">Distress: {alert.type}</h4>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <Clock size={14} className="text-medical-cyan" />
                                        {new Date(alert.triggeredAt).toLocaleTimeString()} · SECURE_SIGNAL
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Patient Node</div>
                                        <div className="text-xs font-black text-medical-navy flex items-center gap-2">
                                            <User size={12} className="text-medical-cyan" /> UNKNOWN_USER
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-[8px] font-black text-slate-400 uppercase mb-2">GPS Tracking</div>
                                        <div className="text-xs font-black text-medical-navy flex items-center gap-2">
                                            <MapPin size={12} className="text-red-500" /> {alert.location.latitude.toFixed(3)}, {alert.location.longitude.toFixed(3)}
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-medical-navy text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 transition-all hover:bg-slate-800 active:scale-[0.98]">
                                    Intercept Response <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
