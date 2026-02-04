import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'dark' | 'light' | 'blue';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token } = useAuth();
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('app-theme');
        return (saved as Theme) || 'dark';
    });

    // Update theme when user logs in and has a stored preference
    useEffect(() => {
        const saved = localStorage.getItem('app-theme');
        if (!saved && user?.theme) {
            setThemeState(user.theme as Theme);
        }
    }, [user]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark', 'light', 'blue');
        root.classList.add(theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);

        // REQUIREMENT: Save selection in MongoDB + Neon
        if (token) {
            try {
                await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/theme`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ theme: newTheme })
                });
            } catch (error) {
                console.error('Failed to sync theme to backend:', error);
            }
        }
    };

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
