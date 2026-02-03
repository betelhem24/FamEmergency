import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', bpm: 72, sugar: 100 },
    { name: 'Tue', bpm: 75, sugar: 105 },
    { name: 'Wed', bpm: 70, sugar: 98 },
    { name: 'Thu', bpm: 78, sugar: 110 },
    { name: 'Fri', bpm: 74, sugar: 102 },
    { name: 'Sat', bpm: 71, sugar: 95 },
    { name: 'Sun', bpm: 69, sugar: 96 },
];

const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="space-y-8 pt-6 pb-24 px-4 bg-navy-deep min-h-screen">
            <header className="relative">
                <div className="absolute -left-4 top-0 w-1 h-12 bg-cyan-neon"></div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
                    Bio-Sync <span className="text-cyan-neon">Analytics</span>
                </h1>
                <p className="text-[10px] font-black text-cyan-neon/40 uppercase tracking-[0.4em] italic mt-2">Neural Link Status: Optimal // Data Stream Active</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {/* Heart Rate Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 group-hover:scale-110 transition-transform">
                                <Heart size={24} className="text-red-500 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase text-xs tracking-widest italic">Temporal Pulse</h3>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Real-time Feedback</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-black text-white italic leading-none">72</span>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">BPM</span>
                        </div>
                    </div>

                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                    itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorBpm)" dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 6, fill: '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Blood Sugar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                <Zap size={24} className="text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-black uppercase text-xs tracking-widest italic">Glucose Flux</h3>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Glycemic Index</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-black text-white italic leading-none">100</span>
                            <span className="text-[10px] font-black text-cyan-neon uppercase tracking-widest block">mg/dL</span>
                        </div>
                    </div>

                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                    itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="sugar" stroke="#22d3ee" strokeWidth={4} fillOpacity={1} fill="url(#colorSugar)" dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 6, fill: '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
