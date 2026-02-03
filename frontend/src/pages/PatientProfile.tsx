import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, FileText, Truck, ArrowLeft, ArrowRight, Save, Plus, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MedicalRecordForm from '../components/MedicalRecordForm';
import ThemeSwitcher from '../components/ThemeSwitcher';

const PatientProfile: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Legacy support if needed
    const { userId: paramUserId } = useParams<{ userId: string }>();
    const { user, token } = useAuth();

    // Determine the ID to use: Param ID (Doctor view) -> User ID (Patient view)
    const activeUserId = paramUserId || id || user?.id;

    // Default empty profile state
    const initialProfile = {
        bloodType: 'Unknown',
        allergies: [],
        medications: [],
        height: '0',
        weight: '0',
        name: 'Unknown Patient',
        images: []
    };

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(initialProfile);
    const [familyMembers, setFamilyMembers] = useState<any[]>([]);

    useEffect(() => {
        if (activeUserId) {
            fetchPatientData();
            fetchFamilyMembers();
        } else {
            console.warn("No Active User ID detected for Profile");
            setLoading(false);
        }
    }, [activeUserId]);

    const fetchPatientData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/user/${activeUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result) {
                setProfile((prev: any) => ({
                    ...prev,
                    ...result,
                    // If result has name, use it, otherwise keep default
                    name: result.name || prev.name
                }));
            }
        } catch (error) {
            console.error("Failed to fetch patient", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/family/user/${activeUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setFamilyMembers(result.family);
            }
        } catch (error) {
            console.error("Failed to fetch family members", error);
        }
    };

    const handleSave = async (updatedProfile: any) => {
        setSaving(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/user/${activeUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedProfile)
            });

            if (res.ok) {
                setProfile(updatedProfile);
                alert('Bio-Data Synchronized Successfully');
            } else {
                alert('Sync Failed. Check Node Status.');
            }
        } catch (error) {
            console.error("Save error", error);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        if (activeUserId) {
            formData.append('userId', activeUserId);
        }
        formData.append('title', `Scan - ${new Date().toLocaleDateString()}`);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setProfile({
                    ...profile,
                    images: [...(profile.images || []), data.image]
                });
                alert('Medical Scan Uploaded Successfully');
            } else {
                alert('Upload Failed');
            }
        } catch (error) {
            console.error("Upload error", error);
        }
    };


    if (!activeUserId) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] space-y-4">
                <AlertTriangle className="text-red-500" size={48} />
                <div className="text-red-500 font-black uppercase tracking-widest text-xs">Identity Signal Lost</div>
                <button
                    onClick={() => navigate('/doctor/patients')}
                    className="px-6 py-3 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all text-white"
                >
                    Return to Registry
                </button>
            </div>
        );
    }

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <div className="text-[var(--accent-primary)] animate-pulse font-black uppercase tracking-widest text-xs">Synchronizing Identity...</div>
        </div>
    );

    return (
        <div className="space-y-6 pt-4 pb-24 px-4 overflow-y-auto h-full no-scrollbar bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4">
                            {profile.name}
                        </h1>
                        <p className="text-emerald-500 text-[9px] font-black tracking-[0.3em] uppercase mt-1 italic">Verified Bio-Identity</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeSwitcher />
                    <button
                        onClick={() => handleSave(profile)}
                        disabled={saving}
                        className="p-4 bg-[var(--accent-primary)] text-black rounded-2xl shadow-[0_0_20px_var(--accent-primary)] active:scale-90 transition-all disabled:opacity-50"
                    >
                        {saving ? <Activity className="animate-spin" size={20} /> : <Save size={20} />}
                    </button>
                </div>
            </header>

            {/* Clinical Form */}
            <div className="space-y-6">
                <MedicalRecordForm
                    initialData={profile}
                    onSave={handleSave}
                    isEditing={true}
                />
            </div>

            {/* Medical Images Vault (Keeping existing) */}
            <div className="glass-card p-8 rounded-[3rem] border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FileText className="text-[var(--accent-primary)]" size={20} />
                        <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Clinical Imaging</h3>
                    </div>
                    <label className="p-3 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                        <Plus size={18} className="text-[var(--accent-primary)]" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {profile.images?.map((img: any) => (
                        <div key={img.id} className="aspect-square bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center group overflow-hidden relative shadow-inner">
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.url}`}
                                alt={img.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                <span className="text-[7px] font-black text-white uppercase tracking-tighter italic mb-1">{img.title}</span>
                                <span className="text-[6px] text-white/40 uppercase">{new Date(img.uploadedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bio-Guardian Network */}
            <div className="glass-card p-8 rounded-[3rem] border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheckIcon className="text-emerald-500 w-5 h-5" />
                    <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Bio-Guardian Network</h3>
                </div>
                <div className="space-y-3">
                    {familyMembers.length === 0 ? (
                        <div className="py-6 text-center">
                            <Users className="mx-auto mb-3 text-white/10" size={32} />
                            <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest opacity-40">No linked guardians detected</p>
                        </div>
                    ) : familyMembers.map((member: any) => (
                        <div key={member._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-white uppercase italic tracking-tight">{member.familyMemberId.name}</h4>
                                    <p className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">{member.relationship}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Directions Link */}
            <div className="pt-4">
                <button className="w-full relative group p-1 active:scale-95 transition-all">
                    <div className="absolute inset-0 bg-red-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-red-500 rounded-[2.5rem] p-6 flex items-center justify-between border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl shadow-inner">
                                <Truck className="text-white" size={24} />
                            </div>
                            <div className="text-left text-white">
                                <h4 className="font-black text-lg uppercase italic leading-none">Emergency Route</h4>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1">Live Traffic Optimized</p>
                            </div>
                        </div>
                        <ArrowRight className="text-white/60" />
                    </div>
                </button>
            </div>
        </div>
    );
};

function ShieldCheckIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
    )
}

export default PatientProfile;
