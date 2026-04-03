'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Globe, MessageSquare, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DatenschutzPage() {
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
              <Shield size={14} />
              <span>PRIVACY PROTOCOL</span>
            </div>
            <h1>Datenschutzerklärung</h1>
            <p>Informationen über die Verarbeitung Ihrer personenbezogenen Daten.</p>
          </motion.div>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container">
          <div className="legal-grid">
            <div className="legal-card glass">
              <div className="card-section">
                <div className="section-header">
                  <Lock className="text-secondary" size={20} />
                  <h3>1. Datenschutz auf einen Blick</h3>
                </div>
                <div className="section-body">
                  <h4>Allgemeine Hinweise</h4>
                  <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
                  <h4>Datenerfassung auf dieser Website</h4>
                  <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
                </div>
              </div>

              <div className="card-section">
                <div className="section-header">
                  <Globe className="text-secondary" size={20} />
                  <h3>2. Hosting & Drittanbieter</h3>
                </div>
                <div className="section-body">
                  <h4>Vercel</h4>
                  <p>Wir hosten unsere Website bei Vercel Inc. Anbieter ist die Vercel Inc., 440 N Barranca Ave #4133 Covina, CA 91723, USA. Vercel ist eine Plattform zum Deployment von Webseiten.</p>
                  <h4>Supabase (Datenbank)</h4>
                  <p>Zur Speicherung unserer Inhalte und Benutzerdaten nutzen wir Supabase (Supabase Inc.). Die Daten werden auf Servern in der EU gespeichert, soweit dies technisch möglich ist.</p>
                </div>
              </div>

              <div className="card-section">
                <div className="section-header">
                  <Eye className="text-secondary" size={20} />
                  <h3>3. Sicherheit (reCAPTCHA)</h3>
                </div>
                <div className="section-body">
                  <p>Um unsere Kontaktformulare vor Missbrauch und Spam zu schützen, nutzen wir den Dienst reCAPTCHA des Unternehmens Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland). Hierbei wird geprüft, ob die Dateneingabe durch einen Menschen oder durch ein automatisiertes Programm erfolgt.</p>
                </div>
              </div>

              <div className="card-section">
                <div className="section-header">
                  <Bell className="text-secondary" size={20} />
                  <h3>4. Push-Benachrichtigungen</h3>
                </div>
                <div className="section-body">
                  <p>Sofern Sie Ihre ausdrückliche Einwilligung erteilen, nutzen wir den Web-Push-Dienst Ihres Browsers, um Ihnen aktuelle Vereinsnachrichten zuzusenden. Hierfür wird ein anonymisierter Identifikations-Token generiert. Wir verarbeiten keine weiteren personenbezogenen Daten für diesen Dienst.</p>
                </div>
              </div>
            </div>

            <div className="legal-info-aside glass">
              <h3>Ihre Rechte</h3>
              <div className="info-block">
                <h4>Auskunft, Löschung, Sperrung</h4>
                <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung.</p>
              </div>
              <div className="info-block">
                <h4>Widerruf Ihrer Einwilligung</h4>
                <p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns.</p>
              </div>
              <div className="info-block">
                <h4>Beschwerderecht</h4>
                <p>Im Falle von datenschutzrechtlichen Verstößen steht dem Betroffenen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</p>
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
          background: linear-gradient(to bottom, rgba(86, 126, 182, 0.05) 0%, transparent 100%);
          text-align: center;
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(86, 126, 182, 0.1);
          color: #567eb6;
          padding: 6px 14px;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(86, 126, 182, 0.2);
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

        .section-body h4 {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          color: var(--foreground);
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
          color: #567eb6;
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
