'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      title={`Zum ${theme === 'dark' ? 'Light' : 'Dark'} Mode wechseln`}
      style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--foreground)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(128,128,128,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {theme === 'dark' ? <Sun size={20} color="#f97316" /> : <Moon size={20} color="#567eb6" />}
    </button>
  );
}
