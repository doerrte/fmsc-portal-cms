'use client';

import React from 'react';
import { Plane, Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo">
            <Plane className="logo-icon" size={24} />
            <span className="logo-title">FMSC Königshoven</span>
          </div>
          <p>
            Tradition und Fortschritt im Modellflugsport vereint. 
            Besuchen Sie uns am Königshovener Feld in Bedburg.
          </p>
          <div className="socials">
            <a href="#" className="social-icon"><Globe size={20} /></a>
            <a href="#" className="social-icon"><Share2 size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <a href="/news">Neuigkeiten</a>
          <a href="/about">Verein</a>
          <a href="/events">Termine</a>
          <a href="/info">Beiträge</a>
        </div>

        <div className="footer-contact">
          <h4>Kontakt</h4>
          <div className="contact-item">
            <MapPin size={18} />
            <span>50181 Bedburg, Königshovener Feld</span>
          </div>
          <div className="contact-item">
            <Mail size={18} />
            <span>vorstand@fmsc-koenigshoven.de</span>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <span>+49 123 456789</span>
          </div>
        </div>

        <div className="footer-legal">
          <h4>Rechtliches</h4>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} FMSC Königshoven 1975 e.V. – Alle Rechte vorbehalten.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--card-bg);
          padding: 5rem 0 2rem;
          border-top: 1px solid var(--card-border);
          color: var(--text-secondary);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 4rem;
          margin-bottom: 4rem;
        }

        @media (min-width: 1024px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        .footer-brand .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--foreground);
          margin-bottom: 1.5rem;
        }

        .logo-title {
          font-weight: 800;
          font-size: 1.25rem;
        }

        .logo-icon {
          color: var(--primary);
        }

        .footer-brand p {
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .socials {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          background: var(--card-border);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--foreground);
          transition: all 0.2s;
        }

        .social-icon:hover {
          background: var(--primary);
          transform: translateY(-2px);
        }

        h4 {
          color: var(--foreground);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .footer-links, .footer-legal {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links a, .footer-legal a {
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .footer-links a:hover, .footer-legal a:hover {
          color: var(--primary);
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
        }

        .contact-item span {
          line-height: 1.4;
        }

        .footer-bottom {
          border-top: 1px solid var(--card-border);
          padding-top: 2rem;
          text-align: center;
          font-size: 0.85rem;
          opacity: 0.6;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
