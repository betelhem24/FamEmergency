import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Zap } from 'lucide-react';

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
        <div className="space-y-6 pt-4 pb-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-slate-400 text-sm">Patient Health Trends</p>
            </div>

            {/* Heart Rate Chart */}
            <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <Heart size={18} className="text-red-400" />
                        </div>
                        <h3 className="text-white font-semibold">Heart Rate</h3>
                    </div>
                    <span className="text-2xl font-bold text-white">72 <span className="text-xs text-slate-400 font-normal">BPM</span></span>
                </div>

                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="bpm" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorBpm)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Blood Sugar Chart */}
            <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-life-cyan/20 rounded-lg">
                            <Zap size={18} className="text-life-cyan" />
                        </div>
                        <h3 className="text-white font-semibold">Glucose</h3>
                    </div>
                    <span className="text-2xl font-bold text-white">100 <span className="text-xs text-slate-400 font-normal">mg/dL</span></span>
                </div>

                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="sugar" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default AnalyticsDashboard;
