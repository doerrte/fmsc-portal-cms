'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plane, Calendar, Users, Award, MapPin, Radio, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import EditButton from '@/components/EditButton';

const AboutClient = ({ about }: { about: any }) => {
  const timeline = [
    { year: '1975', event: 'Gründung des FMSC Königshoven e.V.', icon: Plane },
    { year: '1982', event: 'Erwerb und Ausbau des heutigen Fluggeländes.', icon: MapPin },
    { year: '1995', event: '20-jähriges Jubiläum mit großer Flugschau.', icon: Award },
    { year: '2015', event: 'Modernisierung der Vereinshütte und Solaranlage.', icon: Users },
    { year: 'Heute', event: 'Über 65 aktive Mitglieder und modernste Technik.', icon: Calendar },
  ];

  return (
    <main className="about-page">
      <Navbar />

      <section className="about-hero">
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
              <Shield size={16} />
              <span>GESCHICHTE & TRADITION</span>
            </div>
            <h1 className="hero-title">
              Über den <span className="highlight">Verein</span>
            </h1>
            <p className="hero-subtitle">Tradition trifft Leidenschaft – Seit 1975 in Bedburg.</p>
          </motion.div>
        </div>
      </section>

      <section className="history-section">
        <div className="container">
          <div className="history-grid">
            <motion.div 
              className="history-text glass"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-header">
                <Radio size={20} className="text-secondary" />
                <h2 className="title-gradient">
                  Unsere Geschichte
                  <EditButton href="/admin/about" label="Text bearbeiten" />
                </h2>
              </div>
              <p>{about.historyText1}</p>
              <p>{about.historyText2}</p>
              <div className="stats-row">
                <div className="stat-pill"><Zap size={14} /> Solar-Strom am Platz</div>
                <div className="stat-pill"><Users size={14} /> 65+ Mitglieder</div>
              </div>
            </motion.div>

            <div className="timeline-container glass">
              <h3 className="timeline-title">Meilensteine</h3>
              <div className="timeline-items">
                {timeline.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="timeline-item"
                  >
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-content">
                      <div className="timeline-marker">
                        <item.icon size={14} />
                      </div>
                      <p>{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            <motion.div 
              className="value-card glass"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="value-icon" size={32} />
              <h3>Gemeinschaft</h3>
              <p>Wir helfen uns gegenseitig – vom Baubeginn bis zum Erstflug.</p>
            </motion.div>
            <motion.div 
              className="value-card glass"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="value-icon" size={32} />
              <h3>Jugendförderung</h3>
              <p>Wir führen junge Generationen spielerisch an Technik und Physik heran.</p>
            </motion.div>
            <motion.div 
              className="value-card glass"
              whileHover={{ scale: 1.05 }}
            >
              <Plane className="value-icon" size={32} />
              <h3>Vielfalt</h3>
              <p>Egal ob Segler, Jet oder Heli – bei uns ist jedes Modell willkommen.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .about-page {
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .about-hero {
          position: relative; height: 60vh; min-height: 400px; display: flex; align-items: center;
          background: url('/about_modelflying_workshop_1774783590862.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .about-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
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

        .history-section {
          padding: 6rem 0;
        }

        .history-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .history-grid { grid-template-columns: 1fr; }
        }

        .history-text {
          padding: 3rem;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .history-text { padding: 1.5rem; border-radius: 24px; }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 0.5rem;
        }

        .title-gradient {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, white 0%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .history-text p {
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .stats-row {
          display: flex;
          gap: 10px;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .stat-pill {
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #567eb6;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(86, 126, 182, 0.2);
        }

        .timeline-container {
          padding: 2.5rem;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .timeline-container { padding: 1.5rem; border-radius: 24px; }
        }

        .timeline-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--foreground);
          text-align: center;
        }

        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .timeline-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .timeline-year {
          min-width: 60px;
          font-weight: 900;
          font-size: 1.1rem;
          color: #567eb6;
          padding-top: 4px;
        }

        .timeline-content {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          flex: 1;
        }

        .timeline-marker {
          width: 28px;
          height: 28px;
          background: rgba(192, 0, 0, 0.1);
          border: 1px solid rgba(192, 0, 0, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f87171;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .timeline-content p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .values-section {
          padding-bottom: 6rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .value-card {
          padding: 2.5rem;
          border-radius: 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }

        .value-icon { color: #567eb6; }

        .value-card h3 { font-size: 1.5rem; font-weight: 800; }
        .value-card p { color: var(--text-secondary); line-height: 1.6; }
      `}</style>
    </main>
  );
};

export default AboutClient;
