import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'blue';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check local storage or default to 'dark'
        const saved = localStorage.getItem('app-theme');
        return (saved as Theme) || 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old classes
        root.classList.remove('dark', 'light', 'blue');

        // Add new class
        root.classList.add(theme);

        // Save to local storage
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    // Force dark mode for now as default if something goes wrong, but system handles it

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
