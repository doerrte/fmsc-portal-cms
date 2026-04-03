'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import EditButton from './EditButton';

const Hero = ({ title, subtitle, bgImage }: { title?: string, subtitle?: string, bgImage?: string }) => {
  const imageUrl = bgImage || '/hero_modelflying_jet_cinematic_1774782875980.png';
  const { theme } = useTheme();
  return (
    <section className="hero" style={{ background: `#020617 url('${imageUrl}') center/cover no-repeat` }}>
      <div className="hero-overlay" />
      <div className="hero-grid" />

      <div className="container hero-container">
        <div className="hero-branding">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            src="/logo_clean.png"
            alt="FMSC Official Logo"
            className="official-logo block mx-auto lg:w-[1300px] h-auto"
            style={{ 
              width: '252px', 
              maxWidth: '252px',
              filter: theme === 'light' ? 'brightness(0)' : 'none',
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)'
            }}
          />
        </div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-badge"
          >
            <span className="dot" />
            Flugbetrieb Aktiv
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            {title || 'Faszination Modellflug in Königshoven'}
            <EditButton href="/admin/settings" label="Titel bearbeiten" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-description"
          >
            {subtitle || 'Willkommen beim FMSC Königshoven 1975 e.V. – Ihrem Verein für hochwertigen Modellflugsport und technisches Know-how in Bedburg.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-actions"
          >
            <Link href="/contact" className="btn-primary">
              Jetzt Mitfliegen <ArrowRight size={20} />
            </Link>
            <Link href="/gallery" className="btn-secondary">
              < Play size={20} className="fill-current" /> Verein Entdecken
            </Link>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-branding {
          grid-column: 1 / -1;
          display: flex;
          justify-content: center;
          margin-bottom: 4rem;
          width: 100%;
          position: relative;
          z-index: 20;
        }

        .official-logo {
          transition: all 0.3s ease;
          opacity: 0.95;
        }

        .official-logo:hover {
          opacity: 1;
          transform: translateY(-2px) scale(1.05);
        }

        @media (max-width: 1024px) {
          .hero-branding { 
            justify-content: center; 
            margin-bottom: 2rem;
            grid-column: 1 / -1;
          }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            var(--hero-gradient-start) 0%,
            var(--hero-gradient-mid) 40%,
            var(--hero-gradient-end) 100%
          );
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(86, 126, 182, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: linear-gradient(to bottom, white, transparent);
        }

        .hero-container {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          padding-top: 10px;
        }

        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 100px;
          }
          .hero-overlay {
            background: var(--hero-gradient-start);
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 16px;
          border-radius: 99px;
          border: 1px solid var(--card-border);
          color: #567eb6;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 2rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 10px #22c55e;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1.1;
          color: var(--foreground);
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }

        .highlight {
          color: #567eb6;
          position: relative;
        }

        .hero-description {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          max-width: 600px;
        }

        @media (max-width: 1024px) {
          .hero-description { margin-inline: auto; font-size: 1.1rem; }
        }

        :global(.hero-actions) {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          gap: 2.5rem !important;
          margin-top: 2rem !important;
          justify-content: flex-start !important;
          width: 100% !important;
        }

        @media (max-width: 1024px) {
          :global(.hero-actions) { 
            flex-direction: column !important; 
            align-items: center !important; 
            gap: 1.5rem !important; 
            justify-content: center !important;
          }
          .btn-primary, .btn-secondary {
            width: 100% !important;
            max-width: 300px !important;
          }
        }

        :global(.btn-primary) {
          background: #567eb6;
          color: var(--foreground) !important;
          padding: 18px 36px;
          border-radius: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 1.1rem;
          width: 260px !important;
          white-space: nowrap !important;
          transition: all 0.3s;
          text-decoration: none !important;
        }

        :global(.btn-primary:hover) {
          background: #45689a;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(86, 126, 182, 0.3);
        }

        :global(.btn-secondary) {
          background: rgba(255, 255, 255, 0.05);
          color: var(--foreground) !important;
          padding: 18px 36px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 260px !important;
          white-space: nowrap !important;
          border: 1px solid var(--card-border);
          transition: all 0.3s;
          text-decoration: none !important;
        }

        :global(.btn-secondary:hover) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default Hero;
