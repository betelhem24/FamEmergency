import React, { useState } from 'react';
import { Siren } from 'lucide-react';

const SOSButton: React.FC = () => {
    const [isActive, setIsActive] = useState(false);

    const triggerSOS = () => {
        setIsActive(true);
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        setTimeout(() => setIsActive(false), 3000);
        // I will add API call here in production
    };

    return (
        <div className="relative flex items-center justify-center p-12">
            {/* Outer Pulsing Glow */}
            <div className={`absolute w-64 h-64 rounded-full transition-all duration-1000 
                ${isActive ? 'bg-red-500/40 animate-ping' : 'bg-red-500/10 animate-pulse'}`} />

            <button
                onClick={triggerSOS}
                className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2
                    transition-all duration-500 overflow-hidden group
                    ${isActive
                        ? 'scale-90 shadow-none'
                        : 'hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,77,77,0.3)]'}`}
            >
                {/* 3D Glass Layer 1 */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/80 to-red-600/90 backdrop-blur-xl" />

                {/* 3D Glass Layer 2 (Inner Bevel) */}
                <div className="absolute inset-2 rounded-full border border-white/30 bg-gradient-to-tl from-white/10 to-transparent" />

                {/* 3D Glass Layer 3 (Glossy Reflection) */}
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rotate-45 pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative z-10 flex flex-col items-center gap-1 group-hover:animate-bounce">
                    <Siren size={56} className="text-white drop-shadow-lg" />
                    <span className="text-2xl font-black text-white tracking-widest uppercase">SOS</span>
                </div>

                <div className="absolute bottom-10 text-[10px] font-bold text-white/60 tracking-tighter relative z-10">
                    HOLD TO TRIGGER
                </div>
            </button>
        </div>
    );
};

export default SOSButton;
