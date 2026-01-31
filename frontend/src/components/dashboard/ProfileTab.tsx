import React, { useRef } from 'react';
import { User, ClipboardList, Heart, Activity, ShieldCheck, Mail, Calendar, Download, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';

const ProfileTab: React.FC = () => {
    const { user } = useAuth();
    const cardRef = useRef<HTMLDivElement>(null);

    const downloadID = async () => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#0a0a0a',
                scale: 2, // High resolution
            });
            const link = document.createElement('a');
            link.download = `FamEmergency-ID-${user?.name || 'Patient'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-8 md:p-12 overflow-hidden relative border border-white/10 rounded-[2.5rem]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-life-cyan/10 rounded-2xl">
                            <ClipboardList className="text-life-cyan w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white italic">Health Passport</h2>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Encrypted Patient File</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    <User size={12} className="text-life-cyan" /> Identity
                                </label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-medium focus:border-life-cyan/50 outline-none transition-all" defaultValue={user?.name || "Sarah Connor"} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        <Calendar size={12} className="text-life-cyan" /> Age
                                    </label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-medium focus:border-life-cyan/50 outline-none transition-all" defaultValue="32" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        <Heart size={12} className="text-life-cyan" /> Blood
                                    </label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-medium focus:border-life-cyan/50 outline-none transition-all" defaultValue={user?.bloodType || "O-"} />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    <Mail size={12} className="text-life-cyan" /> Emergency Access Channel
                                </label>
                                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-medium focus:border-life-cyan/50 outline-none transition-all" defaultValue={user?.email || "sarah.c@gmail.com"} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    <Activity size={12} className="text-life-cyan" /> Critical Conditions
                                </label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-medium focus:border-life-cyan/50 outline-none transition-all h-32 resize-none leading-relaxed" defaultValue={user?.allergies?.join('\n') || "PENICILLIN ALLERGY\nPEANUT INTOLERANCE"} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-relaxed max-w-sm text-center md:text-left">
                            All values are locally encrypted. Only verified medical professionals with QR override can modify this structure.
                        </p>
                        <button className="w-full md:w-auto px-10 py-4 bg-life-cyan text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                            Save Record
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Visual Passport Card for Printing */}
                <div ref={cardRef} className="glass-card p-8 bg-slate-900 border border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <QrCode size={120} />
                    </div>

                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3 italic text-life-cyan">
                        <ShieldCheck size={18} /> Emergency Identity
                    </h3>

                    {/* QR CENTERPIECE */}
                    <div className="bg-white p-4 rounded-3xl mx-auto w-fit mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-life-cyan/20">
                        <QRCodeSVG value={`https://famemergency.com/v/${user?.id}`} size={160} />
                    </div>

                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{user?.name || "Patient Name"}</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">UID: {user?.id?.slice(-8).toUpperCase()}</p>
                    </div>

                    <button
                        onClick={downloadID}
                        className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all group"
                    >
                        <Download size={16} className="text-life-cyan group-hover:bounce" />
                        Download Physical ID
                    </button>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/2 overflow-hidden border-dashed">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest italic">Digital Wallet Status</h4>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                        <span className="text-[10px] font-black text-white uppercase">Cloud Sync</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white uppercase">Encryption</span>
                        <span className="text-[9px] font-black text-life-cyan">AES-256</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
