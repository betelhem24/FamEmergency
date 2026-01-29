import React from 'react';
import { ScanLine, MapPin, BarChart3, Users, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DoctorHome: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const doctorName = user?.name || "Doctor";

    const chartData = [
        { name: 'Mon', count: 12 },
        { name: 'Tue', count: 19 },
        { name: 'Wed', count: 15 },
        { name: 'Thu', count: 22 },
        { name: 'Fri', count: 30 },
        { name: 'Sat', count: 10 },
        { name: 'Sun', count: 8 },
    ];

    const COLORS = ['#06b6d4', '#10b981', '#06b6d4', '#10b981', '#06b6d4', '#10b981', '#06b6d4'];

    return (
        <div className="space-y-6 pt-4 pb-20 px-2 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="px-2">
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Dr. {doctorName.split(' ')[0]}</h1>
                <p className="text-life-cyan/80 text-[10px] font-black tracking-[0.4em] uppercase">Emergency Command Center</p>
            </div>

            {/* Map Placeholder with Circles */}
            <div className="px-2">
                <div className="relative h-56 glass-card rounded-[2.5rem] overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                        {/* Fake map drawing */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-life-cyan/40 via-transparent to-transparent"></div>
                        <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1,0/400x400?access_token=none')] bg-cover opacity-40"></div>

                        {/* Family Circles */}
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]"></motion.div>
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} className="absolute top-1/3 left-1/4 w-3 h-3 bg-life-cyan rounded-full shadow-[0_0_15px_#06b6d4]"></motion.div>
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-life-cyan rounded-full shadow-[0_0_10px_#06b6d4]"></motion.div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                        <MapPin size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Family Radar</span>
                    </div>
                </div>
            </div>

            {/* Main Action Scanner */}
            <div className="px-2">
                <button
                    onClick={() => navigate('/doctor/scan')}
                    className="w-full relative group h-40 overflow-hidden rounded-[3rem]"
                >
                    <div className="absolute inset-0 bg-life-cyan/20 group-hover:bg-life-cyan/30 transition-colors"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-life-cyan/40 group-hover:border-life-cyan/60 rounded-[3rem] shadow-[0_15px_30px_rgba(6,182,212,0.2)]">
                        <div className="p-4 bg-life-cyan rounded-2xl shadow-lg mb-3">
                            <ScanLine size={32} className="text-white" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Scan for Medical Info</h2>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-life-cyan/10 border-b-2 border-life-cyan/40 animate-scan pointer-events-none"></div>
                </button>
            </div>

            {/* Chart Widget */}
            <div className="px-2">
                <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={14} className="text-life-cyan" /> Patients Scanned (Weekly)
                        </h3>
                        <span className="text-emerald-500 text-[10px] font-black">+14%</span>
                    </div>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <Tooltip
                                    contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#06b6d4', fontWeight: 'bold', fontSize: '10px' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Action Bottom Bar */}
            <div className="grid grid-cols-2 gap-4 px-2">
                <button
                    onClick={() => navigate('/doctor/profile')}
                    className="glass-panel p-4 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all border-l-4 border-l-life-cyan"
                >
                    <Users className="text-life-cyan mb-2" size={20} />
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Profiles</p>
                </button>
                <button className="glass-panel p-4 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all">
                    <Plus className="text-emerald-500 mb-2" size={20} />
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">New Entry</p>
                </button>
            </div>
        </div>
    );
};

export default DoctorHome;
