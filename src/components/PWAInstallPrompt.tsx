'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Manually register the service worker for PWA Push features
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('PWA Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // 2. Handle the install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a few seconds before showing to avoid annoying the user
      setTimeout(() => {
        const isDismissed = localStorage.getItem('pwa-dismissed');
        if (!isDismissed) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          className="pwa-prompt glass"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="pwa-content">
            <div className="pwa-icon-box">
              <Smartphone size={24} className="text-primary" />
            </div>
            <div className="pwa-text">
              <h3>FMSC App installieren</h3>
              <p>Hole dir das Portal für schnellen Zugriff auf deinen Homescreen.</p>
            </div>
          </div>
          <div className="pwa-actions">
            <button onClick={handleInstall} className="btn-install">
              <Download size={16} /> Installieren
            </button>
            <button onClick={handleDismiss} className="btn-close">
              <X size={20} />
            </button>
          </div>

          <style jsx>{`
            .pwa-prompt {
              position: fixed; bottom: 20px; left: 20px; right: 20px;
              max-width: 500px; margin: 0 auto; z-index: 9999;
              padding: 1.5rem; border-radius: 24px;
              display: flex; align-items: center; justify-content: space-between;
              gap: 1.5rem; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
              border: 1px solid var(--card-border);
            }

            @media (max-width: 480px) {
              .pwa-prompt { flex-direction: column; text-align: center; gap: 1rem; align-items: stretch; }
              .pwa-content { flex-direction: column; }
            }

            .pwa-content { display: flex; align-items: center; gap: 1rem; }
            .pwa-icon-box { 
              padding: 12px; border-radius: 16px; background: rgba(86, 126, 182, 0.1); 
              display: flex; align-items: center; justify-content: center;
            }

            .pwa-text h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; }
            .pwa-text p { font-size: 0.85rem; color: var(--text-tertiary); line-height: 1.3; }

            .pwa-actions { display: flex; align-items: center; gap: 10px; }

            .btn-install {
              padding: 10px 20px; border-radius: 12px; background: var(--primary);
              color: white; font-weight: 700; font-size: 0.9rem; display: flex;
              align-items: center; gap: 8px; border: none; cursor: pointer;
              transition: transform 0.2s;
            }
            .btn-install:hover { transform: scale(1.05); }

            .btn-close {
              padding: 8px; color: var(--text-tertiary); cursor: pointer;
              transition: color 0.2s;
            }
            .btn-close:hover { color: var(--foreground); }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
