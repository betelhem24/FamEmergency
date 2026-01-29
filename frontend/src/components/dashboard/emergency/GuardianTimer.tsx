import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Shield } from 'lucide-react';

const GuardianTimer: React.FC = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        let interval: any;
        if (isActive && seconds > 0) {
            interval = setInterval(() => setSeconds(s => s - 1), 1000);
        } else if (seconds === 0 && isActive) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const offset = circumference - (seconds / (60 * 60)) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="medical-glass p-10 w-full max-w-sm flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-medical-cyan/20 overflow-hidden">
                    <div className={`h-full bg-medical-cyan transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
                </div>

                <div className="flex items-center gap-2 mb-10">
                    <div className="p-2 bg-slate-100 rounded-xl">
                        <Shield className="text-medical-navy w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-medical-navy tracking-widest uppercase">Guardian Monitor</span>
                </div>

                {/* Progress Ring */}
                <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="112" cy="112" r={radius} className="stroke-slate-100 fill-none" strokeWidth="10" />
                        <circle
                            cx="112" cy="112" r={radius}
                            className="stroke-medical-cyan fill-none transition-all duration-1000 progress-ring-circle drop-shadow-[0_0_10px_rgba(0,242,255,0.4)]"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute text-center">
                        <div className="text-5xl font-black text-medical-navy tracking-tighter tabular-nums mb-1">
                            {formatTime(seconds)}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full mb-8">
                    {[15, 30, 45].map(min => (
                        <button
                            key={min}
                            onClick={() => { setSeconds(min * 60); setIsActive(false); }}
                            className="py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl text-xs font-black text-slate-400 hover:text-medical-navy transition-all uppercase"
                        >
                            {min}m
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-full py-4 bg-medical-navy text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
                >
                    {isActive ? <><RotateCcw size={18} /> Restart Probe</> : <><Play size={18} /> Initiate Sync</>}
                </button>
            </div>
        </div>
    );
};

export default GuardianTimer;
