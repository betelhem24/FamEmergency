import { useState } from 'react';
import { Save, Droplet, AlertTriangle, Pill } from 'lucide-react';

const MedicalVault = () => {
    const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

    return (
        <div className="space-y-6 pt-4 pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Medical Vault</h1>
                    <p className="text-slate-400 text-sm">Secure health records storage.</p>
                </div>
                <button className="bg-life-cyan/20 text-life-cyan p-2 rounded-xl hover:bg-life-cyan/30 transition-colors">
                    <Save size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'details' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Vital Details
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'history' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                >
                    History
                </button>
            </div>

            <div className="space-y-4">
                {/* Blood Type Section */}
                <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Droplet size={100} />
                    </div>
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <Droplet className="text-red-500" size={18} /> Blood Profile
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <label className="text-xs text-slate-400 block mb-1">Blood Type</label>
                            <select className="bg-transparent text-white w-full outline-none font-bold text-lg">
                                <option className="bg-slate-800">O+</option>
                                <option className="bg-slate-800">A+</option>
                                <option className="bg-slate-800">B+</option>
                                <option className="bg-slate-800">AB+</option>
                            </select>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <label className="text-xs text-slate-400 block mb-1">Donor Status</label>
                            <div className="flex items-center gap-2 h-7">
                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-white font-medium">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Allergies */}
                <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-amber-500" size={18} /> Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center gap-2">
                            <span className="text-amber-400 text-sm font-medium">Peanuts</span>
                            <button className="text-amber-400 hover:text-white">×</button>
                        </div>
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center gap-2">
                            <span className="text-amber-400 text-sm font-medium">Penicillin</span>
                            <button className="text-amber-400 hover:text-white">×</button>
                        </div>
                        <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 text-sm hover:bg-white/10 hover:text-white transition-colors">
                            + Add
                        </button>
                    </div>
                </div>

                {/* Medications */}
                <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                        <Pill className="text-blue-400" size={18} /> Current Medication
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="font-medium text-white">Insulin Glargine</p>
                                <p className="text-xs text-slate-400">1 unit / day • Before sleep</p>
                            </div>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="font-medium text-white">Lisinopril</p>
                                <p className="text-xs text-slate-400">10mg • Morning</p>
                            </div>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalVault;
