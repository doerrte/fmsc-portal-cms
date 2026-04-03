'use client';

import React, { useState } from 'react';
import { getDbData, NewsItem } from '@/lib/db';
import { saveNews } from './actions';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/news').then(res => res.json()).then(data => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  const handleEdit = (item: NewsItem) => setEditingItem(item);
  const handleCreate = () => setEditingItem({ id: '', title: '', date: new Date().toISOString().split('T')[0], tag: 'News', location: 'Flugplatz Königshoven', content: '' });

  if (loading) return <div>Laden...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>News verwalten</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Erstelle oder bearbeite Vereins-Meldungen.</p>
        </div>
        {!editingItem && (
          <button onClick={handleCreate} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Neue Meldung
          </button>
        )}
      </div>

      {editingItem ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
             await saveNews(fd);
             window.location.reload();
          }} className="admin-list">
            
            <input type="hidden" name="id" value={editingItem.id} />

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Titel der Meldung</label>
                <input name="title" defaultValue={editingItem.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Datum</label>
                <input type="date" name="date" defaultValue={editingItem.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Kategorie</label>
                <input 
                  name="tag" 
                  defaultValue={editingItem.tag} 
                  list="category-suggestions"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} 
                  required 
                />
                <datalist id="category-suggestions">
                  {Array.from(new Set(news.map(item => item.tag).filter(Boolean))).map(tag => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Ort</label>
                <input name="location" defaultValue={editingItem.location} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Inhalt der Meldung</label>
              <textarea name="content" defaultValue={editingItem.content} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '150px' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Bild (Optional)</label>
              <input 
                type="file"
                name="image" 
                accept="image/*"
                style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} 
              />
              {editingItem.image && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aktuelles Bild: {editingItem.image}</p>}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Speichern
              </button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-list">
          {news.length === 0 ? (
            <p>Keine Meldungen vorhanden.</p>
          ) : news.map(item => (
            <div key={item.id} className="admin-card-item">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{new Date(item.date).toLocaleDateString('de-DE')}</span>
                  <span>•</span>
                  <span>Kategorie: {item.tag}</span>
                </div>
              </div>
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Bearbeiten
                </button>
                <form action={async (fd) => {
                    if(confirm('Soll dieser Beitrag gelöscht werden?')) {
                      await saveNews(fd);
                      window.location.reload();
                    }
                }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="action" value="delete" />
                  <button type="submit" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                    Löschen
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
