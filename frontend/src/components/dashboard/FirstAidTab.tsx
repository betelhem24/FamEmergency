import React from 'react';
import { Search, Heart, Activity, Shield, AlertCircle, Thermometer, Zap, Droplet } from 'lucide-react';

const FirstAidTab: React.FC = () => {
    const categories = [
        { title: 'CPR Protocols', icon: Heart, count: 12, color: 'text-red-500' },
        { title: 'Trauma Care', icon: Shield, count: 8, color: 'text-medical-navy' },
        { title: 'Respiratory', icon: Activity, count: 5, color: 'text-medical-cyan' },
        { title: 'Burn Response', icon: Thermometer, count: 4, color: 'text-orange-500' },
        { title: 'Allergic Reac.', icon: Droplet, count: 6, color: 'text-purple-500' },
        { title: 'Severe Bleed', icon: Zap, count: 9, color: 'text-red-600' },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-medical-navy italic">Knowledge Matrix</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">Verified Life-Support Guides</p>
                </div>
                <div className="relative md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search medical guides..."
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-xs font-bold text-medical-navy focus:ring-2 focus:ring-medical-cyan/50 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, i) => (
                    <div key={i} className="medical-glass p-8 group hover:bg-slate-50 transition-all cursor-pointer border-transparent hover:border-slate-200">
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-4 bg-slate-100 rounded-3xl group-hover:bg-white group-hover:shadow-md transition-all">
                                <cat.icon size={32} className={`${cat.color} transition-transform group-hover:scale-110`} />
                            </div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">REF_00{i + 1}</div>
                        </div>

                        <h3 className="text-xl font-black text-medical-navy mb-2 tracking-tight">{cat.title}</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{cat.count} GUIDES ACTIVE</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-medical-cyan shadow-[0_0_8px_rgba(0,242,255,1)]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="medical-glass p-10 bg-slate-900 text-white flex flex-col md:flex-row items-center gap-10">
                <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20">
                    <AlertCircle size={48} className="text-red-500 animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black italic mb-2">Emergency Quick Action</h3>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">If you are witnessing a life-threatening emergency, stop reading and trigger the SOS signal immediately. First aid guides are for support during waiting periods only.</p>
                </div>
                <button className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 whitespace-nowrap">
                    Confirm SOS Call
                </button>
            </div>
        </div>
    );
};

export default FirstAidTab;
