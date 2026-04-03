'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Share2, Globe, Link as LinkIcon, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  location: string;
  tag: string;
  image?: string;
}

export default function NewsDetailClient({ item, relatedNews }: { item: NewsItem, relatedNews: NewsItem[] }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Link in Zwischenablage kopiert!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <main className="detail-page">
      {/* Detail Hero Section */}
      <section className="detail-content-section">
        <div className="container">
          <Link href="/news" className="back-link-top">
            <ArrowLeft size={18} /> Zurück zur Übersicht
          </Link>
          
          <div className="content-grid">
            <div className="main-article-column">
              <motion.article 
                className="article-card glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {item.image && (
                  <div className="article-hero-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
                
                <div className="article-inner-padding">
                  <div className="tag-row">
                    <span className="tag-badge">{item.tag}</span>
                  </div>
                  
                  <h1 className="article-title">{item.title}</h1>
                  
                  <div className="article-meta">
                    <div className="meta-item">
                      <Calendar size={18} />
                      <span>{new Date(item.date).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={18} />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div className="article-body">
                    {item.content.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="article-footer">
                    <span className="share-label">Diesen Beitrag teilen:</span>
                    <div className="share-buttons">
                      <button onClick={handleShare} className="share-btn circle" title="Teilen">
                        <Share2 size={20} />
                      </button>
                      <button className="share-btn circle" title="Senden">
                        <Send size={20} />
                      </button>
                      <button className="share-btn circle" title="Web">
                        <Globe size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>

            {/* Sidebar */}
            <aside className="detail-sidebar">
              <div className="sidebar-sticky">
                <div className="sidebar-section glass">
                  <h3 className="sidebar-title">Weitere News</h3>
                  <div className="related-list">
                    {relatedNews.map((news) => (
                      <Link key={news.id} href={`/news/${news.id}`} className="related-item">
                        {news.image && <img src={news.image} alt="" className="related-thumb" />}
                        <div className="related-info">
                          <span className="related-date">{new Date(news.date).toLocaleDateString('de-DE')}</span>
                          <h4 className="related-name">{news.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/news" className="all-news-link">
                    Alle Beiträge <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .detail-page { min-height: 100vh; background: var(--background); padding-bottom: 5rem; }
        
        .detail-content-section { padding: 8rem 0 5rem; position: relative; z-index: 10; }
        @media (max-width: 768px) { .detail-content-section { padding-top: 6rem; } }

        .back-link-top { 
          display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); 
          font-weight: 700; margin-bottom: 2rem; transition: color 0.2s; font-size: 0.9rem;
        }
        .back-link-top:hover { color: var(--primary); }

        .content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2.5rem; }
        @media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; } }

        .article-card { border-radius: 40px; overflow: hidden; border: 1px solid var(--card-border); }
        .article-hero-image { width: 100%; height: 450px; overflow: hidden; }
        .article-hero-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
        .article-card:hover .article-hero-image img { transform: scale(1.05); }

        .article-inner-padding { padding: 4rem; }
        @media (max-width: 768px) { .article-inner-padding { padding: 2rem; } .article-hero-image { height: 250px; } }

        .tag-badge { 
          background: rgba(86, 126, 182, 0.1); color: #567eb6; padding: 6px 14px; 
          border-radius: 99px; font-weight: 800; font-size: 0.7rem; letter-spacing: 1px; 
          border: 1px solid rgba(86, 126, 182, 0.2); text-transform: uppercase; 
        }

        .article-title { font-size: 3rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 1.5rem; line-height: 1.1; color: var(--foreground); }
        @media (max-width: 768px) { .article-title { font-size: 2rem; } }

        .article-meta { display: flex; gap: 2rem; margin-bottom: 3rem; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 8px; color: var(--text-tertiary); font-weight: 600; font-size: 0.9rem; }
        .meta-item svg { color: var(--primary); }

        .article-body { font-size: 1.15rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 4rem; }
        .article-body p { margin-bottom: 1.5rem; }

        .article-footer { padding-top: 2rem; border-top: 1px solid var(--card-border); }
        .share-label { display: block; font-weight: 800; font-size: 0.75rem; color: var(--text-tertiary); letter-spacing: 1px; margin-bottom: 1.5rem; text-transform: uppercase; }
        .share-buttons { display: flex; gap: 10px; }
        .share-btn { 
          width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.03); 
          border: 1px solid var(--card-border); color: var(--foreground); display: flex; 
          align-items: center; justify-content: center; transition: all 0.3s; 
        }
        .share-btn:hover { background: #567eb6; color: white; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

        .sidebar-sticky { position: sticky; top: 120px; }
        .sidebar-section { padding: 2.5rem; border-radius: 32px; border: 1px solid var(--card-border); }
        .sidebar-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 2rem; color: var(--foreground); }
        .related-list { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
        .related-item { display: flex; gap: 1rem; text-decoration: none; align-items: center; transition: transform 0.2s; }
        .related-item:hover { transform: translateX(5px); }
        .related-thumb { width: 70px; height: 55px; border-radius: 12px; object-fit: cover; flex-shrink: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .related-date { font-size: 0.7rem; color: var(--text-tertiary); font-weight: 700; margin-bottom: 4px; display: block; }
        .related-name { font-size: 0.9rem; font-weight: 700; color: var(--foreground); line-height: 1.3; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .all-news-link { display: flex; align-items: center; gap: 8px; color: var(--primary); font-weight: 700; font-size: 0.85rem; transition: gap 0.2s; }
        .all-news-link:hover { gap: 12px; }
      `}</style>
    </main>
  );
}

const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
