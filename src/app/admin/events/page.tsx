'use client';

import React, { useState } from 'react';
import { EventItem } from '@/lib/db';
import { saveEvent } from './actions';

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/events').then(res => res.json()).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const handleEdit = (item: EventItem) => setEditingItem(item);
  const handleCreate = () => setEditingItem({ id: '', title: '', date: '', time: '', location: 'Flugplatz Königshovener Feld', category: 'Event', description: '' });

  if (loading) return <div>Laden...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Termine verwalten</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Erstelle oder bearbeite Vereins-Termine.</p>
        </div>
        {!editingItem && (
          <button onClick={handleCreate} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Neuer Termin
          </button>
        )}
      </div>

      {editingItem ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
             await saveEvent(fd);
             window.location.reload();
          }} className="admin-list">
            
            <input type="hidden" name="id" value={editingItem.id} />

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Titel des Events</label>
                <input name="title" defaultValue={editingItem.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Datum (z.B. 12. April 2026)</label>
                <input name="date" defaultValue={editingItem.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div className="admin-grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Uhrzeit (z.B. 09:00 Uhr)</label>
                <input name="time" defaultValue={editingItem.time} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Kategorie (Arbeitsdienst, Flugtag, Info)</label>
                <input name="category" defaultValue={editingItem.category} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Ort</label>
              <input name="location" defaultValue={editingItem.location} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Kurzbeschreibung</label>
              <textarea name="description" defaultValue={editingItem.description} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '100px' }} required />
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
          {events.length === 0 ? (
            <p>Keine Termine vorhanden.</p>
          ) : events.map(item => (
            <div key={item.id} className="admin-card-item">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>{item.date} {item.time}</span>
                  <span>•</span>
                  <span>Typ: {item.category}</span>
                </div>
              </div>
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                  Bearbeiten
                </button>
                <form action={async (fd) => {
                    if(confirm('Termin wirklich löschen?')) {
                      await saveEvent(fd);
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
