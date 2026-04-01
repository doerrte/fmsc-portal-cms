'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, AlertTriangle, CheckCircle, Info, FileText, Smartphone, Radio, Navigation, Users, Zap, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import EditButton from '@/components/EditButton';
import { InfoSettings } from '@/lib/db';

const ICON_MAP: Record<string, any> = {
  Shield, AlertTriangle, Users, Radio, Zap, Info
};

export default function InfoClient({ info }: { info: InfoSettings }) {
  const guestRulesList = info.guestRules.split('\n').map(l => l.trim()).filter(l => l !== '');

  return (
    <main className="info-page">
      <Navbar />

      <section className="info-hero">
        <div className="hero-image-overlay" />
        <div className="tech-scan-lines" />
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="tech-badge">
              <FileText size={16} />
              <span>OPERATIONS MANUAL</span>
            </div>
            <h1 className="hero-title">
              Wichtige <span className="highlight">Informationen</span>
              <EditButton href="/admin/info" label="Infos verwalten" />
            </h1>
            <p className="hero-subtitle">Alles über Regeln, Sicherheit und den Gastflugbetrieb beim FMSC.</p>
          </motion.div>
        </div>
      </section>

      <section className="rules-section">
        <div className="container">
          <div className="rules-grid">
            {/* Core Safety - "Mission Critical" */}
            <motion.div 
              className="safety-card glass"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-header">
                <AlertTriangle size={20} className="text-yellow-500" />
                <h2 className="title-gradient">Sicherheit & Protokoll</h2>
              </div>
              <div className="rules-list">
                {info.safetyRules.length === 0 && <p style={{ opacity: 0.5 }}>Noch keine Regeln definiert.</p>}
                {info.safetyRules.map((item) => {
                  const Icon = ICON_MAP[item.icon] || Shield;
                  return (
                    <div key={item.id} className="rule-item">
                      <div className="rule-icon"><Icon size={20} /></div>
                      <div className="rule-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Guest Flyer - "Authorization" */}
            <motion.div 
              className="guest-card glass"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-header">
                <CheckCircle size={20} className="text-green-500" />
                <h2 className="title-gradient">Gastflieger</h2>
              </div>
              <p className="guest-intro">Gastflieger sind bei uns herzlich willkommen. Bitte beachtet jedoch die folgenden Autorisierungsschritte:</p>
              <ul className="auth-list">
                {guestRulesList.length === 0 && <p style={{ opacity: 0.5 }}>Keine speziellen Gastflieger-Regeln.</p>}
                {guestRulesList.map((rule, i) => (
                  <li key={i}>
                    <div className="li-dot" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              {info.guestWarning && (
                <div className="warning-box">
                  <Smartphone size={18} />
                  <span>{info.guestWarning}</span>
                </div>
              )}
            </motion.div>
          </div>

          <div className="downloads-section">
            <h3 className="section-title">Dokumentation</h3>
            {info.docs.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>Keine Dokumente verfügbar.</p>}
            <div className="docs-grid">
              {info.docs.map(doc => (
                <a key={doc.id} href={doc.url} download target="_blank" rel="noopener noreferrer" className="doc-item glass" style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
                  <FileText className="text-secondary" size={24} />
                  <div className="doc-info" style={{ flexGrow: 1 }}>
                    <p>{doc.title}</p>
                    <span>PDF | {doc.sizeInfo}</span>
                  </div>
                  <Download size={18} style={{ opacity: 0.5 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .info-page {
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
        }

        .info-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/info_modelflying_safety_rules_1774784550996.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .info-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
          .hero-title { font-size: 2.5rem !important; }
        }

        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10, 12, 16, 0.4) 0%, rgba(10, 12, 16, 0.9) 100%);
        }

        .tech-scan-lines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px);
          pointer-events: none;
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(192, 0, 0, 0.1);
          color: #f87171;
          padding: 8px 16px;
          border-radius: 99px;
          border: 1px solid rgba(192, 0, 0, 0.2);
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 2px;
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; flex-direction: column; align-items: flex-start; gap: 10px; }
        }

        .highlight { color: #567eb6; }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
        }

        .rules-section {
          padding: 6rem 0;
        }

        .rules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .rules-grid { grid-template-columns: 1fr; }
        }

        .safety-card, .guest-card {
          padding: 2.5rem;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .safety-card, .guest-card { padding: 1.5rem; border-radius: 24px; }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .title-gradient {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, white 0%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .rule-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding: 1.2rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          border: 1px solid var(--card-border);
        }

        .rule-icon { color: #567eb6; margin-top: 4px; }
        .rule-content h4 { font-weight: 800; margin-bottom: 4px; font-size: 1.1rem; }
        .rule-content p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

        .guest-intro { color: var(--text-secondary); line-height: 1.6; margin: 0; }

        .auth-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 0;
          margin: 0;
        }

        .auth-list li {
          display: flex;
          gap: 15px;
          align-items: center;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .li-dot {
          width: 8px;
          height: 8px;
          background: #567eb6;
          border-radius: 50%;
          box-shadow: 0 0 10px #567eb6;
          flex-shrink: 0;
        }

        .warning-box {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(192, 0, 0, 0.1);
          border: 1px solid rgba(192, 0, 0, 0.2);
          border-radius: 12px;
          color: #f87171;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 4rem 0 2rem;
          text-align: center;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .doc-item {
          padding: 1.2rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
        }

        .doc-item:hover { transform: translateY(-4px); border-color: #567eb6; }

        .doc-info p { font-weight: 800; font-size: 0.95rem; margin-bottom: 2px; }
        .doc-info span { font-size: 0.75rem; opacity: 0.4; font-weight: 600; }
      `}</style>
    </main>
  );
}
