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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Galerie verwalten</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>Lade neue Bilder hoch oder fühl Videos hinzu.</p>
        </div>
        {!editingItem && (
          <button onClick={handleCreate} style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            + Neues Medium hinzufügen
          </button>
        )}
      </div>

      {editingItem ? (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
             await saveGallery(fd);
             window.location.reload();
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <input type="hidden" name="id" value={editingItem.id} />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Titel</label>
                <input name="title" defaultValue={editingItem.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} required />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Datum (Text, z.B. Juli 2025)</label>
                <input name="date" defaultValue={editingItem.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Medien-Typ</label>
                <select name="type" defaultValue={editingItem.type} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0a0c10', color: 'white' }}>
                  <option value="image">Bild (Foto)</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Kategorie (Tag)</label>
                <input list="category-list" name="category" defaultValue={editingItem.category} placeholder="Eigene Kategorie eintippen..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0a0c10', color: 'white' }} required />
                <datalist id="category-list">
                  <option value="Event" />
                  <option value="Technik" />
                  <option value="Flugplatz" />
                </datalist>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <label style={{ fontWeight: 'bold', color: '#f97316' }}>Vorschaubild / Foto hochladen</label>
              <input type="file" name="imageFile" accept="image/*" style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              {editingItem.url && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Aktuelles Bild: {editingItem.url}</p>}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f97316' }}>Optionen für Videos</h3>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Video-Datei hochladen (MP4)</label>
                <input type="file" name="videoFile" accept="video/mp4,video/webm" style={{ padding: '12px', borderRadius: '8px', border: '1px dashed #f97316', background: 'rgba(249, 115, 22, 0.1)', color: 'white' }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>ODER: YouTube Link</label>
                <input name="videoUrl" defaultValue={editingItem.videoUrl} placeholder="https://www.youtube.com/watch?v=..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} />
              </div>
            </div>
            {editingItem.videoUrl && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Aktuelles Video: {editingItem.videoUrl}</p>}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Speichern
              </button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <p>Keine Medien vorhanden.</p>
          ) : items.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {item.url && <img src={item.url} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    <span>{item.date}</span><span>•</span><span>{item.type}</span><span>•</span><span>{item.category}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Bearbeiten
                </button>
                <form action={async (fd) => { await saveGallery(fd); window.location.reload(); }}>
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
