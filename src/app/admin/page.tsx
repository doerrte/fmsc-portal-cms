import React from 'react';
import Link from 'next/link';
import { Newspaper, Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Willkommen im Admin-Bereich</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Hier kannst du die Inhalte der Webseite ganz einfach ohne Code-Kenntnisse verwalten.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Settings size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Startseite anpassen</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Ändere die Texte, die Besucher direkt auf der Startseite sehen.</p>
          <Link href="/admin/settings" style={{ display: 'inline-block', background: '#f97316', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Texte ändern
          </Link>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Newspaper size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>News verwalten</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Schreibe neue Meldungen oder bearbeite alte News-Einträge.</p>
          <Link href="/admin/news" style={{ display: 'inline-block', background: '#f97316', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Zu den News
          </Link>
        </div>
      </div>
    </div>
  );
}
