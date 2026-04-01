'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  heroImage: string;
  setHeroImage: (image: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Permanently set to dark mode
  const [theme] = useState<Theme>('dark');
  const [primaryColor, setPrimaryColor] = useState('#567eb6');
  const [heroImage, setHeroImage] = useState('/hero-plane.png');

  useEffect(() => {
    // Always apply dark theme attribute to document
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // No-op: Toggle is disabled as per user request
    console.log('Theme toggle is disabled. Application is locked to Dark Mode.');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, toggleTheme, primaryColor, setPrimaryColor, heroImage, setHeroImage 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
