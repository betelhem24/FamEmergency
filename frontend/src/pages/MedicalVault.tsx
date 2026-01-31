import { useState } from 'react';
import { Save, Droplet, AlertTriangle, Pill } from 'lucide-react';

const MedicalVault = () => {
    const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

    return (
        <div className="space-y-8 pt-4 pb-20 px-2 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tighter italic uppercase">Medical Vault</h1>
                    <p className="text-medical-cyan/60 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Encrypted Record Node</p>
                </div>
                <button className="bg-medical-cyan/10 border border-medical-cyan/20 text-medical-cyan p-3.5 rounded-2xl hover:bg-medical-cyan hover:text-white transition-all shadow-lg active:scale-95">
                    <Save size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 shadow-inner">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'details' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    Vital Details
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'history' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    History
                </button>
            </div>

            <div className="space-y-6">
                {/* Blood Type Section */}
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-[-20px] right-[-20px] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                        <Droplet size={200} />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <Droplet className="text-red-500" size={20} />
                        </div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest italic">Blood Profile Node</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 group-focus-within:border-medical-cyan/30 transition-all">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Blood Type</label>
                            <select className="bg-transparent text-white w-full outline-none font-black text-2xl uppercase cursor-pointer">
                                <option className="bg-slate-950 font-black">O+</option>
                                <option className="bg-slate-950 font-black">A+</option>
                                <option className="bg-slate-950 font-black">B+</option>
                                <option className="bg-slate-950 font-black">AB+</option>
                            </select>
                        </div>
                        <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5 px-1">Donor Status</label>
                            <div className="flex items-center gap-3 h-10">
                                <Activity className="text-emerald-500 animate-pulse" size={16} />
                                <span className="text-white font-black text-lg uppercase tracking-tighter">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Allergies */}
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <AlertTriangle className="text-amber-500" size={20} />
                        </div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest italic">Clinical Allergies</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 relative z-10">
                        <div className="px-5 py-3 bg-white/[0.03] border border-amber-500/30 rounded-2xl flex items-center gap-3 group hover:border-amber-500 transition-all">
                            <span className="text-amber-400 text-xs font-black uppercase tracking-widest">Peanuts</span>
                            <button className="text-amber-400/50 hover:text-white transition-colors">×</button>
                        </div>
                        <div className="px-5 py-3 bg-white/[0.03] border border-amber-500/30 rounded-2xl flex items-center gap-3 group hover:border-amber-500 transition-all">
                            <span className="text-amber-400 text-xs font-black uppercase tracking-widest">Penicillin</span>
                            <button className="text-amber-400/50 hover:text-white transition-colors">×</button>
                        </div>
                        <button className="px-6 py-3 bg-white/[0.05] border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95">
                            + Add Criticality
                        </button>
                    </div>
                </div>

                {/* Medications */}
                <div className="glass-card p-6 md:p-8 rounded-[2.5rem]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Pill className="text-blue-400" size={20} />
                        </div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest italic">Current Medication</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                            <div>
                                <p className="font-black text-white uppercase tracking-tight text-sm group-hover:text-medical-cyan transition-colors">Insulin Glargine</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">1 unit / day • Sync Prior to sleep</p>
                            </div>
                            <span className="text-[10px] font-black bg-medical-cyan/10 text-medical-cyan px-3 py-1.5 rounded-xl uppercase tracking-widest border border-medical-cyan/20">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                            <div>
                                <p className="font-black text-white uppercase tracking-tight text-sm group-hover:text-medical-cyan transition-colors">Lisinopril Hub</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">10mg • Daily Morning Cycle</p>
                            </div>
                            <span className="text-[10px] font-black bg-medical-cyan/10 text-medical-cyan px-3 py-1.5 rounded-xl uppercase tracking-widest border border-medical-cyan/20">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalVault;
