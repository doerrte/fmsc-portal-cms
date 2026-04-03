'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fmsc_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fmsc_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('fmsc_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="cookie-banner-wrapper"
        >
          <div className="cookie-banner glass">
            <div className="cookie-content">
              <div className="cookie-icon-wrapper">
                <Cookie className="cookie-icon" size={24} />
              </div>
              <div className="cookie-text">
                <h3>Privatsphäre & Sicherheit</h3>
                <p>
                  Wir nutzen technisch notwendige Cookies sowie externe Dienste wie <strong>Google reCAPTCHA</strong> und 
                  <strong>Web-Push</strong>, um Ihnen ein sicheres und informatives Erlebnis zu bieten. 
                  Mehr dazu in unserer <Link href="/datenschutz" className="legal-link">Datenschutzerklärung <ExternalLink size={12} /></Link>.
                </p>
              </div>
            </div>
            
            <div className="cookie-actions">
              <button onClick={handleDecline} className="btn-decline">
                Ablehnen
              </button>
              <button onClick={handleAccept} className="btn-accept">
                <ShieldCheck size={18} />
                Alles Akzeptieren
              </button>
              <button onClick={() => setIsVisible(false)} className="close-btn" aria-label="Schließen">
                <X size={18} />
              </button>
            </div>
          </div>

          <style jsx>{`
            .cookie-banner-wrapper {
              position: fixed;
              bottom: 2rem;
              left: 2rem;
              right: 2rem;
              z-index: 9999;
              display: flex;
              justify-content: center;
              pointer-events: none;
            }

            .cookie-banner {
              pointer-events: auto;
              width: 100%;
              max-width: 800px;
              padding: 1.5rem 2rem;
              border-radius: 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 2rem;
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            @media (max-width: 768px) {
              .cookie-banner-wrapper {
                bottom: 1rem; left: 1rem; right: 1rem;
              }
              .cookie-banner {
                flex-direction: column;
                gap: 1.5rem;
                padding: 1.5rem;
                text-align: center;
              }
              .cookie-content {
                flex-direction: column;
              }
            }

            .cookie-content {
              display: flex;
              align-items: flex-start;
              gap: 1.25rem;
              flex: 1;
            }

            .cookie-icon-wrapper {
              width: 44px;
              height: 44px;
              background: rgba(192, 0, 0, 0.1);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--primary);
              flex-shrink: 0;
            }

            .cookie-text h3 {
              font-size: 1.1rem;
              font-weight: 700;
              margin-bottom: 0.25rem;
              color: var(--foreground);
            }

            .cookie-text p {
              font-size: 0.9rem;
              line-height: 1.5;
              color: var(--text-secondary);
            }

            .legal-link {
              color: var(--foreground);
              text-decoration: underline;
              text-underline-offset: 2px;
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }

            .cookie-actions {
              display: flex;
              align-items: center;
              gap: 1rem;
              position: relative;
            }

            .btn-accept {
              background: #c00000;
              color: #ffffff;
              padding: 0.75rem 1.5rem;
              border-radius: 12px;
              font-weight: 700;
              font-size: 0.9rem;
              display: flex;
              align-items: center;
              gap: 8px;
              white-space: nowrap;
              transition: all 0.2s;
            }

            .btn-accept:hover {
              background: #e60000;
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(192, 0, 0, 0.3);
            }

            .btn-decline {
              background: transparent;
              color: var(--text-secondary);
              font-weight: 600;
              font-size: 0.9rem;
              padding: 0.5rem 1rem;
              transition: all 0.2s;
            }

            .btn-decline:hover {
              color: var(--foreground);
            }

            .close-btn {
              position: absolute;
              top: -0.75rem;
              right: -1.25rem;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 50%;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--text-secondary);
              transition: all 0.2s;
            }

            .close-btn:hover {
              background: rgba(255, 255, 255, 0.1);
              color: var(--foreground);
            }

            @media (max-width: 768px) {
              .close-btn {
                top: -0.5rem;
                right: -0.5rem;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
