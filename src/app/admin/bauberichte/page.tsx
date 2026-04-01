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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bauberichte verwalten</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Passe Fortschritte an und füge Ingenieurs-Logbücher hinzu.</p>
        </div>
        {!editingItem && (
          <button onClick={handleCreate} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            + Neues Projekt melden
          </button>
        )}
      </div>

      {editingItem ? (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
             await saveBaubericht(fd);
             window.location.reload();
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <input type="hidden" name="id" value={editingItem.id} />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Projekt Name</label>
                <input name="title" defaultValue={editingItem.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Datum (Text, z.B. Juli 2025)</label>
                <input name="date" defaultValue={editingItem.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Pilot / Erbauer</label>
                <input name="pilot" defaultValue={editingItem.pilot} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Technologie (z.B. Holz, Carbon, 3D Druck)</label>
                <input name="tech" defaultValue={editingItem.tech} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Status</label>
                <select name="status" defaultValue={editingItem.status} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0a0c10', color: 'var(--foreground)' }}>
                  <option value="In Progress">In Progress</option>
                  <option value="Maiden Flight Done">Maiden Flight Done</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Baufortschritt (in %)</label>
                <input type="number" name="progress" min="0" max="100" defaultValue={editingItem.progress} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Baubericht als PDF (Optional)</label>
                <input 
                  type="file"
                  name="pdfFile" 
                  accept=".pdf"
                  style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} 
                />
                {editingItem.pdfUrl && <p style={{ fontSize: '0.8rem', color: '#4ade80' }}>✓ PDF vorhanden</p>}
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f97316' }}>Neuen Logbuch-Eintrag hinzufügen</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Erzähle von den neuesten Baufortschritten und lade direkt passende Bilder dazu hoch.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Text für das Update</label>
                <textarea name="newUpdateText" placeholder="Was gibt es Neues?..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)', minHeight: '120px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Bilder zum Update (Mehrfachauswahl möglich)</label>
                <input 
                  type="file"
                  name="imageFiles" 
                  accept="image/*"
                  multiple
                  style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} 
                />
              </div>
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

          {editingItem.updates && editingItem.updates.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Bisherige Logbuch-Einträge</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {editingItem.updates.map(update => (
                  <div key={update.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold' }}>Eintrag vom {update.date}</p>
                      
                      <form action={async (fd) => { await saveBaubericht(fd); window.location.reload(); }}>
                        <input type="hidden" name="id" value={editingItem.id} />
                        <input type="hidden" name="updateId" value={update.id} />
                        <input type="hidden" name="action" value="deleteUpdate" />
                        <button type="submit" style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Ganzen Eintrag komplett verwerfen</button>
                      </form>
                    </div>

                    <form action={async (fd) => { await saveBaubericht(fd); window.location.reload(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input type="hidden" name="id" value={editingItem.id} />
                      <input type="hidden" name="updateId" value={update.id} />
                      <input type="hidden" name="action" value="editUpdate" />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#567eb6' }}>Text bearbeiten</label>
                        <textarea name="updateText" defaultValue={update.text} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--foreground)', minHeight: '100px' }} required />
                      </div>

                      {update.images && update.images.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#567eb6' }}>Bestehende Bilder (Klicke auf X zum Löschen)</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {update.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <img src={imgUrl} alt="Update" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button 
                                  formAction={async (fd) => { fd.set('imageUrl', imgUrl); fd.set('action', 'deleteUpdateImage'); await saveBaubericht(fd); window.location.reload(); }}
                                  style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'var(--foreground)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Zusätzliche Bilder zu diesem Eintrag hochladen</label>
                        <input type="file" name="imageFiles" accept="image/*" multiple style={{ padding: '8px', borderRadius: '6px', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--foreground)', fontSize: '0.8rem' }} />
                      </div>

                      <div style={{ alignSelf: 'flex-start' }}>
                        <button type="submit" style={{ background: '#567eb6', color: 'var(--foreground)', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>Text & neue Bilder speichern</button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <p>Keine Projekte vorhanden.</p>
          ) : items.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{item.pilot}</span><span>•</span><span>{item.status} ({item.progress}%)</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Bearbeiten
                </button>
                <form action={async (fd) => { await saveBaubericht(fd); window.location.reload(); }}>
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
