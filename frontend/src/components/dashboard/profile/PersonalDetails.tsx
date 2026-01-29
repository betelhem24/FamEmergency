import React from 'react';
import { Droplet, Ruler, Weight } from 'lucide-react';
import type { MedicalProfile } from '../../../types';

// Helper icon
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

interface Props {
    data: MedicalProfile;
    isEditing: boolean;
    onChange: (field: keyof MedicalProfile, value: unknown) => void;
}

const PersonalDetails: React.FC<Props> = ({ data, isEditing, onChange }) => {
    const fields = [
        { icon: Droplet, label: 'Blood Type', key: 'bloodType', color: 'text-red-400' },
        { icon: Ruler, label: 'Height', key: 'height', color: 'text-blue-400' },
        { icon: Weight, label: 'Weight', key: 'weight', color: 'text-green-400' },
    ] as const;

    return (
        <div className="glass-card glass-card-sm p-5 h-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-400" />
                Personal Details
            </h3>

            <div className="space-y-4">
                {fields.map(({ icon: Icon, label, key, color }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${color}`} />
                            <span className="text-gray-300 text-sm">{label}</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={String(data[key] || '')}
                                onChange={(e) => onChange(key, e.target.value)}
                                className="glass-input w-24 px-2 py-1 text-right text-sm"
                            />
                        ) : (
                            <span className="font-medium text-white">{String(data[key] || '-')}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonalDetails;
