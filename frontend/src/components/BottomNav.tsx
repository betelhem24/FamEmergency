import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Activity, GraduationCap, Map, FileText, ScanLine, BarChart3, Users } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

interface BottomNavProps {
    role: 'patient' | 'doctor';
}

const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
    const { sosTriggered } = useEmergency();

    if (sosTriggered) return null;

    const patientLinks = [
        { to: '/', icon: Shield, label: 'Home' },
        { to: '/timer', icon: Activity, label: 'Timer' },
        { to: '/academy', icon: GraduationCap, label: 'Learn' },
        { to: '/radar', icon: Map, label: 'Radar' },
        { to: '/vault', icon: FileText, label: 'Vault' },
        { to: '/community', icon: Users, label: 'Social' },
    ];

    const doctorLinks = [
        { to: '/doctor', icon: Map, label: 'Dispatch' },
        { to: '/doctor/scan', icon: ScanLine, label: 'Scan' },
        { to: '/doctor/patients', icon: Users, label: 'Registry' },
        { to: '/doctor/community', icon: Users, label: 'Social' },
        { to: '/doctor/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    const links = role === 'patient' ? patientLinks : doctorLinks;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-[#020617]/40 backdrop-blur-md border-t border-white/5 pb-safe animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20 max-w-lg mx-auto">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} className="flex-1 h-full">
                            {({ isActive }) => (
                                <div className={`flex flex-col items-center justify-center h-full space-y-1.5 transition-all duration-300 relative group ${isActive ? 'text-medical-cyan' : 'text-slate-500 hover:text-slate-300'}`}>
                                    <div className="relative">
                                        <link.icon size={22} strokeWidth={isActive ? 3 : 2} className="transition-all duration-300" />
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-glow"
                                                className="absolute -inset-2 bg-medical-cyan/10 rounded-full blur-md"
                                            />
                                        )}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-0.5'}`}>
                                        {link.label}
                                    </span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
