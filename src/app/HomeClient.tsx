'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EditButton from '@/components/EditButton';
import LiveWeather from '@/components/LiveWeather';
import Footer from '@/components/Footer';
import { Calendar, Newspaper, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeClient({ data }: { data: any }) {
  const { settings, news } = data;
  const topNews = news && news.length > 0 ? news[0] : null;
  return (
    <main>
      <Navbar />
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

      {/* Featured News / Teaser */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="title-gradient">
              {settings?.homepageTeaserTitle || 'Aktuelles vom Platz'}
              <EditButton href="/admin/settings" label="Text anpassen" />
            </h2>
            <p>{settings?.homepageTeaserSubtitle || 'Was im Verein gerade passiert.'}</p>
          </div>

          {topNews && (
            <div className="news-teaser glass" style={settings?.homepageTeaserImage ? { background: `linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(10, 12, 16, 0.95) 100%), url('${settings.homepageTeaserImage}') center/cover no-repeat` } : {}}>
              <div className="teaser-content">
                <span className="teaser-tag">{topNews.tag}</span>
                <h3>{topNews.title}</h3>
                <p>{topNews.content}</p>
                <div className="teaser-meta">
                  <span>{new Date(topNews.date).toLocaleDateString('de-DE')}</span>
                  <span>•</span>
                  <span>{topNews.location}</span>
                </div>
              </div>
            </div>
          )}
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
          border-radius: 24px;
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
          padding: 3rem;
          border-radius: 32px;
          background: linear-gradient(135deg, rgba(86, 126, 182, 0.05) 0%, var(--glass-bg) 100%);
          border: 1px solid var(--card-border);
        }

        .teaser-tag {
          background: var(--primary);
          color: var(--foreground);
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .news-teaser h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .news-teaser p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          max-width: 800px;
        }

        .teaser-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent);
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .quick-access, .featured-section { padding: 4rem 0; }
          .title-gradient { font-size: 1.8rem; }
          .card { padding: 1.5rem; border-radius: 20px; }
          .news-teaser { padding: 1.5rem; border-radius: 20px; }
          .news-teaser h3 { font-size: 1.5rem; }
          .news-teaser p { font-size: 1rem; }
        }
      `}</style>
    </main>
  );
}
