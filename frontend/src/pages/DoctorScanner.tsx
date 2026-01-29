import { useState, useEffect } from 'react';
import { ScanLine, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DoctorScanner = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(true);
    const [scanResult, setScanResult] = useState<string | null>(null);

    // Simulate High-Performance Scanning
    useEffect(() => {
        if (scanning && !scanResult) {
            const timer = setTimeout(() => {
                handleScanSuccess();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [scanning, scanResult]);

    const handleScanSuccess = () => {
        // Simulate Beep
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note
            oscillator.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.1);
        } catch (e) {
            console.warn('Audio feedback failed', e);
        }

        setScanResult('Alex Doe');
        setScanning(false);

        // Auto-Redirect after 1.5 seconds
        setTimeout(() => {
            navigate('/doctor/profile');
        }, 1500);
    };

    return (
        <div className="space-y-6 pt-2 h-screen flex flex-col pb-24 relative overflow-hidden">
            {/* Background Camera Simulation */}
            <div className="absolute inset-0 z-0 bg-slate-950">
                <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-life-cyan/20 via-transparent to-transparent"></div>
                {/* Moving noise/grain for "camera" feel */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
            </div>

            <div className="flex justify-between items-center px-4 relative z-10">
                <button
                    onClick={() => navigate('/doctor')}
                    className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-black text-white uppercase tracking-widest">Scanner</h1>
                    <p className="text-[10px] text-emerald-400 font-bold tracking-widest flex items-center justify-center gap-1">
                        <ShieldCheck size={10} /> ENCRYPTED CONNECTION
                    </p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-8 z-10">
                {/* Scanning Frame */}
                <div className="w-full aspect-square max-w-sm relative">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-life-cyan rounded-tl-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-life-cyan rounded-tr-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-life-cyan rounded-bl-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-life-cyan rounded-br-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>

                    {/* Inner Viewfinder */}
                    <div className="absolute inset-4 border border-white/10 rounded-2xl flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <AnimatePresence mode="wait">
                            {scanning ? (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <ScanLine size={48} className="text-life-cyan/30 mx-auto mb-4 animate-pulse" />
                                    <p className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Align Patient QR</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    className="text-center"
                                >
                                    <div className="p-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 mb-4 inline-block">
                                        <Zap size={32} className="text-white fill-white" />
                                    </div>
                                    <p className="text-lg font-black text-white uppercase tracking-widest">Scan Successful</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Scanning Laser */}
                    {scanning && (
                        <motion.div
                            initial={{ top: '10%' }}
                            animate={{ top: '85%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-6 right-6 h-1 w-[calc(100%-48px)] bg-gradient-to-r from-transparent via-life-cyan to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20"
                        />
                    )}
                </div>
            </div>

            {/* Manual Helper / Dev Capture */}
            <div className="px-8 pb-32 relative z-10">
                <div className="glass-card p-4 rounded-[2rem] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-life-cyan animate-ping"></div>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Searching for QR...</p>
                    </div>
                    <button
                        onClick={handleScanSuccess}
                        className="text-[10px] font-black text-life-cyan/80 uppercase tracking-widest hover:text-life-cyan transition-colors"
                    >
                        Manual Trigger
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorScanner;
