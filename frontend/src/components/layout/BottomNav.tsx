import React from 'react';
import {
    User,
    BookOpen,
    Map as MapIcon,
    Clock,
    Home
} from 'lucide-react';

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'emergency', icon: Home, label: 'Home' },
        { id: 'guardian', icon: Clock, label: 'Safety' },
        { id: 'map', icon: MapIcon, label: 'Map' },
        { id: 'firstaid', icon: BookOpen, label: 'Guide' },
        { id: 'profile', icon: User, label: 'Profile' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 md:hidden">
            <div className="nav-blur mx-auto border border-white/40 shadow-2xl rounded-[2rem] flex items-center justify-around py-3 px-4 max-w-sm">
                {navItems.map(({ id, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`relative p-3 transition-all duration-300 rounded-2xl
              ${activeTab === id
                                ? 'bg-medical-navy text-white -translate-y-1 shadow-lg'
                                : 'text-slate-400 hover:text-medical-navy hover:bg-slate-50'}`}
                    >
                        <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
                        {activeTab === id && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-medical-cyan rounded-full shadow-[0_0_8px_rgba(0,242,255,1)]" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
