import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('is-dark');
        if (saved !== null) return saved === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Clean up any legacy data-theme attributes
        root.removeAttribute('data-theme');

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('is-dark', isDark.toString());
    }, [isDark]);

    const toggleDark = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggleDark }}>
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
