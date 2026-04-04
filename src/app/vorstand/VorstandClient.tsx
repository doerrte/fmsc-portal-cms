'use client';

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = (name || '').trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

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
            <div className="president-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '5rem' }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                className="member-card president-card glass"
              >
                <div className="president-crown"><Award size={32} /></div>
                <div className="card-top president-top">
                  <div className="member-avatar premium-avatar">
                    <span className="monogram" style={{ color: 'white' }}>{getInitials(president.name)}</span>
                  </div>
                  <div className="member-info president-info">
                    <span className="member-role premium-role">{president.role}</span>
                    <h3 className="member-name president-name">{president.name}</h3>
                  </div>
                </div>
                <p className="member-desc president-desc">{president.desc}</p>
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
                className="member-card regular-card glass"
              >
                <div className="card-top">
                  <div className="member-avatar">
                    <span className="monogram">{getInitials(member.name)}</span>
                  </div>
                  <div className="member-info">
                    <span className="member-role active-role">{member.role}</span>
                    <h3 className="member-name">{member.name}</h3>
                  </div>
                </div>
                <p className="member-desc">{member.desc}</p>
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
                <div className="card-top" style={{ flexDirection: 'column', textAlign: 'center', gap: '12px' }}>
                  <div className="member-avatar" style={{ width: '56px', height: '56px' }}>
                    <span className="monogram" style={{ fontSize: '1.2rem' }}>{getInitials(member.name)}</span>
                  </div>
                  <div className="member-info" style={{ alignItems: 'center' }}>
                    <span className="member-role active-role" style={{ fontSize: '0.65rem' }}>{member.role}</span>
                    <h3 className="member-name" style={{ fontSize: '1.15rem' }}>{member.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
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
          position: relative;
          padding: 2.5rem;
          border-radius: 40px !important;
          background: var(--card-bg);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          backdrop-filter: blur(25px);
          overflow: hidden;
          border: none !important;
        }

        .member-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.05);
        }

        .president-card {
          width: 100%;
          max-width: 450px;
          text-align: center;
          align-items: center;
          background: linear-gradient(135deg, var(--card-bg) 0%, rgba(86, 126, 182, 0.05) 100%) !important;
          box-shadow: 0 20px 50px rgba(86, 126, 182, 0.15) !important;
        }

        .president-crown {
          color: #567eb6;
          margin-bottom: -10px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }

        .card-top {
          display: flex;
          gap: 20px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .member-avatar {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, rgba(86, 126, 182, 0.15) 0%, rgba(86, 126, 182, 0.05) 100%);
          border: 1px solid rgba(86, 126, 182, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 10px rgba(255, 255, 255, 0.1);
        }

        .monogram {
          font-size: 1.6rem;
          font-weight: 900;
          color: #567eb6;
          letter-spacing: -1px;
        }

        .premium-avatar {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #567eb6 0%, #3b5a83 100%);
          box-shadow: 0 10px 20px rgba(86, 126, 182, 0.3);
          border: 2px solid rgba(255,255,255,0.2);
        }

        .member-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .active-role {
          display: inline-block;
          background: rgba(86, 126, 182, 0.1);
          color: #567eb6;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 1px solid rgba(86, 126, 182, 0.2);
          width: fit-content;
        }

        .premium-role {
          display: inline-block;
          background: linear-gradient(135deg, #c00000 0%, #990000 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 4px 10px rgba(192, 0, 0, 0.3);
          margin-top: 10px;
        }

        .member-name {
          font-size: 1.35rem;
          font-weight: 800;
        }
        
        .president-name {
          font-size: 2rem;
          margin-top: 5px;
        }

        .member-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }

        .extended-team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          justify-content: center;
        }

        .extended-card {
          padding: 1.5rem;
          border-radius: 40px !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
          border: none !important;
          background: var(--card-bg);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .extended-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }

        .mt-12 { margin-top: 4rem; }
      `}</style>
    </main>
  );
};

export default VorstandClient;
