'use client';

import React, { useState } from 'react';
import { InfoSettings, InfoSafetyRule, InfoDocItem } from '@/lib/db';
import { saveInfoGeneral, saveInfoSafetyRule, saveInfoDoc } from './actions';
import { Shield, AlertTriangle, Users, Radio, Zap, Info, FileText } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Shield, AlertTriangle, Users, Radio, Zap, Info
};

export default function InfoAdminPage() {
  const [info, setInfo] = useState<InfoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [editingSafety, setEditingSafety] = useState<InfoSafetyRule | null>(null);
  const [editingDoc, setEditingDoc] = useState<InfoDocItem | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/info').then(res => res.json()).then(data => {
      setInfo(data);
      setLoading(false);
    });
  }, []);

  if (loading || !info) return <div>Laden...</div>;

  return (
    <div>
      <div style={{ marginBottom: '4rem' }}>
        <div className="admin-page-header">
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Informations-Zentrale</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Sicherheitsregeln, Gastflieger-Infos und Downloads.</p>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <form action={async (fd) => {
            await saveInfoGeneral(fd);
            window.location.reload();
          }} className="admin-list">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316', marginBottom: '0.5rem' }}>Gastflieger-Informationen</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Regeln für Gastflieger (Jede Zeile = ein Punkt)</label>
              <textarea name="guestRules" defaultValue={info.guestRules} placeholder="Versicherungsnachweis erforderlich&#10;Einweisung durch ein Vereinsmitglied..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '150px', lineHeight: 1.5 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Hinweis-Kasten (z.B. Anfahrt)</label>
              <input name="guestWarning" defaultValue={info.guestWarning} placeholder="Bitte auf den Wirtschaftswegen extrem langsam fahren" style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} />
            </div>
            
            <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
              Gast-Infos speichern
            </button>
          </form>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '4rem' }}></div>

      <div style={{ marginBottom: '4rem' }}>
        <div className="admin-page-header">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Sicherheits-Regeln</h2>
          {!editingSafety && (
            <button onClick={() => setEditingSafety({ id: '', title: '', desc: '', icon: 'Shield' })} style={{ background: '#f97316', color: 'var(--foreground)', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + Regel
            </button>
          )}
        </div>

        {editingSafety ? (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <form action={async (fd) => { await saveInfoSafetyRule(fd); window.location.reload(); }} className="admin-list">
              <input type="hidden" name="id" value={editingSafety.id} />
              
              <div className="admin-grid-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Überschrift</label>
                  <input name="title" defaultValue={editingSafety.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Icon Symbol</label>
                  <select name="icon" defaultValue={editingSafety.icon} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#0a0c10', color: 'var(--foreground)' }}>
                    <option value="Shield">Schutzschild</option>
                    <option value="AlertTriangle">Achtung Warnung</option>
                    <option value="Users">Personen / Flugleiter</option>
                    <option value="Radio">Funk / Lärm</option>
                    <option value="Zap">Blitz / Energie</option>
                    <option value="Info">Info Symbol</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Beschreibung</label>
                <textarea name="desc" defaultValue={editingSafety.desc} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '100px', lineHeight: 1.5 }} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Speichern</button>
                <button type="button" onClick={() => setEditingSafety(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Abbrechen</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin-list">
            {info.safetyRules.length === 0 ? <p>Keine Regeln definiert.</p> : info.safetyRules.map(r => {
              const Icon = ICON_MAP[r.icon] || Shield;
              return (
                <div key={r.id} className="admin-card-item">
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ color: '#567eb6', marginTop: '4px', flexShrink: 0 }}><Icon size={24} /></div>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{r.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>{r.desc}</p>
                    </div>
                  </div>
                  <div className="admin-card-actions">
                    <button onClick={() => setEditingSafety(r)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Bearbeiten</button>
                    <form action={async (fd) => { 
                        if(confirm('Sicherheitsregel wirklich löschen?')) {
                          await saveInfoSafetyRule(fd); 
                          window.location.reload(); 
                        }
                    }}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="action" value="delete" />
                      <button type="submit" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Löschen</button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '4rem' }}></div>

      <div>
        <div className="admin-page-header">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Allgemeine Downloads</h2>
          {!editingDoc && (
            <button onClick={() => setEditingDoc({ id: '', title: '', url: '', sizeInfo: '' })} style={{ background: '#f97316', color: 'var(--foreground)', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + Dokument
            </button>
          )}
        </div>

        {editingDoc ? (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <form action={async (fd) => { await saveInfoDoc(fd); window.location.reload(); }} className="admin-list">
              <input type="hidden" name="id" value={editingDoc.id} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Titel (z.B. Vereinssatzung)</label>
                <input name="title" defaultValue={editingDoc.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)' }} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <label style={{ fontWeight: 'bold', color: '#f97316' }}>PDF Datei hochladen</label>
                <input type="file" name="fileFile" accept="application/pdf" style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }} />
                {editingDoc.url && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aktuelle Datei: {editingDoc.url}</p>}
                <input type="hidden" name="url" value={editingDoc.url} />
                <input type="hidden" name="sizeInfo" value={editingDoc.sizeInfo} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Speichern</button>
                <button type="button" onClick={() => setEditingDoc(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--foreground)', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Abbrechen</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="admin-list">
            {info.docs.length === 0 ? <p>Keine Dokumente hochgeladen.</p> : info.docs.map(doc => (
              <div key={doc.id} className="admin-card-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <FileText className="text-secondary" />
                  <div>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '2px' }}>{doc.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PDF | {doc.sizeInfo}</span>
                  </div>
                </div>
                <div className="admin-card-actions">
                  <button onClick={() => setEditingDoc(doc)} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Bearbeiten</button>
                  <form action={async (fd) => { 
                    if(confirm('Dokument wirklich löschen?')) {
                      await saveInfoDoc(fd); 
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
    </div>
  );
}
