import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to 'system'
    const savedTheme = localStorage.getItem('prudence-theme') as Theme;
    return savedTheme || 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Function to get system theme
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Update effective theme based on current theme setting
  useEffect(() => {
    let newEffectiveTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      newEffectiveTheme = getSystemTheme();
    } else {
      newEffectiveTheme = theme;
    }

    setEffectiveTheme(newEffectiveTheme);

    // Apply theme to document
    const root = document.documentElement;
    if (newEffectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save theme preference
    localStorage.setItem('prudence-theme', theme);
  }, [theme]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const systemTheme = getSystemTheme();
        setEffectiveTheme(systemTheme);
        
        const root = document.documentElement;
        if (systemTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    effectiveTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};