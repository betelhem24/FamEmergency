import React from 'react';
import { QrCode, Network, Zap, Activity, ArrowUpRight } from 'lucide-react';

const ResponderTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in slide-in-from-left duration-500 pb-20">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-black text-medical-navy italic">Responder Interface</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">Authorized Access Terminal</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-medical-navy shadow-sm hover:shadow-md transition-all uppercase tracking-widest">
                        Switch Unit
                    </button>
                    <button className="px-6 py-3 bg-medical-navy text-white rounded-2xl text-[10px] font-black shadow-lg hover:shadow-xl transition-all uppercase tracking-widest">
                        Report Sector
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 medical-glass p-8 md:p-12 border-transparent border-t-4 border-t-medical-cyan relative">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex flex-col items-center bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl group cursor-pointer hover:border-medical-cyan transition-all">
                            <div className="relative">
                                <QrCode size={160} className="text-medical-navy mb-6 group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-white/40 blur-xl scale-125 -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Patient Scan Required</p>
                            <button className="px-10 py-4 bg-medical-cyan text-medical-navy font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-medical-cyan/20">
                                Launch Scanner
                            </button>
                        </div>

                        <div className="flex-1 space-y-8 w-full">
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated User</div>
                                <div className="text-xl font-black text-medical-navy italic">DR_SMITH_SECURE_01</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                                    <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Active Alerts</div>
                                    <div className="text-2xl font-black text-medical-navy">04</div>
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                                    <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Global Health</div>
                                    <div className="text-2xl font-black text-green-500 flex items-center gap-2">
                                        NML <Activity size={18} />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-red-600 active:scale-[0.98] transition-all text-white rounded-2xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 group">
                                <Zap size={20} className="animate-pulse" />
                                <span className="text-sm uppercase tracking-widest">Signal Global Reinforce</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="medical-glass p-8 bg-medical-navy text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-medical-cyan/10 blur-[80px] rounded-full" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 italic flex items-center gap-3">
                            <Network size={20} className="text-medical-cyan" /> Network Grid
                        </h3>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-medical-cyan">0{i}</div>
                                        <div className="text-xs font-black">NODE_ESTABLISHED_{i}</div>
                                    </div>
                                    <ArrowUpRight size={14} className="text-slate-500" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="medical-glass p-8 border-dashed border-slate-200">
                        <h3 className="text-[10px] font-black text-medical-navy uppercase mb-6 tracking-widest italic">Dispatcher Protocol Log</h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-3 text-[9px] font-bold">
                                    <span className="text-medical-cyan font-black">12:0{i}:11</span>
                                    <span className="text-slate-400">DATA_PKT_RECV_FROM_SECTOR_07</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponderTab;
