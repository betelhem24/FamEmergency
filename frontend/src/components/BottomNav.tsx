import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Activity, GraduationCap, Map, FileText, User, ScanLine, BarChart3, Users } from 'lucide-react';

interface BottomNavProps {
    role: 'patient' | 'doctor';
}

const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
    const patientLinks = [
        { to: '/', icon: Shield, label: 'Home' },
        { to: '/timer', icon: Activity, label: 'Timer' },
        { to: '/academy', icon: GraduationCap, label: 'Learn' },
        { to: '/radar', icon: Map, label: 'Radar' },
        { to: '/vault', icon: FileText, label: 'Vault' },
        { to: '/community', icon: Users, label: 'Social' },
    ];

    const doctorLinks = [
        { to: '/doctor', icon: ScanLine, label: 'Scan' },
        { to: '/doctor/analytics', icon: BarChart3, label: 'Data' },
        { to: '/doctor/profile', icon: User, label: 'Records' },
    ];

    const links = role === 'patient' ? patientLinks : doctorLinks;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy-deep/80 backdrop-blur-lg border-t border-white/10 pb-safe">
            <div className="container mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
                <div className="flex justify-around items-center h-16">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${isActive ? 'text-life-cyan scale-110' : 'text-slate-400 hover:text-slate-200'
                                }`
                            }
                        >
                            <link.icon size={20} strokeWidth={2.5} />
                            <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
