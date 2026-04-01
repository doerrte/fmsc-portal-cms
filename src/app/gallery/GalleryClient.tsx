'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Image as ImageIcon, PlayCircle, X, Maximize2, Filter, Camera, Video, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditButton from '@/components/EditButton';

const GalleryClient = ({ items }: { items: any[] }) => {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter || item.category === filter);

  return (
    <main className="gallery-page">
      <Navbar />

      <section className="gallery-hero">
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
              <Monitor size={16} />
              <span>BILDER & VIDEOS</span>
            </div>
            <h1 className="hero-title">
              Medien <span className="highlight">Galerie</span>
              <EditButton href="/admin/gallery" label="Galerie verwalten" />
            </h1>
            <p className="hero-subtitle">Hochauflösende Aufnahmen und Berichte direkt von der Flight-Line.</p>
          </motion.div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          {/* Filters */}
          <div className="gallery-filters glass">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>ALLE</button>
            <button className={`filter-btn ${filter === 'image' ? 'active' : ''}`} onClick={() => setFilter('image')}><Camera size={14} /> FOTOS</button>
            <button className={`filter-btn ${filter === 'video' ? 'active' : ''}`} onClick={() => setFilter('video')}><Video size={14} /> VIDEOS</button>
            {Array.from(new Set(items.map(i => i.category))).filter((c): c is string => typeof c === 'string' && c.trim() !== '' && c !== 'image' && c !== 'video').map(c => (
              <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="gallery-grid">
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="gallery-item-wrapper"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="gallery-item glass">
                    <img src={item.url} alt={item.title} className="item-img" />
                    <div className="item-overlay">
                      {item.type === 'video' && <PlayCircle size={48} className="play-icon" />}
                      <div className="item-info">
                        <span className="item-category">{item.category}</span>
                        <h3 className="item-title">{item.title}</h3>
                        <span className="item-date">{item.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                <p>Noch keine Medien hochgeladen. Klicke auf "Galerie verwalten", um Bilder oder Videos hinzuzufügen.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox"
          >
            <button className="close-btn" onClick={() => setSelectedItem(null)}><X size={32} /></button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="lightbox-content glass"
            >
              {selectedItem.type === 'video' ? (
                <div className="video-container">
                  {(selectedItem.videoUrl && (selectedItem.videoUrl.includes('youtube.com') || selectedItem.videoUrl.includes('youtu.be'))) ? (
                    <iframe 
                      width="100%" 
                      height="500" 
                      src={selectedItem.videoUrl.replace('watch?v=', 'embed/')} 
                      title={selectedItem.title} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      src={selectedItem.videoUrl} 
                      controls 
                      autoPlay 
                      style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                    />
                  )}
                </div>
              ) : (
                <img src={selectedItem.url} alt={selectedItem.title} className="lightbox-img" />
              )}
              <div className="lightbox-footer">
                <div className="l-text">
                  <h3>{selectedItem.title}</h3>
                  <p>{selectedItem.date} — {selectedItem.category}</p>
                </div>
                <div className="l-actions">
                  <button className="l-btn"><Maximize2 size={18} /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style jsx>{`
        .gallery-page { background: var(--background); color: var(--foreground); min-height: 100vh; }

        .gallery-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/hero_modelflying_jet_cinematic_1774782875980.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .gallery-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
          .hero-title { font-size: 2.5rem !important; }
        }

        .hero-image-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10, 12, 16, 0.4) 0%, rgba(10, 12, 16, 0.9) 100%); }

        .tech-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(86, 126, 182, 0.1); color: #567eb6; padding: 8px 16px; border-radius: 99px; border: 1px solid rgba(86, 126, 182, 0.2); font-weight: 800; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 2rem; }
        .hero-title { font-size: 4rem; font-weight: 900; margin-bottom: 1rem; line-height: 1; }
        .highlight { color: #567eb6; }
        .hero-subtitle { font-size: 1.25rem; color: var(--text-secondary); max-width: 600px; }

        .gallery-section { padding: 4rem 0 8rem; }

        .gallery-filters { 
          display: flex; gap: 1rem; padding: 1rem; border-radius: 99px; margin-bottom: 3rem; 
          justify-content: center; flex-wrap: wrap; 
        }

        .filter-btn { 
          padding: 8px 20px; border-radius: 99px; font-size: 0.8rem; font-weight: 800; 
          color: var(--text-secondary); transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }

        .filter-btn.active { background: #567eb6; color: var(--foreground); }
        .filter-btn:hover:not(.active) { background: rgba(255, 255, 255, 0.05); color: var(--foreground); }

        .gallery-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;
        }

        .gallery-item-wrapper { cursor: pointer; }

        .gallery-item {
          position: relative; border-radius: 24px; overflow: hidden; height: 250px;
          transition: transform 0.4s ease; border: 1px solid var(--card-border);
        }

        .item-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .gallery-item:hover .item-img { transform: scale(1.1); }

        .item-overlay {
          position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem;
          opacity: 0.8; transition: opacity 0.3s;
        }

        .gallery-item:hover .item-overlay { opacity: 1; }

        .play-icon { 
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
          color: var(--foreground); filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
          opacity: 0.8; transition: transform 0.2s, opacity 0.2s;
        }

        .gallery-item:hover .play-icon { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }

        .item-category { font-size: 0.6rem; font-weight: 900; color: #567eb6; text-transform: uppercase; letter-spacing: 2px; }
        .item-title { font-size: 1.1rem; font-weight: 800; margin: 4px 0; }
        .item-date { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); font-weight: 700; }

        .lightbox {
          position: fixed; inset: 0; z-index: 3000; background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 2rem;
        }

        .close-btn { position: absolute; top: 2rem; right: 2rem; color: var(--foreground); opacity: 0.5; transition: opacity 0.2s; }
        .close-btn:hover { opacity: 1; }

        .lightbox-content {
          width: 100%; max-width: 1000px; border-radius: 32px; overflow: hidden;
        }

        .lightbox-img { width: 100%; max-height: 70vh; object-fit: contain; }
        .video-container { aspect-ratio: 16/9; width: 100%; }

        .lightbox-footer { padding: 2rem; background: rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; }
        .l-text h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 4px; }
        .l-text p { color: #567eb6; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; }

        .l-btn { padding: 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); color: var(--foreground); border: 1px solid var(--card-border); }
      `}</style>
    </main>
  );
};

export default GalleryClient;
