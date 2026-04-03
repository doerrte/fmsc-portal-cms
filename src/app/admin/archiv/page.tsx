'use client';

import React, { useState } from 'react';
import { ArchiveDoc, ArchiveMilestone } from '@/lib/db';
import { saveArchivDoc, saveArchivMilestone } from './actions';

export default function ArchivAdminPage() {
  const [docs, setDocs] = useState<ArchiveDoc[]>([]);
  const [milestones, setMilestones] = useState<ArchiveMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingDoc, setEditingDoc] = useState<ArchiveDoc | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<ArchiveMilestone | null>(null);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/admin/archiv_docs').then(res => res.json()),
      fetch('/api/admin/archiv_milestones').then(res => res.json())
    ]).then(([fetchedDocs, fetchedMilestones]) => {
      setDocs(fetchedDocs);
      setMilestones(fetchedMilestones);
      setLoading(false);
    });
  }, []);

  const handleCreateDoc = () => setEditingDoc({ id: '', title: '', date: new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }), type: 'PDF', url: '' });
  const handleCreateMilestone = () => setEditingMilestone({ id: '', year: new Date().getFullYear().toString(), text: '' });

  if (loading) return <div>Laden...</div>;

  return (
    <div>
      <div style={{ marginBottom: '4rem' }}>
        <div className="admin-page-header">
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dokumenten-Archiv</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Lade Kassenberichte, Protokolle oder PDFs hoch.</p>
          </div>
          {!editingDoc && (
            <button onClick={handleCreateDoc} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + PDF hochladen
            </button>
          )}
        </div>

        {editingDoc ? (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <form action={async (fd) => {
               await saveArchivDoc(fd);
               window.location.reload();
            }} className="admin-list">
              <input type="hidden" name="id" value={editingDoc.id} />

              <div className="admin-grid-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Titel des Dokuments</label>
                  <input name="title" defaultValue={editingDoc.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Datum</label>
                    <input name="date" defaultValue={editingDoc.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Typ</label>
                    <input name="type" defaultValue={editingDoc.type} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <label style={{ fontWeight: 'bold', color: '#f97316' }}>PDF Datei hochladen</label>
                <input type="file" name="fileFile" accept="application/pdf" style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} />
                {editingDoc.url && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aktuelle Datei: {editingDoc.url}</p>}
                <input type="hidden" name="url" value={editingDoc.url} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Speichern</button>
                <button type="button" onClick={() => setEditingDoc(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Abbrechen</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin-list">
            {docs.length === 0 ? <p>Keine Dokumente im Archiv.</p> : docs.map(doc => (
              <div key={doc.id} className="admin-card-item">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{doc.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>{doc.date}</span><span>•</span><span>{doc.type}</span>
                  </div>
                </div>
                <div className="admin-card-actions">
                  <button onClick={() => setEditingDoc(doc)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Bearbeiten</button>
                  <form action={async (fd) => { 
                    if(confirm('Dokument unwiderruflich löschen?')) {
                      await saveArchivDoc(fd); 
                      window.location.reload(); 
                    }
                  }}>
                    <input type="hidden" name="id" value={doc.id} />
                    <input type="hidden" name="action" value="delete" />
                    <button type="submit" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Löschen</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '4rem' }}></div>

      <div>
        <div className="admin-page-header">
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Zeitstrahl (Historie)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Meilensteine der Vereinsgeschichte verwalten.</p>
          </div>
          {!editingMilestone && (
            <button onClick={handleCreateMilestone} style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + Meilenstein
            </button>
          )}
        </div>

        {editingMilestone ? (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <form action={async (fd) => {
               await saveArchivMilestone(fd);
               window.location.reload();
            }} className="admin-list">
              <input type="hidden" name="id" value={editingMilestone.id} />

              <div className="admin-grid-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Jahr (z.B. 2025)</label>
                  <input type="number" name="year" defaultValue={editingMilestone.year} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Beschreibung (Meilensteine)</label>
                  <textarea name="text" defaultValue={editingMilestone.text} placeholder="z.B. 50-jähriges Vereinsjubiläum..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '100px', lineHeight: 1.5 }} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Speichern</button>
                <button type="button" onClick={() => setEditingMilestone(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Abbrechen</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin-list">
            {milestones.length === 0 ? <p>Keine Meilensteine gefunden.</p> : milestones.map(m => (
              <div key={m.id} className="admin-card-item">
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1PX solid rgba(249, 115, 22, 0.3)', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', color: '#f97316', fontSize: '1.1rem', flexShrink: 0 }}>{m.year}</div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.5 }}>{m.text}</h3>
                </div>
                <div className="admin-card-actions">
                  <button onClick={() => setEditingMilestone(m)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Bearbeiten</button>
                  <form action={async (fd) => { 
                    if(confirm('Meilenstein wirklich löschen?')) {
                      await saveArchivMilestone(fd); 
                      window.location.reload(); 
                    }
                  }}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="action" value="delete" />
                    <button type="submit" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Löschen</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
