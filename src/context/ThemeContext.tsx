import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme } from '../theme';

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const currentTheme = isDark ? theme.dark : theme.light;

    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Mapeamento CSS Variables
    root.style.setProperty('--bg-primary', currentTheme.colors.background);
    root.style.setProperty('--bg-surface', currentTheme.colors.surface);
    root.style.setProperty('--bg-surface-highlight', currentTheme.colors.surfaceHighlight);
    
    root.style.setProperty('--text-primary', currentTheme.colors.textPrimary);
    root.style.setProperty('--text-secondary', currentTheme.colors.textSecondary);
    
    root.style.setProperty('--border-color', currentTheme.colors.border);
    
    root.style.setProperty('--primary-color', currentTheme.colors.primary);
    root.style.setProperty('--primary-soft', currentTheme.colors.primarySoft);
    root.style.setProperty('--accent-color', currentTheme.colors.accent);
    root.style.setProperty('--accent-text', currentTheme.colors.accentText);

    root.style.setProperty('--shadow-card', currentTheme.shadows.card);

  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};