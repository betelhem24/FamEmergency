import { useState, useEffect } from 'react';
import { Save, Droplet, AlertTriangle, Pill, Activity, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import type { MedicalProfile } from '../types';

const MedicalVault = () => {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'history' | 'qr'>('details');

    // Default empty profile
    const [profile, setProfile] = useState<MedicalProfile>({
        bloodType: 'Unknown',
        allergies: [],
        medications: [],
        conditions: [],
        contacts: [],
        weight: '0',
        height: '0'
    });

    useEffect(() => {
        if (user) fetchMedicalData();
    }, [user]);

    const fetchMedicalData = async () => {
        try {
            const res = await fetch(`/api/medical/user/${user?.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setProfile(data.data);
            }
        } catch (error) {
            console.error("Failed to load medical record", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pt-4 pb-20 px-2 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tighter italic uppercase">Medical Vault</h1>
                    <p className="text-medical-cyan/60 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Encrypted Record Node</p>
                </div>
                <button className="bg-cyan-500/10 border border-medical-cyan/20 text-medical-cyan p-3.5 rounded-2xl hover:bg-medical-cyan hover:text-white transition-all shadow-lg active:scale-95">
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
                    onClick={() => setActiveTab('qr')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'qr' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    QR Access
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'history' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    History
                </button>
            </div>

            {loading ? <div className="text-center text-medical-cyan animate-pulse font-mono mt-10">DECRYPTING VAULT...</div> : (
                <>
                    {activeTab === 'qr' && (
                        <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-4 rounded-xl mb-6">
                                <QRCodeSVG
                                    value={JSON.stringify({
                                        id: user?.id,
                                        name: user?.name,
                                        bloodType: profile.bloodType,
                                        allergies: profile.allergies
                                    })}
                                    size={200}
                                    level="H"
                                />
                            </div>
                            <h3 className="text-white font-black uppercase tracking-widest text-lg">Emergency Access Key</h3>
                            <p className="text-slate-500 text-xs mt-2 max-w-[200px]">Allow First Responders to scan this code for immediate medical profile access.</p>
                        </div>
                    )}

                    {activeTab === 'details' && (
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
                                        <select
                                            className="bg-transparent text-white w-full outline-none font-black text-2xl uppercase cursor-pointer"
                                            value={profile.bloodType}
                                            onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                                        >
                                            <option className="bg-slate-950 font-black" value="O+">O+</option>
                                            <option className="bg-slate-950 font-black" value="A+">A+</option>
                                            <option className="bg-slate-950 font-black" value="B+">B+</option>
                                            <option className="bg-slate-950 font-black" value="AB+">AB+</option>
                                            <option className="bg-slate-950 font-black" value="Unknown">Unknown</option>
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
                                    {profile.allergies.map((allergy, i) => (
                                        <div key={i} className="px-5 py-3 bg-white/[0.03] border border-amber-500/30 rounded-2xl flex items-center gap-3 group hover:border-amber-500 transition-all">
                                            <span className="text-amber-400 text-xs font-black uppercase tracking-widest">{allergy}</span>
                                            <button className="text-amber-400/50 hover:text-white transition-colors"><X size={12} /></button>
                                        </div>
                                    ))}
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
                                    {profile.medications.map((med, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                                            <div>
                                                <p className="font-black text-white uppercase tracking-tight text-sm group-hover:text-medical-cyan transition-colors">{med.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{med.dosage} • {med.frequency}</p>
                                            </div>
                                            <span className="text-[10px] font-black bg-cyan-500/10 text-medical-cyan px-3 py-1.5 rounded-xl uppercase tracking-widest border border-medical-cyan/20">Active</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MedicalVault;
