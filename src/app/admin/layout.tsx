import React from 'react';
import Link from 'next/link';
import { Settings, Newspaper, Calendar, Home, Image as ImageIcon, FileText, Archive, Info } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>FMSC Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Home size={18} /> Übersicht
          </Link>
          <Link href="/admin/settings" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Settings size={18} /> Texte anpassen
          </Link>
          <Link href="/admin/news" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Newspaper size={18} /> News verwalten
          </Link>
          <Link href="/admin/events" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Calendar size={18} /> Termine verwalten
          </Link>
          <Link href="/admin/vorstand" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Settings size={18} /> Vorstand verwalten
          </Link>
          <Link href="/admin/about" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Settings size={18} /> Über uns anpassen
          </Link>
          <Link href="/admin/info" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Info size={18} /> Infos verwalten
          </Link>
          <Link href="/admin/gallery" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <ImageIcon size={18} /> Galerie verwalten
          </Link>
          <Link href="/admin/bauberichte" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <FileText size={18} /> Bauberichte verwalten
          </Link>
          <Link href="/admin/archiv" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Archive size={18} /> Archiv verwalten
          </Link>
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary, #f97316)', textDecoration: 'none' }}>
              Zur Webseite
            </Link>
          </div>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
