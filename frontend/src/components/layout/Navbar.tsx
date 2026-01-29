import React from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import {
    User,
    Siren,
    BookOpen,
    Map as MapIcon,
    Clock,
    LogOut,
    Crosshair
} from 'lucide-react';

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    const dispatch = useAppDispatch();

    const navItems = [
        { id: 'emergency', icon: Siren, label: 'EMERGENCY' },
        { id: 'guardian', icon: Clock, label: 'GUARDIAN' },
        { id: 'map', icon: MapIcon, label: 'SAFE_MAP' },
        { id: 'firstaid', icon: BookOpen, label: 'FIRST_AID' },
        { id: 'profile', icon: User, label: 'MY_PROFILE' },
    ];

    return (
        <nav className="sticky top-0 z-[100] border-b border-slate-100 bg-white/80 backdrop-blur-xl">
            <div className="px-6 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-medical-navy rounded-2xl shadow-xl shadow-medical-navy/20">
                        <Crosshair className="text-medical-cyan w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black italic text-medical-navy leading-none tracking-tighter">
                            FAM_EMERGENCY
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 text-nowrap">
                            Professional Life-Support Node
                        </span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    {navItems.map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 group
                ${activeTab === id
                                    ? 'bg-slate-50 border border-slate-100 text-medical-navy shadow-inner shadow-slate-200'
                                    : 'text-slate-400 hover:text-medical-navy hover:bg-slate-50'}`}
                        >
                            <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 2} className={activeTab === id ? 'text-medical-cyan' : ''} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => dispatch(logout())}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    <span>Secure Exit</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
