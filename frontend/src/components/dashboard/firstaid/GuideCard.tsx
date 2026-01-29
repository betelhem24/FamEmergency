import React from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

interface Props {
    icon: LucideIcon;
    title: string;
    category: string;
    readTime: string;
    onClick: () => void;
}

const GuideCard: React.FC<Props> = ({ icon: Icon, title, category, readTime, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="glass-card glass-card-sm p-4 w-full text-left hover:bg-white/10 transition-colors group flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                </div>
                <div>
                    <h4 className="text-white font-semibold">{title}</h4>
                    <p className="text-xs text-indigo-300/70">{category} • {readTime}</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </button>
    );
};

export default GuideCard;
