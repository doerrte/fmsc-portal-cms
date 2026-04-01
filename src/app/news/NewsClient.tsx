'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight, Share2, MessageSquare, Radio, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EditButton from '@/components/EditButton';

const NewsClient = ({ news }: { news: any[] }) => {
  return (
    <main className="news-page">
      <Navbar />
      
      {/* Dynamic News Hero */}
      <section className="news-hero">
        <div className="hero-image-overlay" />
        <div className="tech-scan-lines" />
        <div className="container relative z-10">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="transmission-badge">
              <Radio size={16} className="animate-pulse" />
              <span>AKTUELLE MELDUNGEN</span>
            </div>
            <h1 className="hero-title">
              News-<span className="highlight">Terminal</span>
              <EditButton href="/admin/news" label="News verwalten" />
            </h1>
            <p className="hero-subtitle">
              Aktuelle Meldungen, technische Updates und Berichte vom FMSC Königshoven.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Feed Grid */}
      <section className="news-feed">
        <div className="container">
          <div className="feed-header">
            <h2 className="title-gradient">Letzte Updates</h2>
            <div className="filter-chips">
              <span className="chip active">Alle</span>
              <span className="chip">Events</span>
              <span className="chip">Technik</span>
              <span className="chip">Platz</span>
            </div>
          </div>

          <div className="news-grid">
            {news.map((item, index) => (
              <motion.article 
                key={item.id}
                className="news-card glass"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="card-image-box">
                  <img src={item.image || '/news_article_pilot_model_1774782897920.png'} alt={item.title} className="card-img" />
                  <div className="card-tag">{item.tag}</div>
                </div>
                
                <div className="card-content">
                  <div className="card-meta">
                    <Calendar size={14} className="text-secondary" />
                    <span>{new Date(item.date).toLocaleDateString('de-DE')}</span>
                    <span className="dot" />
                    <span>{item.location}</span>
                  </div>
                  
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">{item.content}</p>
                  
                  <div className="card-footer">
                    <button className="read-more">
                      Details <ArrowRight size={16} />
                    </button>
                    <div className="footer-actions">
                      <Share2 size={18} />
                      <MessageSquare size={18} />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Archive Link */}
          <div className="archive-section">
            <button className="btn-archive">
              Ältere Beiträge laden
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .news-page {
          min-height: 100vh;
          background: #0a0c10;
        }

        .news-hero {
          position: relative; height: 60vh; min-height: 450px; display: flex; align-items: center;
          background: url('/news_hero_modelflying_tech_1774782773953.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .news-hero { margin-top: 0; padding-top: 80px; min-height: 500px; }
          .hero-title { font-size: 2.5rem !important; }
        }

        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10, 12, 16, 0.4) 0%,
            rgba(10, 12, 16, 0.9) 100%
          );
        }

        .tech-scan-lines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
        }

        .hero-content {
          max-width: 800px;
        }

        .transmission-badge {
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
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }

        .highlight { color: #567eb6; }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        .news-feed {
          padding: 6rem 0;
          position: relative;
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
        }

        @media (max-width: 768px) {
          .feed-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
        }

        .title-gradient {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, white 0%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .filter-chips {
          display: flex;
          gap: 10px;
        }

        .chip {
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chip.active {
          background: #567eb6;
          color: white;
          border-color: #567eb6;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2.5rem;
        }

        @media (max-width: 450px) {
          .news-grid { grid-template-columns: 1fr; }
        }

        .news-card {
          border-radius: 30px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .news-card:hover {
          transform: translateY(-10px);
          border-color: #567eb6;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .card-image-box {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .news-card:hover .card-img {
          transform: scale(1.1);
        }

        .card-tag {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(86, 126, 182, 0.9);
          backdrop-filter: blur(10px);
          color: white;
          padding: 6px 14px;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 1px;
        }

        .card-content {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .dot { width: 4px; height: 4px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; }

        .card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .card-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .read-more {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #567eb6;
          font-weight: 700;
          font-size: 0.9rem;
          transition: gap 0.2s;
        }

        .news-card:hover .read-more { gap: 12px; }

        .footer-actions {
          display: flex;
          gap: 15px;
          color: rgba(255, 255, 255, 0.4);
        }

        .archive-section {
          margin-top: 5rem;
          display: flex;
          justify-content: center;
        }

        .btn-archive {
          padding: 16px 40px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 16px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .btn-archive:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #567eb6;
        }
      `}</style>
    </main>
  );
};

export default NewsClient;
