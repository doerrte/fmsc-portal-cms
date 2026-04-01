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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dokumenten-Archiv</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>Lade Kassenberichte, Protokolle oder PDFs hoch.</p>
          </div>
          {!editingDoc && (
            <button onClick={handleCreateDoc} style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              + Neues Dokument hochladen
            </button>
          )}
        </div>

        {editingDoc ? (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <form action={async (fd) => {
               await saveArchivDoc(fd);
               window.location.reload();
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input type="hidden" name="id" value={editingDoc.id} />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Titel des Dokuments</label>
                  <input name="title" defaultValue={editingDoc.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} required />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Datum (Text)</label>
                  <input name="date" defaultValue={editingDoc.date} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} required />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Typ</label>
                  <input name="type" defaultValue={editingDoc.type} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <label style={{ fontWeight: 'bold', color: '#f97316' }}>PDF Datei hochladen</label>
                <input type="file" name="fileFile" accept="application/pdf" style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                {editingDoc.url && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Aktuelle Datei: {editingDoc.url}</p>}
                <input type="hidden" name="url" value={editingDoc.url} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Speichern</button>
                <button type="button" onClick={() => setEditingDoc(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Abbrechen</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {docs.length === 0 ? <p>Keine Dokumente im Archiv.</p> : docs.map(doc => (
              <div key={doc.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{doc.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    <span>{doc.date}</span><span>•</span><span>{doc.type}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setEditingDoc(doc)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Bearbeiten</button>
                  <form action={async (fd) => { await saveArchivDoc(fd); window.location.reload(); }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Vereins-Zeitstrahl (Historie)</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>Meilensteine hinzufügen. Diese werden automatisch nach Jahren sortiert.</p>
          </div>
          {!editingMilestone && (
            <button onClick={handleCreateMilestone} style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              + Meilenstein eintragen
            </button>
          )}
        </div>

        {editingMilestone ? (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <form action={async (fd) => {
               await saveArchivMilestone(fd);
               window.location.reload();
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input type="hidden" name="id" value={editingMilestone.id} />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Jahr (Zahl, z.B. 2025)</label>
                  <input type="number" name="year" defaultValue={editingMilestone.year} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white' }} required />
                </div>
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Text des Meilensteins (Mehrere Meilensteine zeilenweise!)</label>
                  <textarea name="text" defaultValue={editingMilestone.text} placeholder="z.B. 50-jähriges Vereinsjubiläum&#10;Einweihung des Platzes..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', minHeight: '100px' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ background: '#f97316', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Speichern</button>
                <button type="button" onClick={() => setEditingMilestone(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Abbrechen</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {milestones.length === 0 ? <p>Keine Meilensteine gefunden.</p> : milestones.map(m => (
              <div key={m.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ background: '#0a0c10', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#f97316' }}>{m.year}</div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{m.text}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setEditingMilestone(m)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Bearbeiten</button>
                  <form action={async (fd) => { await saveArchivMilestone(fd); window.location.reload(); }}>
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
