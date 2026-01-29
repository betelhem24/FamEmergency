import React from 'react';

interface StatusBadgeProps {
    status: 'online' | 'offline' | 'emergency' | 'safe' | 'warning';
    label?: string;
    pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    label,
    pulse = false
}) => {
    const colors = {
        online: '#10b981',
        offline: '#6b7280',
        emergency: '#ef4444',
        safe: '#10b981',
        warning: '#f59e0b'
    };

    const labels = {
        online: 'Online',
        offline: 'Offline',
        emergency: 'Emergency',
        safe: 'Safe',
        warning: 'Warning'
    };

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            background: `${colors[status]}20`,
            border: `1px solid ${colors[status]}40`
        }}>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: colors[status],
                animation: pulse ? 'pulse 2s infinite' : 'none'
            }} />
            <span style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: colors[status]
            }}>
                {label || labels[status]}
            </span>
        </div>
    );
};
