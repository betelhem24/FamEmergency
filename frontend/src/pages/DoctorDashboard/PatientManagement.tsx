import React, { useState, useEffect } from 'react';
import { Search, User, ArrowRight, Filter, Users, Shield, Plus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const PatientManagement: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPatients();
    }, [search]);

    const fetchPatients = async () => {
        try {
            const url = new URL(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/patients`);
            if (search) url.searchParams.append('search', search);

            const res = await fetch(url.toString(), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPatients(data);
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pt-4 pb-24 px-4 overflow-y-auto h-full no-scrollbar bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">
                        Patient Logs
                    </h1>
                    <p className="text-[var(--accent-primary)]/60 text-[9px] font-black tracking-[0.4em] uppercase mt-3 italic">Clinical Registry Hub</p>
                </div>
                <div className="p-3 bg-[var(--accent-primary)]/10 rounded-2xl text-[var(--accent-primary)]">
                    <Users size={20} />
                </div>
            </header>

            {/* Search & Filter */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH BIO-IDENTITY..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[var(--accent-primary)]/40 transition-all placeholder:text-white/10"
                    />
                </div>
                <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[var(--accent-primary)] active:scale-95 transition-all">
                    <Filter size={20} />
                </button>
            </div>

            {/* Patient List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 text-center animate-pulse">
                        <Shield className="mx-auto mb-4 text-white/10" size={40} />
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Decrypting Registry...</p>
                    </div>
                ) : patients.length === 0 ? (
                    <div className="py-20 text-center opacity-40">
                        <Users className="mx-auto mb-4" size={40} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Identities Found</p>
                    </div>
                ) : (
                    patients.map((patient, index) => (
                        <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(`/doctor/profile/${patient.id || patient._id}`)}
                            className="glass-card p-5 rounded-[2rem] border-white/5 active:scale-[0.98] transition-all cursor-pointer group hover:bg-white/[0.03]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-glow)] flex items-center justify-center text-black shadow-lg shadow-[var(--accent-primary)]/20">
                                    <User size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-white uppercase italic tracking-tight">{patient.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                                            {patient.department || 'General'}
                                        </span>
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Optional: Handle patient menu
                                        }}
                                        className="p-2 text-white/20 hover:text-white transition-colors"
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    <div className="p-2 bg-white/5 rounded-xl text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-black transition-all">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Quick Action Float */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-28 right-6 w-14 h-14 bg-[var(--accent-primary)] rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--accent-primary)]/50 text-black z-50"
            >
                <Plus size={28} />
            </motion.button>
        </div>
    );
};

export default PatientManagement;
