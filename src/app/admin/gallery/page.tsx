'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/lib/db';
import { saveGallery } from './actions';

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/gallery').then(res => res.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleEdit = (item: GalleryItem) => setEditingItem(item);
  const handleCreate = () => setEditingItem({ 
    id: '', 
    title: '', 
    date: new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }), 
    category: 'event', 
    type: 'image', 
    url: '' 
  });

  if (loading) return <div>Laden...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Galerie verwalten</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Lade neue Bilder hoch oder füge Videos hinzu.</p>
        </div>
        {!editingItem && (
          <button onClick={handleCreate} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Neues Medium
          </button>
        )}
      </div>

      {editingItem ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
             await saveGallery(fd);
             window.location.reload();
          }} className="admin-list">
            
            <input type="hidden" name="id" value={editingItem.id} />

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Titel</label>
                <input name="title" defaultValue={editingItem.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Datum (z.B. Juli 2025)</label>
                <input name="date" defaultValue={editingItem.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Medien-Typ</label>
                <select name="type" defaultValue={editingItem.type} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0a0c10', color: 'var(--foreground)' }}>
                  <option value="image">Bild (Foto)</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Kategorie</label>
                <input list="category-list" name="category" defaultValue={editingItem.category} placeholder="Eigene Kategorie eintippen..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0a0c10', color: 'var(--foreground)' }} required />
                <datalist id="category-list">
                  <option value="Event" />
                  <option value="Technik" />
                  <option value="Flugplatz" />
                </datalist>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <label style={{ fontWeight: 'bold', color: '#f97316' }}>Vorschaubild / Foto hochladen</label>
              <input type="file" name="imageFile" accept="image/*" style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} />
              {editingItem.url && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aktuelles Bild: {editingItem.url}</p>}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f97316' }}>Einstellungen für Videos</h3>
            
            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Video-Datei (MP4)</label>
                <input type="file" name="videoFile" accept="video/mp4,video/webm" style={{ padding: '12px', borderRadius: '8px', border: '1px dashed #f97316', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--foreground)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>ODER: YouTube Link</label>
                <input name="videoUrl" defaultValue={editingItem.videoUrl} placeholder="https://www.youtube.com/watch?v=..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
          {items.length === 0 ? (
            <p>Keine Medien vorhanden.</p>
          ) : items.map(item => (
            <div key={item.id} className="admin-card-item">
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {item.url && <img src={item.url} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{item.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span>{item.date}</span><span>•</span><span>{item.type}</span><span>•</span><span>{item.category}</span>
                  </div>
                </div>
              </div>
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Bearbeiten
                </button>
                <form action={async (fd) => {
                    if(confirm('Medium wirklich löschen?')) {
                      await saveGallery(fd);
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
