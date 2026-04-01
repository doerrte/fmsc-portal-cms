'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Cpu, CheckCircle, Clock, ArrowRight, Gauge, Layers as LayersIcon, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import EditButton from '@/components/EditButton';

const BauberichteClient = ({ items }: { items: any[] }) => {
  return (
    <main className="reports-page">
      <Navbar />

      <section className="reports-hero">
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
              <Cpu size={16} />
              <span>PROJEKT-LOGBÜCHER</span>
            </div>
            <h1 className="hero-title">
              Projekt <span className="highlight">Logbücher</span>
              <EditButton href="/admin/bauberichte" label="Bauberichte verwalten" />
            </h1>
            <p className="hero-subtitle">Baufortschritte, technische Innovationen und detaillierte Engineering-Berichte.</p>
          </motion.div>
        </div>
      </section>

      <section className="reports-section">
        <div className="container">
          <div className="reports-grid">
            {items.map((report, index) => (
              <motion.article 
                key={report.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="report-card glass"
              >
                <div className="report-header">
                  <div className="report-icon"><LayersIcon size={24} /></div>
                  <div className="header-text">
                    <span className="report-date">{report.date}</span>
                    <h2 className="report-title">{report.title}</h2>
                  </div>
                  <div className={`status-tag ${report.status.toLowerCase().replace(/ /g, '-')}`}>
                    {report.status}
                  </div>
                </div>

                <div className="report-body">
                  <p className="report-desc">{report.desc}</p>
                  
                  <div className="tech-specs">
                    <div className="spec">
                      <label>PILOT</label>
                      <span>{report.pilot}</span>
                    </div>
                    <div className="spec">
                      <label>TECHNOLOGIE</label>
                      <span>{report.tech}</span>
                    </div>
                  </div>

                  <div className="progress-container">
                    <div className="progress-info">
                      <span>FORTSCHRITT</span>
                      <span>{report.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${report.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="progress-fill"
                      />
                    </div>
                  </div>
                </div>

                <div className="report-footer">
                  <button className="btn-read-more">
                    VOLLSTÄNDIGES LOGBUCH <ArrowRight size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
            {items.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                <p>Noch keine Projekte eingetragen. Klicke auf "Bauberichte verwalten", um welche hinzuzufügen.</p>
              </div>
            )}
          </div>

          <div className="submit-cta glass">
            <div className="cta-icon"><FileText size={40} className="text-secondary" /></div>
            <div className="cta-content">
              <h3>Eigenes Projekt teilen?</h3>
              <p>Hast du ein spannendes Bauprojekt? Sende uns deinen Bericht für das Logbuch!</p>
            </div>
            <button className="btn-submit">BERICHT EINREICHEN</button>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .reports-page { background: #0a0c10; color: white; min-height: 100vh; }

        .reports-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/bauberichte_modelflying_engineering_1774785384794.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .reports-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
          .hero-title { font-size: 2.5rem !important; }
        }

        .hero-image-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10, 12, 16, 0.4) 0%, rgba(10, 12, 16, 0.9) 100%); }

        .tech-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(86, 126, 182, 0.1); color: #567eb6; padding: 8px 16px; border-radius: 99px; border: 1px solid rgba(86, 126, 182, 0.2); font-weight: 800; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 2rem; }
        .hero-title { font-size: 4rem; font-weight: 900; margin-bottom: 1rem; line-height: 1; }
        .highlight { color: #567eb6; }
        .hero-subtitle { font-size: 1.25rem; color: rgba(255, 255, 255, 0.6); max-width: 600px; }

        .reports-section { padding: 6rem 0; }

        .reports-grid { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 4rem; }

        .report-card { border-radius: 32px; padding: 2.5rem; transition: transform 0.3s; }
        .report-card:hover { transform: scale(1.01); border-color: #567eb6; }

        .report-header { display: flex; align-items: center; gap: 20px; margin-bottom: 2rem; position: relative; }
        .report-icon { width: 48px; height: 48px; background: rgba(86, 126, 182, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #567eb6; border: 1px solid rgba(86, 126, 182, 0.2); }
        .header-text { flex-grow: 1; }
        .report-date { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .report-title { font-size: 1.8rem; font-weight: 800; margin-top: 4px; }

        .status-tag { 
          padding: 6px 14px; border-radius: 99px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; 
          background: rgba(86, 126, 182, 0.1); color: #567eb6; border: 1px solid rgba(86, 126, 182, 0.2);
        }
        .status-tag.completed, .status-tag.maiden-flight-done { background: rgba(34, 197, 94, 0.1); color: #4ade80; border-color: rgba(34, 197, 94, 0.2); }
        .status-tag.in-progress { background: rgba(192, 0, 0, 0.1); color: #f87171; border-color: rgba(192, 0, 0, 0.2); }

        .report-body { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; margin-bottom: 2rem; }
        @media (max-width: 768px) { .report-body { grid-template-columns: 1fr; gap: 1.5rem; } }

        .report-desc { color: rgba(255, 255, 255, 0.7); line-height: 1.7; font-size: 1.05rem; }

        .tech-specs { display: flex; flex-direction: column; gap: 15px; }
        .spec label { display: block; font-size: 0.65rem; font-weight: 800; color: #567eb6; letter-spacing: 1px; margin-bottom: 4px; }
        .spec span { font-weight: 700; color: rgba(255, 255, 255, 0.9); }

        .progress-container { margin-top: 2rem; }
        .progress-info { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; color: #567eb6; margin-bottom: 8px; }
        .progress-bar { height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(to right, #567eb6, #4ade80); border-radius: 4px; }

        .report-footer { padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
        .btn-read-more { color: #567eb6; font-weight: 900; font-size: 0.85rem; display: flex; align-items: center; gap: 10px; transition: gap 0.2s; }
        .btn-read-more:hover { gap: 15px; }

        .submit-cta { 
          padding: 3rem; border-radius: 40px; display: flex; align-items: center; gap: 2.5rem; 
          background: linear-gradient(135deg, rgba(86, 126, 182, 0.1) 0%, transparent 100%);
        }
        @media (max-width: 768px) { .submit-cta { flex-direction: column; text-align: center; padding: 2rem; } }
        .cta-content { flex-grow: 1; }
        .cta-content h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
        .cta-content p { color: rgba(255, 255, 255, 0.6); }
        .btn-submit { 
          padding: 14px 28px; background: white; color: black; border-radius: 12px; font-weight: 800; 
          transition: all 0.2s; 
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1); }
      `}</style>
    </main>
  );
};

export default BauberichteClient;
