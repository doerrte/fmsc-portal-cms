'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';

const GlobalBackground = () => {
  const { heroImage, theme } = useTheme();

  return (
    <div className="fixed-background">
      <Image 
        src={heroImage} 
        alt="Background" 
        fill 
        priority
        className="object-cover"
        style={{ filter: 'blur(60px)', opacity: 0.45 }}
      />
      <div className={`overlay ${theme === 'dark' ? 'dark-overlay' : 'light-overlay'}`} />

      <style jsx>{`
        .fixed-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -10;
          pointer-events: none;
        }

        .overlay {
          position: absolute;
          inset: 0;
          transition: background 0.5s ease;
        }

        .dark-overlay {
          background: radial-gradient(circle at center, rgba(10, 12, 16, 0.4) 0%, rgba(10, 12, 16, 0.75) 100%);
        }

        .light-overlay {
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.6) 100%);
        }
      `}</style>
    </div>
  );
};

export default GlobalBackground;
