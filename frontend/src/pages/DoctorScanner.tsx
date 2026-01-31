import { useState, useEffect, useRef } from 'react';
import { ScanLine, ArrowLeft, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const DoctorScanner = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(true);
    const [scanResult, setScanResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const startScanner = async () => {
            try {
                const html5QrCode = new Html5Qrcode("reader");
                html5QrCodeRef.current = html5QrCode;
                const config = { fps: 10, qrbox: { width: 250, height: 250 } };

                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        handleScanSuccess(decodedText);
                    },
                    (errorMessage) => {
                        // ignore failures during scanning
                    }
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
    }, []);

    const handleScanSuccess = async (userId: string) => {
        if (html5QrCodeRef.current?.isScanning) {
            await html5QrCodeRef.current.stop();
        }
        setScanning(false);

        // Simulate Beep
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime);
            oscillator.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.1);
        } catch (e) { console.warn('Audio feedback failed', e); }

        // Fetch Real Data
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Identity not found in database');
            }

            if (!data.medicalRecord) {
                throw new Error('No medical data found for this identity');
            }

            setScanResult(data.user.name);

            // Redirect after success
            setTimeout(() => {
                navigate('/doctor/profile', { state: { patientData: data } });
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6 pt-2 h-screen flex flex-col pb-24 relative overflow-hidden bg-slate-950">
            <div className="flex justify-between items-center px-4 relative z-20">
                <button
                    onClick={() => navigate('/doctor')}
                    className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-black text-white uppercase tracking-widest">Live Scanner</h1>
                    <p className="text-[10px] text-emerald-400 font-bold tracking-widest flex items-center justify-center gap-1">
                        <ShieldCheck size={10} /> ENCRYPTED REAL-TIME LINK
                    </p>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-4 z-10">
                <div className="w-full max-w-sm aspect-square relative">
                    {/* Scanner Container for html5-qrcode */}
                    <div id="reader" className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-black"></div>

                    {/* Custom HUD Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-life-cyan rounded-tl-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-life-cyan rounded-tr-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-life-cyan rounded-bl-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-life-cyan rounded-br-3xl shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>

                        {scanning && (
                            <motion.div
                                initial={{ top: '10%' }} animate={{ top: '90%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-4 right-4 h-0.5 bg-life-cyan shadow-[0_0_15px_rgba(6,182,212,1)] z-20"
                            />
                        )}
                    </div>

                    <AnimatePresence>
                        {(error || scanResult) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className={`absolute bottom-[-100px] left-0 right-0 p-6 rounded-[2rem] border backdrop-blur-xl ${error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {error ? <AlertCircle size={24} /> : <Zap size={24} />}
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                            {error ? 'Scan Error' : 'Identity Verified'}
                                        </p>
                                        <p className="font-bold text-sm tracking-tight">{error || `Loaded record for ${scanResult}`}</p>
                                    </div>
                                </div>
                                {error && (
                                    <button
                                        onClick={() => { setError(null); setScanning(true); window.location.reload(); }}
                                        className="mt-3 w-full py-2 bg-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all text-red-400"
                                    >
                                        Restart Scanner
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="px-8 pb-32 text-center relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">
                    Position QR code within the frame to authorize data exchange
                </p>
            </div>
        </div>
    );
};

export default DoctorScanner;
