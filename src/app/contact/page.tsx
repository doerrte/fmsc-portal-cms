'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Shield, Radio, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <main className="contact-page">
      <Navbar />

      <section className="contact-hero">
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
              <Radio size={16} />
              <span>SIGNAL CENTER</span>
            </div>
            <h1 className="hero-title">
              Kontakt & <span className="highlight">Anfrage</span>
            </h1>
            <p className="hero-subtitle">Sende uns eine Nachricht oder besuche uns am Flugplatz in Bedburg.</p>
          </motion.div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form - "The Data Terminal" */}
            <motion.div 
              className="contact-form-container glass"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="card-header">
                <MessageSquare size={20} className="text-secondary" />
                <h2 className="title-gradient">Übertragung Senden</h2>
              </div>
              
              <form className="tech-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>RUFZEICHEN / NAME</label>
                    <input type="text" placeholder="Pilot Name" className="tech-input" />
                  </div>
                  <div className="form-group">
                    <label>FREQUENZ / E-MAIL</label>
                    <input type="email" placeholder="email@beispiel.de" className="tech-input" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>BETREFF</label>
                  <select className="tech-select">
                    <option>Gastflug-Anfrage</option>
                    <option>Mitgliedschaft</option>
                    <option>Technik & Support</option>
                    <option>Allgemeine Info</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>NACHRICHT</label>
                  <textarea placeholder="Deine Nachricht an uns..." rows={5} className="tech-textarea"></textarea>
                </div>

                <button type="submit" className="btn-send">
                  SIGNAL SENDEN <Send size={18} />
                </button>
              </form>
            </motion.div>

            {/* Contact Info - "The Station Info" */}
            <div className="contact-info-aside">
              <motion.div 
                className="info-card glass"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="info-item">
                  <div className="info-icon"><MapPin size={24} /></div>
                  <div className="info-text">
                    <label>GPS STANDORT</label>
                    <p>FMSC Königshoven e.V.</p>
                    <p>Mannersdorfer Allee</p>
                    <p>50181 Bedburg, DE</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><Mail size={24} /></div>
                  <div className="info-text">
                    <label>E-MAIL ADRESSE</label>
                    <p>info@fmsc-koenigshoven.de</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><Shield size={24} /></div>
                  <div className="info-text">
                    <label>SICHERHEIT</label>
                    <p>Versicherungspflicht für alle Piloten.</p>
                  </div>
                </div>

                <div className="map-preview">
                  <div className="coordinate-overlay">51.0218° N, 6.5547° E</div>
                  <img 
                    src="https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/6.5547,51.0218,15,0/800x400?access_token=YOUR_MAPBOX_TOKEN_HERE" 
                    alt="Map" 
                    className="map-img" 
                  />
                </div>
              </motion.div>

              <div className="guest-flyer-cta glass">
                <div className="cta-content">
                  <h3>Gastflieger Willkommen</h3>
                  <p>Interesse an einem Gastflug? Wir freuen uns auf dich!</p>
                </div>
                <ArrowRight size={24} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .contact-page {
          background: var(--background);
          color: white;
          min-height: 100vh;
        }

        .contact-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/contact_modelflying_tech_field_1774783640888.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .contact-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
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
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }

        .highlight { color: #567eb6; }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
        }

        .contact-section {
          padding: 6rem 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        .contact-form-container {
          padding: 3rem;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .contact-form-container { padding: 1.5rem; border-radius: 24px; }
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

        .tech-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.7rem;
          font-weight: 800;
          color: #567eb6;
          letter-spacing: 1px;
        }

        .tech-input, .tech-select, .tech-textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 18px;
          border-radius: 12px;
          color: white;
          font-family: inherit;
          transition: all 0.2s;
        }

        .tech-input:focus, .tech-select:focus, .tech-textarea:focus {
          border-color: #567eb6;
          background: rgba(255, 255, 255, 0.05);
          outline: none;
          box-shadow: 0 0 15px rgba(86, 126, 182, 0.2);
        }

        .btn-send {
          background: #c00000;
          color: white;
          padding: 18px;
          border-radius: 16px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 1rem;
          transition: all 0.3s;
        }

        .btn-send:hover {
          background: #e60000;
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(192, 0, 0, 0.3);
        }

        .contact-info-aside {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-card {
          padding: 2.5rem;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .info-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #567eb6;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-text label {
          display: block;
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .info-text p { font-weight: 600; opacity: 0.9; }

        .map-preview {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          margin-top: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .coordinate-overlay {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.8);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.65rem;
          font-family: monospace;
          color: #4ade80;
        }

        .map-img { width: 100%; height: 200px; object-fit: cover; filter: grayscale(1) invert(1); }

        .guest-flyer-cta {
          padding: 2rem;
          border-radius: 24px;
          border-color: rgba(34, 197, 94, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%);
          cursor: pointer;
        }

        .guest-flyer-cta h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; }
        .guest-flyer-cta p { font-size: 0.85rem; opacity: 0.6; }
      `}</style>
    </main>
  );
};

export default ContactPage;
