import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    overlay = false
}) => {
    const sizes = {
        sm: '24px',
        md: '48px',
        lg: '72px'
    };

    const spinner = (
        <div style={{
            width: sizes[size],
            height: sizes[size],
            border: '4px solid rgba(99, 102, 241, 0.2)',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
    );

    if (overlay) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}>
                {spinner}
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            {spinner}
        </div>
    );
};
