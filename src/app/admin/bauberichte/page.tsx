'use client';

import React, { useState } from 'react';
import { BauberichtItem } from '@/lib/db';
import { saveBaubericht } from './actions';

export default function BauberichteAdminPage() {
  const [items, setItems] = useState<BauberichtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BauberichtItem | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/bauberichte').then(res => res.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleEdit = (item: BauberichtItem) => setEditingItem(item);
  const handleCreate = () => setEditingItem({ 
    id: '', 
    title: '', 
    pilot: '',
    status: 'In Progress', 
    progress: 10,
    date: new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }), 
    desc: '', 
    tech: '' 
  });

  if (loading) return <div>Laden...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bauberichte verwalten</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Passe Fortschritte an und füge Ingenieurs-Logbücher hinzu.</p>
        </div>
        {!editingItem && (
          <button onClick={handleCreate} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Neues Projekt
          </button>
        )}
      </div>

      {editingItem ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
             await saveBaubericht(fd);
             window.location.reload();
          }} className="admin-list">
            
            <input type="hidden" name="id" value={editingItem.id} />

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Projekt Name</label>
                <input name="title" defaultValue={editingItem.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Datum (z.B. Juli 2025)</label>
                <input name="date" defaultValue={editingItem.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Pilot / Erbauer</label>
                <input name="pilot" defaultValue={editingItem.pilot} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Technologie</label>
                <input name="tech" defaultValue={editingItem.tech} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Status</label>
                <select name="status" defaultValue={editingItem.status} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0a0c10', color: 'var(--foreground)' }}>
                  <option value="In Progress">In Progress</option>
                  <option value="Maiden Flight Done">Maiden Flight Done</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Baufortschritt (in %)</label>
                <input type="number" name="progress" min="0" max="100" defaultValue={editingItem.progress} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Baubericht als PDF (Optional)</label>
                <input 
                  type="file"
                  name="pdfFile" 
                  accept=".pdf"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} 
                />
                {editingItem.pdfUrl && <p style={{ fontSize: '0.8rem', color: '#4ade80' }}>✓ PDF vorhanden</p>}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f97316' }}>Neuem Projekt-Update (Logbuch)</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Fotos und Texte für das Protokoll hinzufügen.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Text für das Update</label>
                <textarea name="newUpdateText" placeholder="Was gibt es Neues?..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)', minHeight: '120px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Bilder hochladen (Mehrfachauswahl)</label>
                <input 
                  type="file"
                  name="imageFiles" 
                  accept="image/*"
                  multiple
                  style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Gesamt speichern
              </button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Abbrechen
              </button>
            </div>
          </form>

          {editingItem.updates && editingItem.updates.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Bisherige Logbuch-Einträge</h3>
              <div className="admin-list">
                {editingItem.updates.map(update => (
                  <div key={update.id} className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold' }}>Eintrag vom {update.date}</p>
                      
                      <form action={async (fd) => { 
                        if(confirm('Diesen Logbuch-Eintrag wirklich komplett löschen?')) {
                          await saveBaubericht(fd); 
                          window.location.reload(); 
                        }
                      }}>
                        <input type="hidden" name="id" value={editingItem.id} />
                        <input type="hidden" name="updateId" value={update.id} />
                        <input type="hidden" name="action" value="deleteUpdate" />
                        <button type="submit" style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Eintrag verwerfen</button>
                      </form>
                    </div>

                    <form action={async (fd) => { await saveBaubericht(fd); window.location.reload(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <input type="hidden" name="id" value={editingItem.id} />
                      <input type="hidden" name="updateId" value={update.id} />
                      <input type="hidden" name="action" value="editUpdate" />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#567eb6' }}>Text korrigieren</label>
                        <textarea name="updateText" defaultValue={update.text} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--foreground)', minHeight: '120px', lineHeight: 1.5 }} required />
                      </div>

                      {update.images && update.images.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#567eb6' }}>Bestehende Bilder</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.8rem' }}>
                            {update.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <img src={imgUrl} alt="Update" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button 
                                  formAction={async (fd) => { 
                                    if(confirm('Bild aus diesem Eintrag löschen?')) {
                                      fd.set('imageUrl', imgUrl); 
                                      fd.set('action', 'deleteUpdateImage'); 
                                      await saveBaubericht(fd); 
                                      window.location.reload(); 
                                    }
                                  }}
                                  style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'var(--foreground)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Weitere Bilder hinzufügen</label>
                        <input type="file" name="imageFiles" accept="image/*" multiple style={{ padding: '8px', borderRadius: '6px', color: 'var(--foreground)', fontSize: '0.8rem' }} />
                      </div>

                      <div style={{ alignSelf: 'flex-start' }}>
                        <button type="submit" style={{ background: '#567eb6', color: 'var(--foreground)', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Update speichern</button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="admin-list">
          {items.length === 0 ? (
            <p>Keine Projekte vorhanden.</p>
          ) : items.map(item => (
            <div key={item.id} className="admin-card-item">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{item.pilot}</span><span>•</span><span>{item.status} ({item.progress}%)</span>
                </div>
              </div>
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Bearbeiten
                </button>
                <form action={async (fd) => { 
                    if(confirm('Baubericht wirklich löschen?')) {
                      await saveBaubericht(fd); 
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
