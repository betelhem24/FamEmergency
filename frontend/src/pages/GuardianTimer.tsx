import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GuardianTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(43); // 00:43
    const [isActive, setIsActive] = useState(false);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        let timer: any = null;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleTimerEnd();
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const handleTimerEnd = () => {
        setIsActive(false);
        setIsDone(true);
        // Simulate SMS Trigger
        console.log('GUARDIAN ALERT: Sending emergency SMS to contacts...');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const percentage = (timeLeft / 300) * 100; // Based on initial 5 mins if we used 300

    return (
        <div className="space-y-8 pt-4 pb-20 flex flex-col items-center">
            <div className="text-center px-4">
                <h1 className="text-3xl font-black text-white tracking-widest uppercase italic italic drop-shadow-md">Guardian Watch</h1>
                <p className="text-life-cyan/80 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Automated Security Response</p>
            </div>

            {/* Big Circle Timer */}
            <div className="relative w-72 h-72 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="144" cy="144" r="130"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="12"
                    />
                    <motion.circle
                        cx="144" cy="144" r="130"
                        fill="transparent"
                        stroke="url(#timerGradient)"
                        strokeWidth="12"
                        strokeDasharray="816"
                        strokeDashoffset={816 - (816 * percentage) / 100}
                        strokeLinecap="round"
                        transition={{ duration: 0.5 }}
                    />
                    <defs>
                        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="text-center z-10 glass-card p-10 rounded-full border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                    <motion.span
                        key={timeLeft}
                        initial={{ scale: 0.9, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-black text-white tracking-tighter"
                    >
                        {formatTime(timeLeft)}
                    </motion.span>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{isActive ? 'Monitoring' : 'Paused'}</p>
                </div>
            </div>

            {/* Status Notifications */}
            <AnimatePresence>
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mx-4 p-6 glass-panel border border-red-500/30 rounded-[2.5rem] bg-red-500/5 text-center flex flex-col items-center"
                    >
                        <div className="bg-red-500 p-3 rounded-full mb-3 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                            <BellRing size={24} className="text-white animate-bounce" />
                        </div>
                        <h3 className="text-white font-black uppercase text-lg italic tracking-tight">Guardian Alert Sent</h3>
                        <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mt-1">EMERGENCY CONTACTS NOTIFIED VIA SMS</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-6 relative z-20">
                <button
                    onClick={() => { setIsActive(!isActive); setIsDone(false); }}
                    className="p-6 bg-white/5 border border-white/20 rounded-[2.5rem] text-life-cyan hover:bg-life-cyan hover:text-white transition-all shadow-xl hover:shadow-cyan-500/20 active:scale-90"
                >
                    {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
                </button>
                <button
                    onClick={() => { setTimeLeft(43); setIsActive(false); setIsDone(false); }}
                    className="p-6 bg-white/5 border border-white/20 rounded-[2.5rem] text-slate-400 hover:text-white transition-all shadow-xl active:scale-90"
                >
                    <RotateCcw size={32} />
                </button>
            </div>

            <div className="px-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                The timer will automatically broadcast your location and medical profile if it expires.
            </div>
        </div>
    );
};

export default GuardianTimer;
