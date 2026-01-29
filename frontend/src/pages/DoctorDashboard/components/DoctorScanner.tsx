import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { LoadingSpinner } from '../../../components/UI/LoadingSpinner';
import { QrCode, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DoctorScannerProps {
    onScan?: (data: any) => void;
}

export const DoctorScanner: React.FC<DoctorScannerProps> = ({ onScan }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleScan = async (result: any) => {
        if (!result?.text) return;

        try {
            setLoading(true);
            setError(null);

            const recordId = result.text;
            const response = await axios.get(`${API_URL}/api/medical/${recordId}`);

            setSuccess(true);
            if (onScan) onScan(response.data);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Scan Error:', err);
            setError('ACCESS DENIED: Record Not Found or Encrypted');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-500">
            <div className="medical-glass p-10 bg-white border-white/80 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-medical-cyan/5 blur-3xl" />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-medical-navy italic">Identity Capture</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Triage Protocol 1.1</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <QrCode size={24} className="text-medical-cyan" />
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 border-[10px] border-white/50 rounded-[2.5rem] z-10 pointer-events-none" />
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-medical-cyan rounded-tl-2xl z-20" />
                    <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-medical-cyan rounded-tr-2xl z-20" />
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-medical-cyan rounded-bl-2xl z-20" />
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-medical-cyan rounded-br-2xl z-20" />

                    {loading ? (
                        <div className="w-full aspect-square bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 border border-slate-200">
                            <LoadingSpinner />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Querying Database...</span>
                        </div>
                    ) : success ? (
                        <div className="w-full aspect-square bg-green-50 rounded-[2rem] flex flex-col items-center justify-center gap-4 border-2 border-green-100 animate-in fade-in scale-95 duration-300">
                            <div className="p-6 bg-green-500 rounded-full shadow-lg shadow-green-500/20">
                                <CheckCircle2 size={48} className="text-white" />
                            </div>
                            <span className="text-sm font-black text-green-600 uppercase tracking-widest">Access Granted</span>
                        </div>
                    ) : (
                        <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-white shadow-inner">
                            <QrReader
                                onResult={(result, error) => {
                                    if (result) handleScan(result);
                                    if (error) console.info(error);
                                }}
                                constraints={{ facingMode: 'environment' }}
                                scanDelay={500}
                                containerStyle={{ width: '100%', height: '100%' }}
                                videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                        <AlertCircle className="text-red-500 shrink-0" size={20} />
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">{error}</span>
                    </div>
                )}

                <div className="mt-10 flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <ShieldAlert size={20} className="text-medical-navy opacity-40 shrink-0" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        Scanning automatically decrypts patient records using authorized responder key. Please ensure adequate lighting.
                    </p>
                </div>
            </div>
        </div>
    );
};
