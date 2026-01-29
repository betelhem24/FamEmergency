import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = '#00d2ff'
}) => {
    return (
        <div className="glass-card stat-card">
            {Icon && (
                <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
                    <Icon color={color} size={24} />
                </div>
            )}
            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <div className="stat-value">{value}</div>
                {subtitle && <p className="stat-subtitle">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;
