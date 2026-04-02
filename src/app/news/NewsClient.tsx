'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Share2, MessageSquare, Radio, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EditButton from '@/components/EditButton';

const ITEMS_PER_PAGE = 6;

const NewsClient = ({ news }: { news: any[] }) => {
  const [activeFilter, setActiveFilter] = useState<string>('Alle');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const filters = ['Alle', 'Events', 'Technik', 'Platz'];

  const filteredNews = activeFilter === 'Alle'
    ? news
    : news.filter(item => item.tag?.toLowerCase() === activeFilter.toLowerCase());

  const visibleNews = filteredNews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNews.length;

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setLoading(false);
    }, 600);
  };

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
              {filters.map(filter => (
                <button
                  key={filter}
                  className={`chip ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="news-grid">
            <AnimatePresence mode="popLayout">
              {visibleNews.length === 0 ? (
                <motion.p
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="no-results"
                >
                  Keine Beiträge in dieser Kategorie.
                </motion.p>
              ) : visibleNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="news-card glass"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
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
            </AnimatePresence>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="archive-section">
              <button className="btn-archive" onClick={handleLoadMore} disabled={loading}>
                {loading ? (
                  <><Loader2 size={18} className="spin" /> Wird geladen...</>
                ) : (
                  'Ältere Beiträge laden'
                )}
              </button>
            </div>
          )}
          {!hasMore && filteredNews.length > ITEMS_PER_PAGE && (
            <p className="all-loaded">Alle Beiträge geladen.</p>
          )}
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .news-page {
          min-height: 100vh;
          background: var(--background);
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
          background: linear-gradient(to bottom, var(--hero-gradient-mid) 0%, var(--hero-gradient-start) 100%);
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
          color: var(--foreground);
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }

        .highlight { color: #567eb6; }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
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
          background: linear-gradient(135deg, var(--foreground) 0%, var(--text-tertiary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .filter-chips {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 4px;
          flex-shrink: 0;
        }

        .filter-chips::-webkit-scrollbar {
          display: none;
        }

        .chip {
          flex-shrink: 0;
        }

        .chip {
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--card-border);
        }

        .chip.active {
          background: #567eb6;
          color: var(--foreground);
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
          color: var(--foreground);
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
          color: var(--foreground);
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .card-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--card-border);
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
          border: 1px solid var(--card-border);
          color: var(--foreground);
          border-radius: 16px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .btn-archive:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #567eb6;
        }

        .btn-archive:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-archive {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chip { background: none; border: 1px solid var(--card-border); cursor: pointer; font-family: inherit; }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          color: var(--text-secondary);
          padding: 4rem;
          font-size: 1.1rem;
        }

        .all-loaded {
          text-align: center;
          color: var(--text-secondary);
          margin-top: 3rem;
          font-size: 0.9rem;
          opacity: 0.6;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </main>
  );
};

export default NewsClient;
