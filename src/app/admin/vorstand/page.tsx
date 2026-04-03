'use client';

import React, { useState } from 'react';
import { VorstandItem } from '@/lib/db';
import { saveVorstand } from './actions';

export default function VorstandAdminPage() {
  const [vorstand, setVorstand] = useState<VorstandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<VorstandItem | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/vorstand').then(res => res.json()).then(data => {
      setVorstand(data);
      setLoading(false);
    });
  }, []);

  const handleEdit = (item: VorstandItem) => setEditingItem(item);
  const handleCreate = () => setEditingItem({ id: '', name: '', role: '', desc: '', type: 'main' });

  if (loading) return <div>Laden...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Vorstand verwalten</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Bearbeite die Liste der Vorstandsmitglieder.</p>
        </div>
        {!editingItem && (
          <button onClick={handleCreate} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Mitglied hinzufügen
          </button>
        )}
      </div>

      {editingItem ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
             await saveVorstand(fd);
             window.location.reload();
          }} className="admin-list">
            
            <input type="hidden" name="id" value={editingItem.id} />

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Name</label>
                <input name="name" defaultValue={editingItem.name} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Rolle (z.B. Vorsitzender)</label>
                <input name="role" defaultValue={editingItem.role} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Zugehörigkeit</label>
              <select name="type" defaultValue={editingItem.type} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#1e293b', color: 'var(--foreground)', opacity: 0.9 }}>
                <option value="main">Geschäftsführender Vorstand (Große Karte)</option>
                <option value="extended">Erweiterter Vorstand (Kleine Karte)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Kurzbeschreibung (Optional - Nur für erweiterten Vorstand)</label>
              <textarea name="desc" defaultValue={editingItem.desc} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '80px' }} />
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
          {vorstand.length === 0 ? (
            <p>Keine Mitglieder vorhanden.</p>
          ) : vorstand.map(item => (
            <div key={item.id} className="admin-card-item">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.name}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{item.role}</span>
                  <span>•</span>
                  <span>Typ: {item.type === 'main' ? 'Geschäftsführend' : 'Erweitert'}</span>
                </div>
              </div>
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Bearbeiten
                </button>
                <form action={async (fd) => {
                    if(confirm('Wirklich löschen?')) {
                      await saveVorstand(fd);
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
