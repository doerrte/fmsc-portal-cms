'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Info, Scale, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImpressumPage() {
  return (
    <main className="legal-page">
      <Navbar />
      
      <section className="legal-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <div className="tech-badge">
              <Scale size={14} />
              <span>LEGAL TERMINAL</span>
            </div>
            <h1>Impressum</h1>
            <p>Anbieterkennzeichnung gemäß § 5 TMG.</p>
          </motion.div>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container">
          <div className="legal-grid">
            <div className="legal-card glass">
              <div className="card-section">
                <div className="section-header">
                  <Info className="text-primary" size={20} />
                  <h3>Angaben gemäß § 5 TMG</h3>
                </div>
                <div className="section-body">
                  <p><strong>FMSC Königshoven 1975 e.V.</strong></p>
                  <p>Mannersdorfer Allee</p>
                  <p>50181 Bedburg</p>
                  <p>Deutschland</p>
                </div>
              </div>

              <div className="card-section">
                <div className="section-header">
                  <Shield className="text-primary" size={20} />
                  <h3>Vertreten durch den Vorstand</h3>
                </div>
                <div className="section-body">
                  <p>1. Vorsitzender: [NAME EINSETZEN]</p>
                  <p>2. Vorsitzender: [NAME EINSETZEN]</p>
                  <p>Kassenwart: [NAME EINSETZEN]</p>
                </div>
              </div>

              <div className="card-section">
                <div className="section-header">
                  <Mail className="text-primary" size={20} />
                  <h3>Kontakt</h3>
                </div>
                <div className="section-body">
                  <p>E-Mail: info@fmsc-koenigshoven.de</p>
                  <p>Internet: www.fmsc-koenigshoven.de</p>
                </div>
              </div>

              <div className="card-section">
                <div className="section-header">
                  <MapPin className="text-primary" size={20} />
                  <h3>Registereintrag</h3>
                </div>
                <div className="section-body">
                  <p>Eintragung im Vereinsregister.</p>
                  <p>Registergericht: Amtsgericht Köln</p>
                  <p>Registernummer: VR [NUMMER EINSETZEN]</p>
                </div>
              </div>
            </div>

            <div className="legal-info-aside glass">
              <h3>Haftungsausschluss</h3>
              <div className="info-block">
                <h4>Haftung für Inhalte</h4>
                <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
              </div>
              <div className="info-block">
                <h4>Haftung für Links</h4>
                <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>
              </div>
              <div className="info-block">
                <h4>Urheberrecht</h4>
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .legal-page {
          background: var(--background);
          min-height: 100vh;
        }

        .legal-hero {
          padding: 8rem 0 4rem;
          background: linear-gradient(to bottom, rgba(192, 0, 0, 0.05) 0%, transparent 100%);
          text-align: center;
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(192, 0, 0, 0.1);
          color: var(--primary);
          padding: 6px 14px;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(192, 0, 0, 0.2);
        }

        h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }

        .legal-hero p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .legal-content-section {
          padding-bottom: 8rem;
        }

        .legal-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .legal-grid { grid-template-columns: 1fr; }
        }

        .legal-card {
          padding: 3rem;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .card-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .section-body p {
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .legal-info-aside {
          padding: 2.5rem;
          border-radius: 40px;
        }

        .legal-info-aside h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: var(--primary);
        }

        .info-block {
          margin-bottom: 2rem;
        }

        .info-block h4 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }

        .info-block p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }
      `}</style>
    </main>
  );
}
