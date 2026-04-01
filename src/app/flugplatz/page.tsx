'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Navigation, Wind, Activity, Cpu, Shield, Ruler, Weight } from 'lucide-react';
import { motion } from 'framer-motion';

const FlugplatzPage = () => {
  const specs = [
    { label: 'GRÖSSE', value: '100m x 100m', icon: Ruler, detail: 'Gepflegte Grasnarbe' },
    { label: 'ZULASSUNG', value: 'bis 25 KG', icon: Weight, detail: 'Modelle aller Art' },
    { label: 'KOORDINATEN', value: '51.0218° N, 6.5547° E', icon: Navigation, detail: 'Bedburg-Königshoven' },
  ];

  const infrastructure = [
    { title: 'Vorbereitungstische', desc: 'Spezialisierte Montagetische für Jet- und Großmodelle.', icon: Cpu },
    { title: 'Schutznetze', desc: 'Hohe Sicherheitszäune zum Schutz des Zuschauerbereichs.', icon: Shield },
    { title: 'Wetterstation', desc: 'Echtzeit-Wind- und Telemetriedaten direkt am Platz.', icon: Wind },
  ];

  return (
    <main className="flugplatz-page">
      <Navbar />

      <section className="sector-hero">
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
              <MapPin size={16} />
              <span>SEKTOR KOORDINATEN</span>
            </div>
            <h1 className="hero-title">
              Unser <span className="highlight">Flugplatz</span>
            </h1>
            <p className="hero-subtitle">High-Tech Infrastruktur auf der Kasterer Höhe in Bedburg.</p>
          </motion.div>
        </div>
      </section>

      <section className="infra-stats">
        <div className="container">
          <div className="stats-grid">
            {specs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="stat-card glass"
              >
                <div className="stat-icon"><spec.icon size={24} /></div>
                <div className="stat-info">
                  <label>{spec.label}</label>
                  <p className="stat-value">{spec.value}</p>
                  <span className="stat-detail">{spec.detail}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="ground-infra-section">
        <div className="container">
          <div className="infra-grid">
            {/* Visual Overview Card */}
            <motion.div
              className="visual-card glass"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-header">
                <Shield size={20} className="text-secondary" />
                <h2 className="title-gradient">Unser Flugplatz</h2>
              </div>
              <div className="visual-media">
                <img
                  src="/hero_modelflying_jet_cinematic_1774782875980.png"
                  alt="Flugplatz Übersicht"
                  className="infra-img"
                />
                <div className="media-overlay">
                  <div className="coordinate-line">LAT: 51.021827</div>
                  <div className="coordinate-line">LON: 6.554718</div>
                </div>
              </div>
              <p className="infra-text">
                Unser Fluggelände wurde über Jahrzehnte hinweg zu einer der modernsten Modellflug-Anlagen
                der Region ausgebaut. Die 100 Meter lange Startbahn ist perfekt für Jets und Großsegler geeignet.
              </p>
            </motion.div>

            {/* List of Features */}
            <div className="features-list">
              {infrastructure.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-item glass"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="feature-icon"><feature.icon size={24} /></div>
                  <div className="feature-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .flugplatz-page {
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
        }

        .sector-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/hero_modelflying_jet_cinematic_1774782875980.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .sector-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
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
          background: rgba(86, 126, 182, 0.1);
          color: #567eb6;
          padding: 8px 16px;
          border-radius: 99px;
          border: 1px solid rgba(86, 126, 182, 0.2);
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
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }

        .highlight { color: #567eb6; }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
        }

        .infra-stats {
          padding: 4rem 0;
          margin-top: -4rem;
          position: relative;
          z-index: 20;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 2rem;
          border-radius: 24px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          transition: transform 0.3s;
        }

        .stat-card:hover { transform: translateY(-5px); border-color: #567eb6; }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: rgba(86, 126, 182, 0.1);
          border: 1px solid rgba(86, 126, 182, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #567eb6;
        }

        .stat-info label {
          display: block;
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .stat-value { font-size: 1.1rem; font-weight: 900; color: var(--foreground); margin-bottom: 2px; }
        .stat-detail { font-size: 0.75rem; color: #567eb6; font-weight: 700; opacity: 0.8; }

        .ground-infra-section {
          padding-bottom: 6rem;
        }

        .infra-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .infra-grid { grid-template-columns: 1fr; }
        }

        .visual-card {
          padding: 2.5rem;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        @media (max-width: 768px) {
          .visual-card { padding: 1.5rem; border-radius: 24px; }
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

        .visual-media {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--card-border);
          height: 350px;
        }

        .infra-img { width: 100%; height: 100%; object-fit: cover; }

        .media-overlay {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: var(--glass-bg);
          padding: 10px 15px;
          border-radius: 10px;
          font-family: monospace;
          color: #567eb6;
          font-size: 0.7rem;
          line-height: 1.4;
          border: 1px solid rgba(86, 126, 182, 0.3);
        }

        .infra-text {
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature-item {
          padding: 1.5rem;
          border-radius: 24px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #567eb6;
          border: 1px solid var(--card-border);
          flex-shrink: 0;
        }

        .feature-text h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; }
        .feature-text p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

        .drone-ready-badge {
          padding: 1.5rem;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(135deg, rgba(86, 126, 182, 0.1) 0%, transparent 100%);
          border-color: rgba(86, 126, 182, 0.2);
        }

        .badge-text { display: flex; flex-direction: column; }
        .badge-text strong { color: #567eb6; font-size: 1rem; }
        .badge-text span { font-size: 0.75rem; opacity: 0.6; }
      `}</style>
    </main>
  );
};

export default FlugplatzPage;
