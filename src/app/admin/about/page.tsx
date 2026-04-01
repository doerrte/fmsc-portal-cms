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
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Über uns bearbeiten</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Bearbeite den geschichtlichen Text des Vereins.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <form action={async (fd) => {
             await saveAboutSettings(fd);
             window.location.reload();
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>Geschichte Text (Absatz 1)</label>
            <textarea name="historyText1" defaultValue={settings.historyText1} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '120px', lineHeight: 1.5 }} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>Geschichte Text (Absatz 2)</label>
            <textarea name="historyText2" defaultValue={settings.historyText2} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--foreground)', minHeight: '120px', lineHeight: 1.5 }} required />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" style={{ background: '#f97316', color: 'var(--foreground)', padding: '14px 28px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1.1rem' }}>
              Text aktualisieren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
