import React from 'react';
import { User, ClipboardList, Heart, Activity, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

const ProfileTab: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-8">
                <div className="medical-glass p-8 md:p-12 overflow-hidden relative">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-medical-cyan/10 rounded-2xl">
                            <ClipboardList className="text-medical-cyan w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-medical-navy italic">Patient Health Database</h2>
                            <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">Medical Record Profile</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    <User size={14} className="text-medical-cyan" /> Full Legal Name
                                </label>
                                <input type="text" className="medical-input" defaultValue="Sarah Connor" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                        <Calendar size={14} className="text-medical-cyan" /> Current Age
                                    </label>
                                    <input type="text" className="medical-input" defaultValue="32 Years" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                        <Heart size={14} className="text-medical-cyan" /> Blood Group
                                    </label>
                                    <select className="medical-input">
                                        <option>O Negative (Rh-)</option>
                                        <option>O Positive</option>
                                        <option>A Positive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    <Mail size={14} className="text-medical-cyan" /> Secure Email
                                </label>
                                <input type="email" className="medical-input" defaultValue="sarah.c@gmail.com" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    <Activity size={14} className="text-medical-cyan" /> Chronic Conditions & Alerts
                                </label>
                                <textarea className="medical-input h-32 resize-none leading-relaxed" defaultValue="PENICILLIN ALLERGY\nPEANUT INTOLERANCE\nASTHMA POCKET INHALER" />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    <Phone size={14} className="text-medical-cyan" /> Emergency Callback
                                </label>
                                <input type="text" className="medical-input" defaultValue="+1 (555) 0123-SAFE" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                            Data is encrypted prior to transmission. Only authorized first responders can access this record.
                        </p>
                        <button className="px-8 py-4 bg-medical-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-2xl transition-all">
                            Update Record
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="medical-glass p-8 bg-medical-navy text-white overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-medical-cyan/20 blur-[80px] rounded-full" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 italic">
                        <ShieldCheck size={20} className="text-medical-cyan" /> Trust Shield Active
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Cloud Sync', val: 'Synchronized', status: 'medical-cyan' },
                            { label: 'E2E Encryption', val: 'AES-256 GCM', status: 'medical-cyan' },
                            { label: 'Privacy Mode', val: 'Enhanced', status: 'medical-cyan' }
                        ].map(item => (
                            <div key={item.label} className="border-b border-white/5 pb-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.label}</div>
                                <div className="text-sm font-black flex items-center justify-between">
                                    {item.val}
                                    <div className={`w-1.5 h-1.5 rounded-full bg-medical-cyan shadow-[0_0_8px_var(--accent-cyan)]`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="medical-glass p-8 border-dashed border-slate-200">
                    <h4 className="text-xs font-black text-medical-navy uppercase mb-4 tracking-widest italic">Digital Wallet Card</h4>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Interactive Preview Locked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
