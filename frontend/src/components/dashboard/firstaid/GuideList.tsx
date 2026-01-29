import React, { useState } from 'react';
import { Search, Heart, Wind, Flame, Zap, Bandage } from 'lucide-react';
import GuideCard from './GuideCard';

const guides = [
    { id: '1', title: 'CPR Basics', category: 'Heart', icon: Heart, readTime: '3 min' },
    { id: '2', title: 'Choking (Heimlich)', category: 'Breathing', icon: Wind, readTime: '2 min' },
    { id: '3', title: 'Severe Burns', category: 'Injury', icon: Flame, readTime: '4 min' },
    { id: '4', title: 'Electric Shock', category: 'Safety', icon: Zap, readTime: '5 min' },
    { id: '5', title: 'Stop Bleeding', category: 'Trauma', icon: Bandage, readTime: '3 min' },
];

const GuideList: React.FC = () => {
    const [search, setSearch] = useState('');
    const filtered = guides.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search guides (e.g. CPR)..."
                    className="glass-input w-full pl-10 py-3 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-3">
                {filtered.map(guide => (
                    <GuideCard key={guide.id} {...guide} onClick={() => alert(`Opening ${guide.title}`)} />
                ))}
            </div>
        </div>
    );
};

export default GuideList;
