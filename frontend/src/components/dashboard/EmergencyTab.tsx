import React, { useState } from 'react';
import { Siren, AlertCircle, MapPin, UserCheck } from 'lucide-react';

const EmergencyTab: React.FC = () => {
    const [isHolding, setIsHolding] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 animate-in fade-in duration-700">
            {/* White QR Code Card */}
            <div className="medical-glass bg-white p-8 mb-12 shadow-2xl flex flex-col items-center max-w-sm w-full">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PATIENT_SARAH_822`}
                        alt="Patient ID QR"
                        className="w-48 h-48 opacity-90"
                    />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-medical-navy mb-1">Emergency Profile ID</h3>
                    <p className="text-sm text-slate-500 font-medium">SCAN_ID: 009-822-GS</p>
                </div>
            </div>

            {/* SOS Section */}
            <div className="w-full max-w-sm flex flex-col items-center">
                <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    className="sos-button w-40 h-40 rounded-full flex flex-col items-center justify-center relative mb-8"
                >
                    <div className={`absolute inset-0 rounded-full border-4 border-white/20 scale-110 ${isHolding ? 'animate-ping' : ''}`} />
                    <Siren size={48} className="text-white mb-2" />
                    <span className="text-2xl font-black text-white tracking-widest leading-none">SOS</span>
                </button>

                <div className="text-center">
                    <p className="text-medical-navy font-bold text-lg mb-2">EMERGENCY ASSISTANCE</p>
                    <div className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-100 rounded-full border border-slate-200">
                        <UserCheck size={16} className="text-medical-cyan" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest text-nowrap">5 Guardians Active</span>
                    </div>
                </div>
            </div>

            {/* Status Indicators */}
            <div className="mt-12 w-full max-w-md grid grid-cols-2 gap-4">
                <div className="medical-glass p-4 flex flex-col items-center text-center">
                    <AlertCircle className="text-medical-cyan mb-2" size={20} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">System Status</span>
                    <span className="text-xs font-bold text-medical-navy">READY</span>
                </div>
                <div className="medical-glass p-4 flex flex-col items-center text-center">
                    <MapPin className="text-medical-cyan mb-2" size={20} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sector</span>
                    <span className="text-xs font-bold text-medical-navy">NY_DOWNTOWN</span>
                </div>
            </div>
        </div>
    );
};

export default EmergencyTab;
