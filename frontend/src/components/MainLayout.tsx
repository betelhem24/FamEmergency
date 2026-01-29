import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
            {children}
        </div>
    );
};
