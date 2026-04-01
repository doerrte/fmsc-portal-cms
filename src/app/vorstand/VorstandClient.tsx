'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users, Shield, Award, Mail, UserCheck, Briefcase, Zap, Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import EditButton from '@/components/EditButton';

const VorstandClient = ({ vorstand }: { vorstand: any[] }) => {
  const president = vorstand.find(v => v.role.toLowerCase().includes('sident'));
  const mainVorstand = vorstand.filter(v => v.type === 'main' && v !== president);
  const extendedVorstand = vorstand.filter(v => v.type === 'extended' && v !== president);

  return (
    <main className="vorstand-page">
      <Navbar />

      <section className="vorstand-hero">
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
              <Users size={16} />
              <span>VORSTANDS-BEREICH</span>
            </div>
            <h1 className="hero-title">
              Unser <span className="highlight">Vorstand</span>
              <EditButton href="/admin/vorstand" label="Vorstand verwalten" />
            </h1>
            <p className="hero-subtitle">Hinter jedem erfolgreichen Flugtag steht ein engagiertes Team von Experten.</p>
          </motion.div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2 className="title-gradient">Geschäftsführender Vorstand</h2>
          </div>

          {president && (
            <div className="president-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="member-card glass"
                style={{ width: '100%', maxWidth: '400px', border: '2px solid #567eb6', boxShadow: '0 15px 30px rgba(86, 126, 182, 0.15)' }}
              >
                <div className="card-top">
                  <div className="member-avatar" style={{ background: '#567eb6' }}>
                    <Award size={32} style={{ color: 'white' }} />
                  </div>
                  <div className="member-info">
                    <span className="member-role">{president.role}</span>
                    <h3 className="member-name">{president.name}</h3>
                  </div>
                </div>
                <p className="member-desc">{president.desc}</p>
                <div className="card-footer" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                  <button className="contact-small"><Mail size={14} /> Nachricht</button>
                </div>
              </motion.div>
            </div>
          )}

          <div className="main-team-grid">
            {mainVorstand.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="member-card glass"
              >
                <div className="card-top">
                  <div className="member-avatar">
                    <UserCheck size={32} className="text-secondary" />
                  </div>
                  <div className="member-info">
                    <span className="member-role">{member.role}</span>
                    <h3 className="member-name">{member.name}</h3>
                  </div>
                </div>
                <p className="member-desc">{member.desc}</p>
                <div className="card-footer">
                  <button className="contact-small"><Mail size={14} /> Nachricht</button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="section-header mt-12">
            <h2 className="title-gradient">Erweiterter Vorstand</h2>
          </div>

          <div className="extended-team-grid">
            {extendedVorstand.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="extended-card glass"
              >
                <div className="ext-icon"><Award size={20} /></div>
                <div className="ext-info">
                  <span className="ext-role">{member.role}</span>
                  <p className="ext-name">{member.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .vorstand-page {
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
        }

        .vorstand-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/about_modelflying_workshop_1774783590862.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .vorstand-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
          .hero-title { font-size: 2.5rem !important; }
        }

        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, var(--hero-gradient-mid) 0%, var(--hero-gradient-start) 100%);
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

        .team-section {
          padding: 6rem 0;
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .title-gradient {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--foreground) 0%, var(--text-tertiary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .member-card {
          padding: 2rem;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: transform 0.3s;
        }

        .member-card:hover { transform: translateY(-10px); }

        .card-top {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .member-avatar {
          width: 64px;
          height: 64px;
          background: rgba(86, 126, 182, 0.1);
          border: 1px solid rgba(86, 126, 182, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .member-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .member-role {
          font-size: 0.7rem;
          font-weight: 800;
          color: #567eb6;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .member-name {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .member-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          gap: 10px;
        }

        .contact-small {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--card-border);
          transition: all 0.2s;
        }

        .contact-small:hover { background: rgba(86, 126, 182, 0.1); border-color: #567eb6; color: #567eb6; }

        .extended-team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .extended-card {
          padding: 1.2rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .ext-icon {
          width: 40px;
          height: 40px;
          background: rgba(192, 0, 0, 0.1);
          border: 1px solid rgba(192, 0, 0, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f87171;
        }

        .ext-info {
          display: flex;
          flex-direction: column;
        }

        .ext-role { font-size: 0.65rem; font-weight: 800; color: rgba(255, 255, 255, 0.4); letter-spacing: 1px; }
        .ext-name { font-weight: 700; font-size: 0.95rem; }

        .mt-12 { margin-top: 4rem; }
      `}</style>
    </main>
  );
};

export default VorstandClient;
