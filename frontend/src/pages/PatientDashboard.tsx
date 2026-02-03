import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Heart, Wind, AlertCircle, Wifi } from 'lucide-react';

const PatientDashboard: React.FC = () => {
    const [vitals, setVitals] = useState<{ time: string; heartRate: number; spo2: number }[]>([]);
    const [isEmergency, setIsEmergency] = useState(false);

    // Simulate Real-time Vitals
    useEffect(() => {
        const interval = setInterval(() => {
            setVitals(prev => {
                const newPoint = {
                    time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    heartRate: 70 + Math.random() * 20, // 70-90 bpm
                    spo2: 95 + Math.random() * 4,       // 95-99%
                };
                const updated = [...prev, newPoint];
                if (updated.length > 20) updated.shift(); // Keep last 20 points
                return updated;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const triggerEmergency = () => {
        setIsEmergency(true);
        // TODO: Emit socket event here
        setTimeout(() => setIsEmergency(false), 5000); // Reset for demo
    };

    return (
        <div className="min-h-screen bg-navy-deep bg-neural-grid p-6 text-slate-200">

            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-between items-center mb-8 glass-nav p-4 rounded-xl"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-cyan-neon/20 rounded-lg border border-cyan-neon/50 animate-pulse-slow">
                        <Activity className="text-cyan-neon w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wider uppercase text-glow">Neural Status</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-success-green rounded-full animate-ping" />
                            <span className="text-xs font-mono text-cyan-neon/70">SYSTEM ONLINE // NODE-01</span>
                        </div>
                    </div>
                </div>
                <div className="glass-panel px-4 py-2 flex items-center gap-3">
                    <Wifi className="w-4 h-4 text-cyan-neon" />
                    <span className="font-mono text-xs text-cyan-neon">LATENCY: 12ms</span>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Vitals Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-panel p-6"
                >
                    <div className="flex justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Heart className="text-alert-red w-5 h-5 animate-pulse" />
                            CARDIAC RHYTHM
                        </h2>
                        <span className="text-3xl font-black font-mono text-white">
                            {vitals.length > 0 ? Math.round(vitals[vitals.length - 1].heartRate) : '--'}
                            <span className="text-sm text-slate-500 ml-1">BPM</span>
                        </span>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={vitals}>
                                <defs>
                                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10 }} interval={2} />
                                <YAxis domain={[50, 120]} stroke="#475569" tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                    itemStyle={{ color: '#ef4444' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="heartRate"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorHr)"
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Status & Actions */}
                <div className="space-y-6">

                    {/* SpO2 Card */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Wind className="w-24 h-24" />
                        </div>
                        <h3 className="text-sm font-mono text-cyan-neon mb-2">OXYGEN SATURATION</h3>
                        <div className="text-5xl font-black text-white mb-2">
                            {vitals.length > 0 ? Math.round(vitals[vitals.length - 1].spo2) : '--'}%
                        </div>
                        <div className="w-full bg-navy-deep h-1 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-cyan-neon"
                                animate={{ width: `${vitals.length > 0 ? vitals[vitals.length - 1].spo2 : 0}%` }}
                            />
                        </div>
                    </motion.div>

                    {/* Health Insights Card */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-6 border-l-4 border-emerald-500"
                    >
                        <h3 className="text-sm font-mono text-emerald-500 mb-4 uppercase tracking-widest">Neural Health Insight</h3>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wide">
                            Heart rhythm stable. SpO2 levels optimal. System suggests maintaining current hydration levels for peak performance.
                        </p>
                        <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">AI Status: Analyzing...</span>
                        </div>
                    </motion.div>
                </div>

            </div>

            {/* Footer Status */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {['NEURAL LINK: STABLE', 'ENCRYPTION: AES-256', 'BATTERY: 98%', 'GUARDIAN: ACTIVE'].map((status, i) => (
                    <div key={i} className="glass-panel p-3 text-center border-l-4 border-cyan-neon">
                        <span className="text-xs font-mono font-bold text-slate-400">{status}</span>
                    </div>
                ))}
            </motion.div>

        </div>
    );
};

export default PatientDashboard;
