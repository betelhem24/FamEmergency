import { useState, useEffect } from 'react';
import { AlertTriangle, Activity, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import type { MedicalProfile } from '../types';
import MedicalRecordForm from '../components/MedicalRecordForm';

const MedicalVault = () => {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'history' | 'qr'>('details');

    const [profile, setProfile] = useState<MedicalProfile>({
        fullName: '',
        age: '',
        gender: 'other',
        bloodType: 'Unknown',
        allergies: [],
        medications: [],
        conditions: [],
        contacts: [],
        weight: '0',
        height: '0',
        images: []
    });


    useEffect(() => {
        if (user) {
            fetchMedicalData();
        }
    }, [user]);

    const fetchMedicalData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/user/${user?.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data) {
                setProfile({
                    fullName: data.fullName || '',
                    age: data.age || '',
                    gender: data.gender || 'other',
                    bloodType: data.bloodType || 'Unknown',
                    allergies: data.allergies || [],
                    medications: data.medications || [],
                    conditions: data.conditions || [],
                    contacts: data.contacts || [],
                    weight: data.weight || '0',
                    height: data.height || '0',
                    images: data.images || []
                });
            }
        } catch (error) {
            console.error("Failed to load medical record", error);
        } finally {
            setLoading(false);
        }
    };


    const handleSave = async (updatedData: any) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/user/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                setProfile(updatedData);
                alert('Medical Identity Synchronized');
            } else {
                alert('Sync Failed');
            }
        } catch (error) {
            console.error("Save error", error);
            alert('Network failure');
        }
    };

    return (
        <div className="space-y-6 pt-4 pb-20 px-4 animate-in fade-in duration-500 bg-[var(--bg-primary)] h-full overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter italic uppercase underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">Medical Vault</h1>
                    <p className="text-[var(--accent-primary)]/60 text-[9px] font-black uppercase tracking-[0.4em] mt-3 italic">Secure Identity Bio-Node</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl shadow-lg">
                    <ShieldAlert size={20} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'details' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    Vitals
                </button>
                <button
                    onClick={() => setActiveTab('qr')}
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'qr' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    Life-Key
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${activeTab === 'history' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-400'
                        }`}
                >
                    Reports
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-2 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
                    <p className="text-[var(--accent-primary)] animate-pulse font-black text-[10px] tracking-widest uppercase">Decryption Sequence Active...</p>
                </div>
            ) : (
                <>
                    {activeTab === 'qr' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="glass-card p-10 rounded-[3rem] flex flex-col items-center justify-center text-center border-white/5 relative overflow-hidden">
                                {/* Digital Watermark */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50"></div>

                                <div className="bg-white p-6 rounded-[2.5rem] mb-8 shadow-[0_20px_50px_rgba(255,255,255,0.1)] relative">
                                    {user?.id ? (
                                        <QRCodeSVG
                                            value={`EMERGENCY_LIFEKEY:${user.id}:${user.name}:${profile.bloodType}`}
                                            size={200}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    ) : (
                                        <div className="w-[200px] h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
                                            <ShieldAlert className="text-red-500 animate-pulse mb-2" size={48} />
                                            <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">Initialization Failed</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-[var(--text-primary)] font-black uppercase tracking-[0.2em] text-lg italic leading-none">{user?.name}</h3>
                                    <p className="text-[var(--accent-primary)] text-[9px] font-black uppercase tracking-[0.4em] italic">Authorized Medical Identity</p>
                                </div>

                                <div className="grid grid-cols-2 w-full gap-4 mt-8 pt-8 border-t border-white/5">
                                    <div className="text-left">
                                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Blood Type</p>
                                        <p className="text-sm font-black text-white italic">{profile.bloodType}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Node ID</p>
                                        <p className="text-sm font-black text-white italic">#{user?.id?.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
                                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-relaxed text-center">
                                    <AlertTriangle className="inline mr-2" size={14} />
                                    This Life-Key is for EMERGENCIES ONLY. Sharing this code grants temporary access to your full medical history.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-4">
                            {/* Alert Box */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 flex items-start gap-4 mb-2">
                                <Activity className="text-amber-500 shrink-0" size={20} />
                                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-relaxed">
                                    Clinical Insight: Your record is managed by authorized medical personnel to ensure precision.
                                </p>
                            </div>

                            <MedicalRecordForm
                                initialData={profile}
                                onSave={handleSave}
                                isEditing={true}
                            />
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="glass-card p-6 rounded-[2rem] border-white/5">
                                <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 italic">Clinical Reports</h4>
                                <div className="space-y-3">
                                    {profile.images && profile.images.length > 0 ? profile.images.map((img: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:bg-white/[0.06] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                                                    <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.url}`} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-white uppercase text-[10px] tracking-tight">{img.title}</p>
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{new Date(img.uploadedAt).toLocaleDateString()} • Verified Scan</p>
                                                </div>
                                            </div>
                                            <a
                                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-lg text-[8px] font-black uppercase cursor-pointer hover:bg-[var(--accent-primary)] hover:text-black transition-all"
                                            >
                                                View
                                            </a>
                                        </div>
                                    )) : (
                                        <div className="py-10 text-center opacity-30 italic text-[10px] font-bold uppercase tracking-widest">No clinical scans found</div>
                                    )}
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-[3rem] text-center border-white/5 flex flex-col items-center justify-center opacity-40">
                                <Activity className="text-[var(--accent-primary)]/20 mb-4" size={48} />
                                <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-2">Vault Storage: 12%</h4>
                                <p className="text-[8px] text-[var(--text-secondary)] uppercase font-bold tracking-widest max-w-[180px]">
                                    Additional historical records are being indexed.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MedicalVault;
