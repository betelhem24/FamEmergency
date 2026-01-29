import React, { useState } from 'react';
import { Pill, Plus, Trash2 } from 'lucide-react';
import type { MedicalProfile } from '../../../types';

interface Props {
    medications: MedicalProfile['medications'];
    isEditing: boolean;
    onUpdate: (meds: MedicalProfile['medications']) => void;
}

const Medications: React.FC<Props> = ({ medications = [], isEditing, onUpdate }) => {
    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });

    const addMed = () => {
        if (newMed.name) {
            onUpdate([...medications, newMed]);
            setNewMed({ name: '', dosage: '', frequency: '' });
        }
    };

    const removeMed = (idx: number) => {
        onUpdate(medications.filter((_, i) => i !== idx));
    };

    return (
        <div className="glass-card glass-card-sm p-5 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Pill className="text-indigo-400" /> Current Medications
            </h3>

            <div className="space-y-3">
                {medications.map((med, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <div>
                            <p className="font-medium text-white">{med.name}</p>
                            <p className="text-xs text-gray-400">{med.dosage} • {med.frequency}</p>
                        </div>
                        {isEditing && (
                            <button onClick={() => removeMed(idx)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="mt-4 grid grid-cols-12 gap-2">
                    <input className="glass-input col-span-5 text-sm" placeholder="Name"
                        value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                    <input className="glass-input col-span-3 text-sm" placeholder="Dose"
                        value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
                    <input className="glass-input col-span-3 text-sm" placeholder="Freq"
                        value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} />
                    <button onClick={addMed} className="col-span-1 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Plus size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Medications;
