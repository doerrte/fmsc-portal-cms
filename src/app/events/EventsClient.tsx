'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, MapPin, Clock, Info, CheckCircle, AlertTriangle, Radio, Navigation, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import EditButton from '@/components/EditButton';

const EventsClient = ({ events }: { events: any[] }) => {

  return (
    <main className="events-page">
      <Navbar />

      <section className="events-hero">
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
              <Navigation size={16} />
              <span>FLUGPLAN 2026</span>
            </div>
            <h1 className="hero-title">
              Termine & <span className="highlight">Events</span>
              <EditButton href="/admin/events" label="Termine verwalten" />
            </h1>
            <p className="hero-subtitle">Bleibe auf dem Laufenden über alle Wettbewerbe, Flugtage und Versammlungen.</p>
          </motion.div>
        </div>
      </section>

      <section className="events-section">
        <div className="container">
          <div className="events-header">
            <h2 className="title-gradient">Kommende Missionen</h2>
            <div className="status-legend">
              <div className="status-pill active"><Radio size={12} className="animate-pulse" /> AKTIV</div>
            </div>
          </div>

          <div className="events-grid">
            {events.map((event, index) => (
              <motion.article 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="event-card glass"
              >
                <div className="card-indicator" style={{ background: event.category === 'Arbeitsdienst' ? '#c00000' : '#567eb6' }} />
                
                <div className="card-main">
                  <div className="event-meta">
                    <span className="category-tag">{event.category}</span>
                    <span className="date-tag"><Calendar size={14} /> {event.date}</span>
                  </div>
                  
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-desc">{event.description}</p>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <Clock size={16} className="text-secondary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} className="text-secondary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="card-action">
                  <button className="btn-details">
                    DETAILS <ArrowRight size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div 
            className="info-notice glass"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <AlertTriangle className="text-yellow-500" size={24} />
            <div className="notice-content">
              <h4>Wettervorbehalt</h4>
              <p>
                Modellflug ist Outdoor-Sport. Bei widrigen Bedingungen (Sturm/Dauerregen) können kurzfristige Absagen erfolgen. 
                Prüfe bitte am Einsatztag das **Live-Wetter** auf unserem Dashboard.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .events-page {
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
        }

        .events-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/events_modelflying_competition_sunset_1774783698975.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .events-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
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

        .events-section {
          padding: 6rem 0;
        }

        .events-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        @media (max-width: 768px) {
          .events-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        }

        .title-gradient {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--foreground) 0%, var(--text-tertiary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .status-legend {
          display: flex;
          gap: 8px;
        }

        .status-pill {
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .events-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .event-card {
          border-radius: 20px;
          display: grid;
          grid-template-columns: 8px 1fr auto;
          overflow: hidden;
          transition: transform 0.2s;
        }

        .event-card:hover {
          transform: scale(1.02);
          border-color: #567eb6;
        }

        @media (max-width: 768px) {
          .event-card { grid-template-columns: 1fr; }
          .card-indicator { height: 8px; width: 100% !important; }
        }

        .card-indicator {
          width: 8px;
          height: 100%;
        }

        .card-main {
          padding: 2rem;
        }

        .event-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 1rem;
        }

        .category-tag {
          font-size: 0.7rem;
          font-weight: 900;
          color: #567eb6;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .date-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .event-title {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
        }

        .event-desc {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.5rem;
          max-width: 800px;
        }

        .event-details {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .card-action {
          padding: 2rem;
          display: flex;
          align-items: center;
          border-left: 1px solid var(--card-border);
        }

        @media (max-width: 768px) {
          .card-action { border-left: none; border-top: 1px solid var(--card-border); padding: 1rem 2rem; }
        }

        .btn-details {
          color: #567eb6;
          font-weight: 900;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: gap 0.2s;
        }

        .btn-details:hover { gap: 15px; }

        .info-notice {
          margin-top: 4rem;
          padding: 2rem;
          border-radius: 24px;
          border-color: rgba(245, 158, 11, 0.2);
          display: flex;
          gap: 1.5rem;
          align-items: center;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%);
        }

        @media (max-width: 768px) { .info-notice { flex-direction: column; text-align: center; } }

        .notice-content h4 { font-weight: 800; margin-bottom: 0.5rem; color: #f59e0b; }
        .notice-content p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }
      `}</style>
    </main>
  );
};

export default EventsClient;
