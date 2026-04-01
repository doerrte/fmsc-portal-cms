'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ y: 10, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -10, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={22} className="icon moon" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 10, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -10, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={22} className="icon sun" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .theme-toggle {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          margin: 0 10px;
          padding: 0;
        }

        .icon {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
          transition: filter 0.3s;
        }

        .moon {
          color: #94a3b8;
        }

        .theme-toggle:hover .moon {
          color: #cbd5e1;
          filter: drop-shadow(0 0 12px rgba(148, 163, 184, 0.6));
        }

        .sun {
          color: #fbbf24;
        }

        .theme-toggle:hover .sun {
          color: #fcd34d;
          filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.6));
        }
      `}</style>
    </motion.button>
  );
};

export default ThemeToggle;
