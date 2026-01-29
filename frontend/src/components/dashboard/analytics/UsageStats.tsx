import React from 'react';
import { Activity, Clock, Zap, TrendingUp } from 'lucide-react';

const stats = [
    { label: 'Avg Respond Time', value: '4.2m', icon: Clock, color: 'text-blue-400', trend: '-12%' },
    { label: 'Guardian Usage', value: '12h', icon: Zap, color: 'text-yellow-400', trend: '+5%' },
    { label: 'Family Safety', value: '98%', icon: Activity, color: 'text-green-400', trend: 'Stable' },
    { label: 'Health Score', value: '85', icon: TrendingUp, color: 'text-indigo-400', trend: '+2%' },
];

const UsageStats: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="glass-card glass-card-sm p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <span className={`text-[10px] font-bold ${stat.trend.startsWith('-') ? 'text-green-400' : stat.trend === 'Stable' ? 'text-gray-400' : 'text-blue-400'}`}>
                            {stat.trend}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UsageStats;
