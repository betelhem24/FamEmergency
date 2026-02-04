import React, { useState, useRef } from 'react';
import { Bot, Send, Pill, Camera, Sparkles, ArrowLeft, BrainCircuit, X, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Greeting. I am your Clinical AI Guardian. How can I assist your health protocol today?' }
    ]);
    const [input, setInput] = useState('');
    const [isScanningMed, setIsScanningMed] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanResult, setScanResult] = useState<any>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsgs = [...messages, { role: 'user', content: input }];
        setMessages(newMsgs);
        setInput('');

        // Simulate AI Response
        setTimeout(() => {
            setMessages([...newMsgs, { role: 'ai', content: 'Analyzing medical query... based on your profile, I recommend immediate synchronization with your primary physician for this specific concern.' }]);
        }, 1000);
    };

    const startMedScan = () => {
        setIsScanningMed(true);
        setScanProgress(0);
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    completeScan();
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const completeScan = () => {
        setScanResult({
            name: 'Aspirin Clinical Grade',
            dosage: '500mg',
            frequency: 'Once Daily',
            warning: 'Avoid if stomach sensitivity is detected.'
        });
    };

    return (
        <div className="space-y-6 pt-4 pb-24 px-4 h-full flex flex-col no-scrollbar bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[var(--text-secondary)]"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4">
                            Bio-AI Guardian
                        </h1>
                        <p className="text-[var(--accent-primary)]/60 text-[9px] font-black tracking-[0.4em] uppercase mt-1">Neural Health Node</p>
                    </div>
                </div>
                <div className="p-3 bg-[var(--accent-primary)]/10 rounded-2xl">
                    <BrainCircuit size={20} className="text-[var(--accent-primary)]" />
                </div>
            </header>

            {/* AI Chat Area */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar p-1">
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: m.role === 'ai' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-3xl text-[11px] font-black tracking-tight leading-relaxed shadow-xl border ${m.role === 'ai'
                                ? 'bg-white/[0.03] border-white/5 text-[var(--text-primary)] rounded-tl-none'
                                : 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]/20 rounded-tr-none'
                                }`}>
                                {m.content}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-[var(--accent-primary)] blur-xl opacity-5 group-focus-within:opacity-20 transition-opacity"></div>
                    <div className="relative bg-white/[0.03] border border-white/5 rounded-3xl p-2 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="QUERY NEURAL NETWORK..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none text-[var(--text-primary)]"
                        />
                        <button
                            onClick={handleSend}
                            className="p-3 bg-[var(--accent-primary)] text-black rounded-2xl active:scale-90 transition-all shadow-lg"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tools Area */}
            <div className="grid grid-cols-2 gap-4 h-32">
                <button
                    onClick={startMedScan}
                    className="glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all overflow-hidden relative"
                >
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                        <Camera size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Med Scanner</span>

                    {isScanningMed && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${scanProgress}%` }}
                            className="absolute bottom-0 left-0 h-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                        />
                    )}
                </button>
                <button className="glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all">
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                        <Sparkles size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Health Insights</span>
                </button>
            </div>

            {/* Med Scan Outcome Overlay */}
            <AnimatePresence>
                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="fixed inset-x-4 bottom-24 z-50 glass-card p-8 rounded-[3rem] border-emerald-500/20 shadow-2xl"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                    <Pill size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-[var(--text-primary)] italic tracking-tight uppercase">{scanResult.name}</h4>
                                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Neural Scan Complete</p>
                                </div>
                            </div>
                            <button onClick={() => setScanResult(null)} className="text-white/20 hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Dosage Protocol</p>
                                <p className="text-[var(--text-primary)] font-black text-xs uppercase tracking-tight">{scanResult.dosage} • {scanResult.frequency}</p>
                            </div>
                            <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex items-start gap-3">
                                <AlertTriangleIcon className="text-red-500 shrink-0" size={16} />
                                <p className="text-[9px] font-black text-red-500 uppercase leading-relaxed tracking-wider">
                                    {scanResult.warning}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                // Logic to sync with medical record
                                setScanResult(null);
                            }}
                            className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            Sync to Medical Record
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

function AlertTriangleIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    )
}

export default AIAssistant;
