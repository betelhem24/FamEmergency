import React from 'react';
import { BarChart3, TrendingUp, Calendar, Zap, Activity } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-medical-navy italic">Vital Statistics</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">Safety Performance Metrics</p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-medical-cyan" /> Last 30 Days Cycle
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Sync Events', val: '1,452', trend: '+12%', icon: Zap, color: 'text-medical-cyan' },
                    { label: 'Guardian Check-ins', val: '98.5%', trend: 'Nominal', icon: Activity, color: 'text-green-500' },
                    { label: 'System Uptime', val: '99.9%', trend: 'Stable', icon: TrendingUp, color: 'text-medical-navy' }
                ].map(stat => (
                    <div key={stat.label} className="medical-glass p-8 group hover:border-slate-200 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">{stat.trend}</span>
                        </div>
                        <div className="text-4xl font-black text-medical-navy mb-1 tracking-tighter">{stat.val}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="medical-glass p-10 overflow-hidden relative min-h-[400px]">
                <div className="scan-line opacity-10" />
                <div className="flex items-center justify-between mb-12">
                    <h3 className="text-sm font-black text-medical-navy uppercase flex items-center gap-3 italic">
                        <BarChart3 className="text-medical-cyan" size={20} /> Safety Engagement Curve [ANL_09]
                    </h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-medical-cyan" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Active Sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-medical-navy" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Baseline</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between h-56 gap-4 px-6 border-b border-slate-100 pb-6">
                    {[40, 65, 45, 90, 75, 40, 85, 30, 60, 78, 55, 62].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group px-0.5">
                            <div
                                className="w-full bg-gradient-to-t from-medical-navy/5 to-medical-cyan rounded-full transition-all duration-700 hover:brightness-110 relative"
                                style={{ height: `${h}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-medical-navy text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">VAL: {h}.0</div>
                            </div>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">W_{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
