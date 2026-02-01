import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoctorScannerProps {
    onScan?: (data: any) => void;
}

export const DoctorScanner: React.FC<DoctorScannerProps> = ({ onScan }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<any>(null);
    const [scanning, setScanning] = useState(true);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const startScanner = async () => {
            try {
                const html5QrCode = new Html5Qrcode("reader-dash");
                html5QrCodeRef.current = html5QrCode;
                const config = { fps: 10, qrbox: { width: 250, height: 250 } };

                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText: string) => {
                        handleScanSuccess(decodedText);
                    },
                    () => { /* ignore */ }
                );
            } catch (err) {
                console.error("Scanner start error:", err);
                setError("Failed to access camera. Please check permissions.");
            }
        };

        if (scanning) {
            startScanner();
        }

        return () => {
            if (html5QrCodeRef.current?.isScanning) {
                html5QrCodeRef.current.stop().catch(console.error);
            }
        };
    }, [scanning]);

    const handleScanSuccess = async (userId: string) => {
        if (html5QrCodeRef.current?.isScanning) {
            await html5QrCodeRef.current.stop();
        }
        setScanning(false);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Identity not found in database');
            }

            if (!data.medicalRecord) {
                throw new Error('No medical data found for this identity');
            }

            setScanResult(data);
            if (onScan) onScan(data);

            // Beep
            try {
                const context = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = context.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, context.currentTime);
                oscillator.connect(context.destination);
                oscillator.start();
                oscillator.stop(context.currentTime + 0.1);
            } catch (e) { }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-500 pb-20">
            <div className="medical-glass p-10 bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl rounded-[3rem] overflow-hidden relative border">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Live Triage Scan</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol: Encrypted Identity Link</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl">
                        <QrCode size={24} className="text-medical-cyan" />
                    </div>
                </div>

                <div className="relative group">
                    <div id="reader-dash" className="w-full aspect-square bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl" />

                    {/* HUD Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 border-medical-cyan rounded-tl-2xl z-20" />
                        <div className="absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 border-medical-cyan rounded-tr-2xl z-20" />
                        <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 border-medical-cyan rounded-bl-2xl z-20" />
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 border-medical-cyan rounded-br-2xl z-20" />
                    </div>

                    <AnimatePresence>
                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30 rounded-[2.5rem]">
                                <div className="w-12 h-12 border-4 border-medical-cyan border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Querying Identity...</span>
                            </motion.div>
                        )}
                        {scanResult && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-emerald-500 flex flex-col items-center justify-center gap-4 z-30 rounded-[2.5rem] border-4 border-white shadow-2xl shadow-emerald-500/50">
                                <div className="p-6 bg-white rounded-full shadow-lg">
                                    <CheckCircle2 size={48} className="text-emerald-500" />
                                </div>
                                <span className="text-sm font-black text-white uppercase tracking-[0.2em]">Link Established</span>
                                <p className="text-[10px] font-bold text-white/80 uppercase">{scanResult.user.name}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-500 shrink-0" size={24} />
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">{error}</span>
                        </div>
                        <button
                            onClick={() => { setError(null); setScanning(true); window.location.reload(); }}
                            className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                        >
                            Reset Response Node
                        </button>
                    </motion.div>
                )}

                {!error && !scanResult && (
                    <div className="mt-10 flex items-center gap-4 px-6 py-5 bg-slate-950 border border-slate-900 rounded-[2rem] shadow-xl">
                        <Zap size={20} className="text-medical-cyan animate-pulse shrink-0" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Scanning automatically decrypts patient records using authorized responder key. System status: <span className="text-emerald-400">NOMINAL</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
