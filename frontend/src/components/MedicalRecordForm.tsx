import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Heart, Activity, AlertCircle, Trash2, Plus, Pill, FileText } from 'lucide-react';

interface MedicalRecordFormProps {
    initialData: any;
    onSave: (data: any) => void;
    isEditing: boolean;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ initialData, onSave, isEditing }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: 'other',
        bloodType: '',
        height: '',
        weight: '',
        allergies: [],
        conditions: [],
        medications: [],
        familyPhone: '',
        images: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || initialData.name || '',
                age: initialData.age || '',
                gender: initialData.gender || 'other',
                bloodType: initialData.bloodType || '',
                height: initialData.height || '',
                weight: initialData.weight || '',
                allergies: Array.isArray(initialData.allergies) ? initialData.allergies : [],
                conditions: Array.isArray(initialData.conditions) ? initialData.conditions : [],
                medications: Array.isArray(initialData.medications) ? initialData.medications : [],
                familyPhone: initialData.familyPhone || '',
                images: Array.isArray(initialData.images) ? initialData.images : []
            });
        }
    }, [initialData]);

    const [newAllergy, setNewAllergy] = useState('');
    const [newCondition, setNewCondition] = useState('');
    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const addItem = (field: 'allergies' | 'conditions') => {
        const val = field === 'allergies' ? newAllergy : newCondition;
        if (!val.trim()) return;
        setFormData((prev: any) => ({
            ...prev,
            [field]: [...prev[field], val.trim()]
        }));
        if (field === 'allergies') setNewAllergy('');
        else setNewCondition('');
    };

    const removeItem = (field: 'allergies' | 'conditions' | 'medications', index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: prev[field].filter((_: any, i: number) => i !== index)
        }));
    };

    const addMedication = () => {
        if (!newMed.name.trim()) return;
        setFormData((prev: any) => ({
            ...prev,
            medications: [...prev.medications, { ...newMed }]
        }));
        setNewMed({ name: '', dosage: '', frequency: '' });
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Section: Personal Identity */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <User size={20} className="text-[var(--accent-primary)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Clinical Identity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Legal Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-[var(--accent-primary)]/40 transition-all disabled:opacity-50"
                            placeholder="Patient's Full Name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Clinical Age</label>
                            <input
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-[var(--accent-primary)]/40 transition-all disabled:opacity-50"
                                placeholder="Age"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-[var(--accent-primary)]/40 transition-all appearance-none disabled:opacity-50"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Biometrics */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Activity size={20} className="text-emerald-500" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Biometric Baselining</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Blood Type</label>
                        <input
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-center text-red-500 outline-none focus:border-red-500/40 transition-all disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Height (cm)</label>
                        <input
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Weight (kg)</label>
                        <input
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-emerald-500/40 transition-all disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Section: Allergies & Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle size={20} className="text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Allergy Alerts</h3>
                    </div>

                    {isEditing && (
                        <div className="flex gap-2">
                            <input
                                value={newAllergy}
                                onChange={(e) => setNewAllergy(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white outline-none"
                                placeholder="Add reaction/allergy..."
                            />
                            <button onClick={() => addItem('allergies')} className="p-2 bg-amber-500 text-black rounded-xl hover:scale-105 transition-all">
                                <Plus size={18} />
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {(formData.allergies || []).map((item: string, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{item}</span>
                                {isEditing && (
                                    <button onClick={() => removeItem('allergies', i)} className="text-red-500/40 hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart size={20} className="text-red-500" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Known Conditions</h3>
                    </div>

                    {isEditing && (
                        <div className="flex gap-2">
                            <input
                                value={newCondition}
                                onChange={(e) => setNewCondition(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white outline-none"
                                placeholder="Add medical diagnosis..."
                            />
                            <button onClick={() => addItem('conditions')} className="p-2 bg-red-500 text-white rounded-xl hover:scale-105 transition-all">
                                <Plus size={18} />
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {(formData.conditions || []).map((item: string, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{item}</span>
                                {isEditing && (
                                    <button onClick={() => removeItem('conditions', i)} className="text-red-500/40 hover:text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section: Medications */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Pill size={20} className="text-indigo-400" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Active Medications</h3>
                </div>

                {isEditing && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            value={newMed.name}
                            onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none"
                            placeholder="Medication Name"
                        />
                        <input
                            value={newMed.dosage}
                            onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none"
                            placeholder="Dosage (e.g. 10mg)"
                        />
                        <div className="flex gap-2">
                            <input
                                value={newMed.frequency}
                                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none"
                                placeholder="Frequency (e.g. 2x Daily)"
                            />
                            <button onClick={addMedication} className="p-3 bg-indigo-500 text-white rounded-xl hover:scale-105 transition-all">
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {(formData.medications || []).length > 0 ? (formData.medications || []).map((med: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                <div>
                                    <p className="font-black text-white uppercase text-[10px] tracking-tight">{med.name}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{med.dosage} • {med.frequency}</p>
                                </div>
                            </div>
                            {isEditing && (
                                <button onClick={() => removeItem('medications', i)} className="text-red-500/40 hover:text-red-500">
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    )) : (
                        <div className="py-4 text-center opacity-30 italic text-[10px] font-bold uppercase tracking-widest">No active medications indexed</div>
                    )}
                </div>
            </div>

            {/* Section: Clinical Reports/Imaging */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <FileText size={20} className="text-[var(--accent-primary)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Clinical Reports & Scans</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {formData.images && formData.images.length > 0 ? formData.images.map((img: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:bg-white/[0.06] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                                    <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.url}`} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-black text-white uppercase text-[10px] tracking-tight">{img.title}</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{new Date(img.uploadedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-black transition-all"
                            >
                                View Detailed
                            </a>
                        </div>
                    )) : (
                        <div className="py-8 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">No clinical scans available in repository</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button (Sticky) */}
            {isEditing && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[50] w-full max-w-xs px-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSave(formData)}
                        className="w-full py-6 bg-[var(--accent-primary)] text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_50px_rgba(var(--accent-primary-rgb),0.3)] flex items-center justify-center gap-3"
                    >
                        <Save size={18} />
                        Update Medical Core
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordForm;
