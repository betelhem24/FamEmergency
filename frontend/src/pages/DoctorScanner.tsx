import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ShieldCheck, Zap, AlertCircle, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const DoctorScanner = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(true);
    const [scanResult, setScanResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        const startScanner = async () => {
            try {
                const html5QrCode = new Html5Qrcode("reader");
                html5QrCodeRef.current = html5QrCode;
                const config = { fps: 15, qrbox: { width: 250, height: 250 } };

                await html5QrCode.start(
                    { facingMode: facingMode }, // Use state for camera
                    config,
                    (decodedText: string) => {
                        handleScanSuccess(decodedText);
                    },
                    (errorMessage: string) => {
                        console.debug(errorMessage);
                    }
                );
            } catch (err) {
                console.error("Scanner start error:", err);
                setError("Camera access denied or hardware error.");
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

    const handleScanSuccess = async (decodedText: string) => {
        if (html5QrCodeRef.current?.isScanning) {
            await html5QrCodeRef.current.stop();
        }
        setScanning(false);

        // Success Haptic/Audio Feedback
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, context.currentTime);
            oscillator.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.1);
        } catch (e) { console.warn('Audio feedback failed', e); }

        try {
            // Try to parse as JSON (new format with medical data)
            let patientData;
            let userId;

            try {
                patientData = JSON.parse(decodedText);
                userId = patientData.id;
                console.log('Parsed QR medical data:', patientData);
            } catch (jsonError) {
                // Fallback to old format: identity:ID
                const parts = decodedText.split(':');
                userId = parts.length > 1 ? parts[1] : decodedText;
                console.log('Using legacy QR format, userId:', userId);
            }

            if (!userId) {
                throw new Error('Invalid QR code format');
            }

            // If we don't have full patient data, fetch from backend
            if (!patientData || !patientData.name) {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/user/${userId}`);
                const result = await response.json();

                if (!response.ok || !result) {
                    throw new Error('Identity not found in Bio-Node database');
                }

                patientData = result;
            }

            setScanResult(userId);

            // Navigate to Patient Profile with parsed data
            setTimeout(() => {
                navigate('/doctor/profile', {
                    state: {
                        patientData,
                        userId,
                        scannedData: patientData // Include the scanned QR data
                    }
                });
            }, 1000);
        } catch (err: any) {
            console.error('QR scan error:', err);
            setError(err.message || 'Failed to parse QR code');
        }
    };

    return (
        <div className="space-y-6 pt-4 h-full flex flex-col pb-24 relative overflow-hidden bg-[var(--bg-primary)] px-4">
            <div className="flex justify-between items-center relative z-20">
                <button
                    onClick={() => navigate('/doctor')}
                    className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-widest italic">Live Bio-Scanner</h1>
                    <p className="text-[9px] text-emerald-500 font-black tracking-widest flex items-center justify-center gap-1.5 uppercase mt-0.5">
                        <ShieldCheck size={12} /> Secure Clinical Link
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFacingMode(prev => prev === "environment" ? "user" : "environment");
                        setScanning(false);
                        setTimeout(() => setScanning(true), 100); // Restart scanner
                    }}
                    className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[var(--accent-primary)] hover:text-white transition-colors"
                >
                    <ScanLine size={18} />
                </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center z-10">
                <div className="w-full max-w-sm aspect-square relative">
                    {/* Scanner Container */}
                    <div id="reader" className="w-full h-full rounded-[3rem] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-md"></div>

                    {/* HUD Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-14 h-14 border-t-4 border-l-4 border-[var(--accent-primary)] rounded-tl-[2.5rem] shadow-2xl opacity-80"></div>
                        <div className="absolute top-0 right-0 w-14 h-14 border-t-4 border-r-4 border-[var(--accent-primary)] rounded-tr-[2.5rem] shadow-2xl opacity-80"></div>
                        <div className="absolute bottom-0 left-0 w-14 h-14 border-b-4 border-l-4 border-[var(--accent-primary)] rounded-bl-[2.5rem] shadow-2xl opacity-80"></div>
                        <div className="absolute bottom-0 right-0 w-14 h-14 border-b-4 border-r-4 border-[var(--accent-primary)] rounded-br-[2.5rem] shadow-2xl opacity-80"></div>

                        {scanning && (
                            <motion.div
                                initial={{ top: '10%' }} animate={{ top: '90%' }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute left-6 right-6 h-0.5 bg-[var(--accent-primary)] shadow-[0_0_20px_var(--accent-primary)] z-20 opacity-60"
                            />
                        )}
                    </div>

                    <AnimatePresence>
                        {(error || scanResult) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`absolute inset-x-0 -bottom-12 p-6 rounded-[2.5rem] border backdrop-blur-2xl shadow-2xl z-30 ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${error ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                        {error ? <AlertCircle size={24} /> : <Zap size={24} />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-[var(--text-primary)]">
                                            {error ? 'Protocol Error' : 'Identity Verified'}
                                        </p>
                                        <p className={`font-black text-sm tracking-tight ${error ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {error || 'Patient Bio-Data Synchronized'}
                                        </p>
                                    </div>
                                </div>
                                {error && (
                                    <button
                                        onClick={() => { setError(null); setScanning(true); }}
                                        className="mt-4 w-full py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                                    >
                                        Retry Sequence
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="text-center px-8 relative z-10 pb-12">
                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] leading-relaxed italic opacity-40">
                    Align Life-Key QR within scanning matrix to initiate clinical handshake
                </p>
            </div>
        </div>
    );
};

export default DoctorScanner;
