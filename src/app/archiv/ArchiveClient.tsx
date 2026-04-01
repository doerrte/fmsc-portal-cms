'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Archive, History, FileText, Download, Calendar, ArrowRight, Database, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import EditButton from '@/components/EditButton';
import { ArchiveDoc, ArchiveMilestone } from '@/lib/db';

const ArchiveClient = ({ docs, milestones }: { docs: ArchiveDoc[], milestones: ArchiveMilestone[] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Gruppieren der Meilensteine nach Jahr
  const yearMap = new Map();
  milestones.forEach(m => {
    if (!yearMap.has(m.year)) yearMap.set(m.year, { year: m.year, count: 0, highlights: [] });
    const entry = yearMap.get(m.year);
    
    const lines = m.text.split('\n').map((l: string) => l.trim()).filter((l: string) => l !== '');
    entry.count += lines.length;
    entry.highlights.push(...lines);
  });
  const yearsData = Array.from(yearMap.values()).sort((a, b) => parseInt(b.year) - parseInt(a.year));

  const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <main className="archive-page">
      <Navbar />

      <section className="archive-hero">
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
              <Database size={16} />
              <span>ARCHIV-DATENBANK</span>
            </div>
            <h1 className="hero-title">
              Historische <span className="highlight">Daten</span>
              <EditButton href="/admin/archiv" label="Archiv verwalten" />
            </h1>
            <p className="hero-subtitle">Chronologische Erfassung aller Vereinstätigkeiten seit der Gründung 1975.</p>
          </motion.div>
        </div>
      </section>

      <section className="archive-section">
        <div className="container">
          <div className="archive-layout">
            {/* Timeline Selection */}
            <div className="archive-sidebar">
              <div className="search-box glass">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Dokumente durchsuchen..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="year-selector glass">
                <h3>Zeitstrahl Übersicht</h3>
                {yearsData.length === 0 && <p style={{ fontSize: '0.8rem', padding: '0 1rem', opacity: 0.5 }}>Keine Einträge vorhanden.</p>}
                {yearsData.map((y) => (
                  <button key={y.year} className="year-btn">
                    <span className="y-num">{y.year}</span>
                    <span className="y-count">{y.count} Einträge</span>
                    <ArrowRight size={14} className="y-arrow" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="archive-content">
              <div className="section-header">
                <History size={24} className="text-secondary" />
                <h2 className="title-gradient">Meilensteine der Vereinsgeschichte</h2>
              </div>

              <div className="milestones-list">
                {yearsData.length === 0 && <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>Noch keine Meilensteine angelegt.</div>}
                {yearsData.map((y, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="milestone-entry glass"
                  >
                    <div className="m-year-badge">{y.year}</div>
                    <div className="m-content">
                      <ul className="m-highlights">
                        {y.highlights.map((h: string, i: number) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="section-header mt-12">
                <FileText size={24} className="text-secondary" />
                <h2 className="title-gradient">Dokumenten-Archiv</h2>
              </div>

              <div className="docs-list">
                {filteredDocs.length === 0 && <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>Keine passenden Dokumente gefunden.</div>}
                {filteredDocs.map((doc, index) => (
                  <div key={index} className="doc-row glass">
                    <div className="doc-icon"><FileText size={18} /></div>
                    <div className="doc-main">
                      <p>{doc.title}</p>
                      <span>{doc.date}</span>
                    </div>
                    {doc.url ? (
                      <a href={doc.url} download target="_blank" rel="noopener noreferrer" className="btn-download" title="Herunterladen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Download size={18} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Keine Datei</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .archive-page { background: var(--background); color: white; min-height: 100vh; }

        .archive-hero {
          position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center;
          background: url('/archiv_modelflying_history_1774785439358.png') center/cover no-repeat;
          overflow: hidden; margin-top: -80px;
        }

        @media (max-width: 768px) {
          .archive-hero { margin-top: 0; padding-top: 80px; min-height: 450px; }
          .hero-title { font-size: 2.5rem !important; }
        }

        .hero-image-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10, 12, 16, 0.4) 0%, rgba(10, 12, 16, 0.9) 100%); }

        .tech-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(86, 126, 182, 0.1); color: #567eb6; padding: 8px 16px; border-radius: 99px; border: 1px solid rgba(86, 126, 182, 0.2); font-weight: 800; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 2rem; }
        .hero-title { font-size: 4rem; font-weight: 900; margin-bottom: 1rem; line-height: 1; }
        .highlight { color: #567eb6; }
        .hero-subtitle { font-size: 1.25rem; color: rgba(255, 255, 255, 0.6); max-width: 600px; }

        .archive-section { padding: 6rem 0; }

        .archive-layout { display: grid; grid-template-columns: 300px 1fr; gap: 4rem; }
        @media (max-width: 1024px) { .archive-layout { grid-template-columns: 1fr; } }

        .archive-sidebar { display: flex; flex-direction: column; gap: 2rem; position: sticky; top: 120px; height: fit-content; }
        @media (max-width: 1024px) { .archive-sidebar { position: static; } }

        .search-box { padding: 1rem; border-radius: 16px; display: flex; gap: 12px; align-items: center; }
        .search-box input { background: none; border: none; color: white; outline: none; flex-grow: 1; font-weight: 600; font-size: 0.9rem; }

        .year-selector { padding: 1.5rem; border-radius: 24px; display: flex; flex-direction: column; gap: 10px; }
        .year-selector h3 { font-size: 0.7rem; font-weight: 900; color: #567eb6; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; padding-left: 1rem; }
        
        .year-btn { 
          padding: 12px 18px; border-radius: 14px; display: flex; align-items: center; gap: 15px; 
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
          color: white; transition: all 0.2s; cursor: pointer;
        }
        .year-btn:hover { background: rgba(86, 126, 182, 0.1); border-color: #567eb6; }
        .y-num { font-weight: 800; font-size: 1.1rem; flex-grow: 1; text-align: left; }
        .y-count { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); font-weight: 700; white-space: nowrap; }
        .y-arrow { opacity: 0; transform: translateX(-10px); transition: all 0.2s; color: #567eb6; }
        .year-btn:hover .y-arrow { opacity: 1; transform: translateX(0); }

        .archive-content { display: flex; flex-direction: column; gap: 2rem; }

        .section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 2rem; }
        .title-gradient { 
          font-size: 1.8rem; font-weight: 800; 
          background: linear-gradient(135deg, white 0%, rgba(255,255,255,0.4) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .milestones-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .milestone-entry { padding: 2rem; border-radius: 24px; display: grid; grid-template-columns: 100px 1fr; gap: 2rem; align-items: center; }
        @media (max-width: 600px) { .milestone-entry { grid-template-columns: 1fr; text-align: center; } }

        .m-year-badge { 
          height: fit-content; padding: 10px; border-radius: 12px; background: rgba(86, 126, 182, 0.1); 
          color: #567eb6; font-weight: 900; font-size: 1.4rem; text-align: center; border: 1px solid rgba(86, 126, 182, 0.2);
        }

        .m-highlights { list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; }
        .m-highlights li { display: flex; align-items: center; gap: 12px; color: rgba(255, 255, 255, 0.8); font-weight: 600; text-align: left; }
        .m-highlights li::before { content: '•'; color: #567eb6; font-weight: 900; }

        .docs-list { display: flex; flex-direction: column; gap: 1rem; }
        .doc-row { 
          padding: 1.25rem 2rem; border-radius: 20px; display: flex; align-items: center; gap: 2rem;
          transition: transform 0.2s;
        }
        .doc-row:hover { transform: translateX(10px); background: rgba(86, 126, 182, 0.1); }
        .doc-icon { color: #567eb6; }
        .doc-main { flex-grow: 1; }
        .doc-main p { font-weight: 800; margin-bottom: 2px; }
        .doc-main span { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); font-weight: 700; text-transform: uppercase; }
        
        .btn-download { 
          width: 44px; height: 44px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); color: white;
          border: 1px solid rgba(255, 255, 255, 0.1); text-decoration: none; transition: background 0.2s;
        }
        .btn-download:hover { background: rgba(86, 126, 182, 0.2); border-color: #567eb6; color: #567eb6; }

        .mt-12 { margin-top: 4rem; }
      `}</style>
    </main>
  );
};

export default ArchiveClient;
