import React from 'react';
import { Stethoscope, Building2, Pill, FileText } from 'lucide-react';

const actions = [
    { icon: Stethoscope, label: 'Symptom Checker', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Building2, label: 'Nearby Hospitals', color: 'text-red-400', bg: 'bg-red-500/10' },
    { icon: Pill, label: 'Pharmacies', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: FileText, label: 'Export Data', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const EmergencyActions: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {actions.map((item, idx) => (
                <button
                    key={idx}
                    className={`glass-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group`}
                >
                    <div className={`p-3 rounded-full ${item.bg} group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-300">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default EmergencyActions;
