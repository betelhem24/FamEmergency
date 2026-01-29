import React from 'react';
import '../../styles/glassmorphism.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'danger' | 'success' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = ''
}) => {
    const baseStyles = 'glass-button transition-all';

    const variantStyles = {
        primary: 'bg-primary hover:bg-primary-light',
        danger: 'bg-danger hover:bg-red-600',
        success: 'bg-success hover:bg-green-600',
        secondary: 'bg-secondary hover:bg-purple-600'
    };

    const sizeStyles = {
        sm: 'text-sm px-3 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
            }}
        >
            {loading ? (
                <span className="spin">⟳</span>
            ) : (
                children
            )}
        </button>
    );
};
