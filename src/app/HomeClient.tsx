'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import EditButton from '@/components/EditButton';
import LiveWeather from '@/components/LiveWeather';
import Footer from '@/components/Footer';
import { Calendar, Newspaper, Users, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function HomeClient({ data }: { data: any }) {
  const { settings, news } = data;
  const featuredNews = news && news.length > 0 ? news.slice(0, 3) : [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (featuredNews.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 7000); // 7s for more reading time
    return () => clearInterval(timer);
  }, [featuredNews.length, isPaused]);

  const paginate = (newDirection: number) => {
    setCurrentSlide((prev) => (prev + newDirection + featuredNews.length) % featuredNews.length);
  };

  return (
    <main>
      <Hero
        title={settings?.homepageHeroTitle}
        subtitle={settings?.homepageHeroSubtitle}
        bgImage={settings?.homepageHeroImage}
      />
      <LiveWeather />

      {/* Quick Access Grid */}
      <section className="quick-access">
        <div className="container grid">
          <div className="card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Newspaper className="card-icon" size={32} />
            <h3>Neuigkeiten</h3>
            <p>Aktuelle Meldungen, Bauberichte und Vereinsnews.</p>
            <a href="/news" className="card-link">Alle News →</a>
          </div>

          <div className="card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Calendar className="card-icon" size={32} />
            <h3>Termine</h3>
            <p>Flugplatz-Aktionstage, Wettbewerbe und Sitzungen.</p>
            <a href="/events" className="card-link">Kalender ansehen →</a>
          </div>

          <div className="card glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Users className="card-icon" size={32} />
            <h3>Verein</h3>
            <p>Lernen Sie unseren Vorstand und unsere Geschichte kennen.</p>
            <a href="/about" className="card-link">Über uns →</a>
          </div>

          <div className="card glass animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Info className="card-icon" size={32} />
            <h3>Mitgliedschaft</h3>
            <p>Informationen zu Beiträgen und Aufnahmeanträgen.</p>
            <a href="/info" className="card-link">Infos & Kosten →</a>
          </div>
        </div>
      </section>

      {/* Featured News / Carousel */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="title-gradient">
              {settings?.homepageTeaserTitle || 'Aktuelles vom Platz'}
              <EditButton href="/admin/settings" label="Text anpassen" />
            </h2>
            <p>{settings?.homepageTeaserSubtitle || 'Was im Verein gerade passiert.'}</p>
          </div>

          <div className="carousel-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>
            <AnimatePresence mode="wait">
              {featuredNews.map((item: any, index: number) => (
                index === currentSlide && (
                  <motion.div
                    key={item.id}
                    className="news-teaser glass interactive"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(e: any, { offset }: any) => {
                      if (offset.x > 150) paginate(-1);
                      else if (offset.x < -150) paginate(1);
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{ scale: 1.01 }}
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      paddingLeft: '1rem',
                      background: item.image
                        ? `linear-gradient(135deg, var(--teaser-overlay-start) 0%, var(--teaser-overlay-end) 100%), url('${item.image}') center/cover no-repeat`
                        : `linear-gradient(135deg, var(--teaser-overlay-start) 0%, var(--teaser-overlay-end) 100%)`
                    }}
                  >
                    <Link href={`/news/${item.id}`} className="teaser-inner-link" draggable={false}>
                      <div className="teaser-content">
                        <span className="teaser-tag">{item.tag || 'News'}</span>
                        <h3>{item.title}</h3>
                        <p>{item.content}</p>
                        <div className="teaser-meta">
                          <span>{new Date(item.date).toLocaleDateString('de-DE')}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              ))}
            </AnimatePresence>

            {featuredNews.length > 1 && (
              <div className="carousel-dots">
                {featuredNews.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    className={`dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        main {
          min-height: 100vh;
        }

        .quick-access {
          padding: 6rem 0;
          background: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.05) 0%, transparent 50%);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .card {
          padding: 2.5rem;
          border-radius: 32px;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
        }

        .card-icon {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .card-link {
          margin-top: auto;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .featured-section {
          padding: 6rem 0 10rem;
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .title-gradient {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--foreground) 0%, var(--text-tertiary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .news-teaser {
          padding: 5rem 6rem;
          padding-left: 10rem; /* Move content further right */
          border-radius: 20px;
          min-height: 480px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.22);
          border: 1px solid var(--card-border);
          transform: translateZ(0); /* GPU fix for clipping radius */
          -webkit-mask-image: -webkit-radial-gradient(white, black); /* Chrome clipping fix */
        }

        .carousel-container {
          position: relative;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 2rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--card-border);
          transition: all 0.3s;
          padding: 0;
        }

        .dot.active {
          background: var(--primary);
          transform: scale(1.5);
        }

        .teaser-tag {
          background: var(--primary);
          color: white;
          padding: 4px 14px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
          display: inline-block;
        }

        .news-teaser h3 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .teaser-inner-link {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }

        .news-teaser.interactive {
          cursor: grab;
          touch-action: none;
        }

        .news-teaser.interactive:active {
          cursor: grabbing;
        }

        .news-teaser p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          max-width: 800px;
          line-height: 1.6;
        }

        .teaser-meta {
          display: flex;
          gap: 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary);
          opacity: 1;
          margin-top: 0.5rem;
        }
        @media (max-width: 768px) {
          .quick-access, .featured-section { padding: 4rem 0; }
          .title-gradient { font-size: 1.8rem; }
          .card { padding: 1.5rem; border-radius: 20px; }
          .news-teaser { padding: 2rem; border-radius: 32px; min-height: 350px; }
          .news-teaser h3 { font-size: 1.6rem; }
          .news-teaser p { font-size: 1rem; }
        }
      `}</style>
    </main>
  );
}
