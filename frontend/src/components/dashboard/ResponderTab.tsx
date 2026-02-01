import React from 'react';
import { QrCode, Server, ShieldCheck, Activity } from 'lucide-react';
import { PatientChat } from './PatientChat';

const ResponderTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700 pb-20">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-black text-medical-navy italic">Responder Terminal</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Authorized Response Node: ACTIVE</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Secure Link Established</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chat Corridor */}
                <div className="lg:col-span-2">
                    <PatientChat />
                </div>

                {/* System Status / Network */}
                <div className="space-y-6">
                    <div className="glass-card p-8 bg-slate-900 text-white rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-life-cyan/5 blur-3xl" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 italic flex items-center gap-3">
                            <Server size={18} className="text-life-cyan" /> Secure Network
                        </h3>

                        <div className="space-y-6">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Encrypted Identity</p>
                                <p className="text-sm font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-400" /> RES_ALPHA_COMMAND
                                </p>
                            </div>

                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Broadcast Status</p>
                                <p className="text-sm font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                                    <Activity size={14} className="text-life-cyan animate-pulse" /> Live Monitoring
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <button className="w-full py-4 bg-life-cyan text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                                Request Global Triage
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <QrCode size={40} className="text-medical-navy" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">Personal Identity Link</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ready for Medical Triage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponderTab;


