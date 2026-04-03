'use client';

import React, { useState, useEffect } from 'react';
import { AboutSettings } from '@/lib/db';
import { saveAboutSettings } from './actions';

export default function AboutAdminPage() {
  const [settings, setSettings] = useState<AboutSettings | null>(null);

  useEffect(() => {
    fetch('/api/admin/about').then(res => res.json()).then(data => {
      setSettings(data);
    });
  }, []);

  if (!settings) return <div>Laden...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Über uns bearbeiten</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Bearbeite die Vereinsgeschichte und Beschreibung.</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        <form action={async (fd) => {
             await saveAboutSettings(fd);
             window.location.reload();
          }} className="admin-list">
            
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label style={{ fontWeight: 'bold' }}>Geschichte Text (Absatz 1)</label>
            <textarea name="historyText1" defaultValue={settings.historyText1} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '150px', lineHeight: 1.6, fontSize: '1rem' }} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <label style={{ fontWeight: 'bold' }}>Geschichte Text (Absatz 2)</label>
            <textarea name="historyText2" defaultValue={settings.historyText2} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '150px', lineHeight: 1.6, fontSize: '1rem' }} required />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '14px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1.1rem' }}>
              Änderungen Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
