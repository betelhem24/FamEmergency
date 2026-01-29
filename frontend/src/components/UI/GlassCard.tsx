import React from 'react';
import '../../styles/glassmorphism.css';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    size: _size = 'md',
    hover = false,
    onClick,
    style
}) => {
    const hoverClass = hover ? 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300' : '';
    const cursorClass = onClick ? 'cursor-pointer active:scale-95' : '';

    return (
        <div
            className={`medical-glass ${hoverClass} ${cursorClass} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
};
