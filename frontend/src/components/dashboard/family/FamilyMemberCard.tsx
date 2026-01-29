import React from 'react';
import { MapPin, Battery, Phone, ShieldCheck, ShieldAlert } from 'lucide-react';

interface FamilyMember {
    id: string;
    name: string;
    status: 'safe' | 'danger' | 'offline';
    lastSeen: string;
    battery: number;
    location: string;
}

const FamilyMemberCard: React.FC<{ member: FamilyMember }> = ({ member }) => {
    const isDanger = member.status === 'danger';
    const isOffline = member.status === 'offline';

    return (
        <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${isDanger
                ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
            ${isDanger ? 'bg-red-500' : isOffline ? 'bg-gray-500' : 'bg-green-500'}`}>
                        {member.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-white font-medium">{member.name}</h4>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-0.5 rounded-full flex items-center gap-1
                ${isDanger ? 'bg-red-500/20 text-red-200' : isOffline ? 'bg-gray-500/20 text-gray-300' : 'bg-green-500/20 text-green-200'}`}>
                                {isDanger ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                                {member.status.toUpperCase()}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1">
                                <Battery size={10} /> {member.battery}%
                            </span>
                        </div>
                    </div>
                </div>

                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300">
                    <Phone size={16} />
                </button>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-sm">
                <div className="text-gray-400 flex items-center gap-1">
                    <MapPin size={12} />
                    {member.location}
                </div>
                <span className="text-xs text-gray-500">{member.lastSeen}</span>
            </div>
        </div>
    );
};

export default FamilyMemberCard;
