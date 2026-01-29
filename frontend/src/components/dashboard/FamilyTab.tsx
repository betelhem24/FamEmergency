import React from 'react';
import { Wifi, Battery, MapPin, Activity } from 'lucide-react';

const FamilyTab: React.FC = () => {
    const members = [
        { id: 1, name: 'Amit', role: 'Son', status: 'At School', battery: '88%', img: 'https://i.pravatar.cc/150?u=amit' },
        { id: 2, name: 'Soutiii', role: 'Daughter', status: 'At Home', battery: '92%', img: 'https://i.pravatar.cc/150?u=soutiii' },
        { id: 3, name: 'Sarah', role: 'Self', status: 'Sync Active', battery: '45%', img: 'https://i.pravatar.cc/150?u=sarh' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-black text-medical-navy italic">Family Hub</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">Live Safety Synchronization</p>
                </div>
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-medical-navy shadow-sm hover:shadow-md transition-all">
                    Manage Group
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="medical-glass p-6 group hover:border-medical-cyan/50 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <img src={member.img} alt={member.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-lg" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-medical-navy">{member.name}</h3>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-medical-cyan" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Live Location</span>
                                </div>
                                <span className="text-xs font-black text-medical-navy">{member.status}</span>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                                    <div className="flex items-center gap-1.5">
                                        <Battery size={14} className={parseInt(member.battery) < 50 ? 'text-red-500' : 'text-green-500'} />
                                        {member.battery}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Wifi size={14} className="text-medical-cyan" />
                                        Online
                                    </div>
                                </div>
                                <Activity size={14} className="text-medical-cyan animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="medical-glass p-8 bg-medical-navy text-white flex items-center justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-medical-cyan/10 blur-[100px] rounded-full" />
                <div className="max-w-md">
                    <h3 className="text-lg font-black italic mb-2 tracking-tight">Active Mutual Protection</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Your family members are notified automatically if your SOS is triggered. All location data is end-to-end encrypted.</p>
                </div>
                <button className="px-8 py-4 bg-medical-cyan text-medical-navy font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-medical-cyan/20">
                    Emergency Map
                </button>
            </div>
        </div>
    );
};

export default FamilyTab;
