'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reorder } from 'framer-motion';
import { Settings, Newspaper, Calendar, Users, Info, Image as ImageIcon, FileText, Archive, Home } from 'lucide-react';

const tileIcons: Record<string, React.ReactNode> = {
  website: <Home size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  settings: <Settings size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  news: <Newspaper size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  events: <Calendar size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  vorstand: <Users size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  about: <Settings size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  info: <Info size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  gallery: <ImageIcon size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  bauberichte: <FileText size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />,
  archiv: <Archive size={32} style={{ color: '#f97316', marginBottom: '1rem' }} />
};

const DEFAULT_TILES = [
  { id: 'website', title: 'Zur Webseite', desc: 'Verlasse den Admin-Bereich und öffne die reguläre Besucher-Ansicht.', href: '/', btn: 'Webseite öffnen' },
  { id: 'settings', title: 'Startseite anpassen', desc: 'Ändere die Texte, die Besucher direkt auf der Startseite sehen.', href: '/admin/settings', btn: 'Texte ändern' },
  { id: 'news', title: 'News verwalten', desc: 'Schreibe neue Meldungen oder bearbeite alte News-Einträge.', href: '/admin/news', btn: 'Zu den News' },
  { id: 'events', title: 'Termine verwalten', desc: 'Plane den Vereinskalender und kündige Events an.', href: '/admin/events', btn: 'Zum Kalender' },
  { id: 'vorstand', title: 'Vorstand verwalten', desc: 'Verwalte die Vorstandsmitglieder und Positionen.', href: '/admin/vorstand', btn: 'Vorstand bearbeiten' },
  { id: 'about', title: 'Über uns anpassen', desc: 'Bearbeite die Vereinshistorie und das Über-Uns Bild.', href: '/admin/about', btn: 'Historie bearbeiten' },
  { id: 'info', title: 'Infos verwalten', desc: 'Passe Platzordnung, Vereinsdokumente und Hinweise an.', href: '/admin/info', btn: 'Dokumente verwalten' },
  { id: 'gallery', title: 'Galerie verwalten', desc: 'Lade neue Bilder hoch oder organisiere bestehende Alben.', href: '/admin/gallery', btn: 'Bilder hochladen' },
  { id: 'bauberichte', title: 'Bauberichte verwalten', desc: 'Erstelle Konstruktions-Logs und aktualisiere Baufortschritte.', href: '/admin/bauberichte', btn: 'Zu Bauberichten' },
  { id: 'archiv', title: 'Archiv verwalten', desc: 'Historische Dokumente, Meilensteine und das digitale Vereinsarchiv.', href: '/admin/archiv', btn: 'Archiv öffnen' }
];

export default function AdminDashboard() {
  const [tiles, setTiles] = useState(DEFAULT_TILES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedOrderStr = localStorage.getItem('fmscAdminTilesOrder');
    if (savedOrderStr) {
      try {
        const savedIds: string[] = JSON.parse(savedOrderStr);
        const ordered = savedIds.map(id => DEFAULT_TILES.find(t => t.id === id)).filter(Boolean) as typeof DEFAULT_TILES;
        DEFAULT_TILES.forEach(dT => {
          if (!ordered.find(o => o.id === dT.id)) ordered.push(dT);
        });
        setTiles(ordered);
      } catch (e) {
        setTiles(DEFAULT_TILES);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleReorder = (newTiles: typeof DEFAULT_TILES) => {
    setTiles(newTiles);
    const orderIds = newTiles.map(t => t.id);
    localStorage.setItem('fmscAdminTilesOrder', JSON.stringify(orderIds));
  };

  if (!isLoaded) return null;

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Willkommen im Admin-Bereich</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
        Hier kannst du die Inhalte der Webseite ganz einfach ohne Code-Kenntnisse verwalten.
      </p>
      <p style={{ color: '#f97316', marginBottom: '3rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Tipp: Kacheln können per Klick geöffnet oder per langem Touch (2s gedrückt halten) am Handy verschoben werden.</p>

      <Reorder.Group 
        axis="y" 
        values={tiles} 
        onReorder={handleReorder} 
        style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', listStyle: 'none', padding: 0, margin: 0 }}
        as="ul"
      >
        {tiles.map((tile) => (
          <TileItem key={tile.id} tile={tile} />
        ))}
      </Reorder.Group>
    </div>
  );
}

import { useRouter } from 'next/navigation';
import { useDragControls } from 'framer-motion';
import { useRef } from 'react';
import { GripHorizontal } from 'lucide-react';

function TileItem({ tile }: { tile: typeof DEFAULT_TILES[0] }) {
  const router = useRouter();
  const controls = useDragControls();
  const [isMobile, setIsMobile] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const handleResize = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragInitiate = (e: React.PointerEvent) => {
    if (isMobile) {
      setIsHolding(true);
      controls.start(e);
    }
  };

  const handlePointerUp = () => {
    setIsHolding(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    router.push(tile.href);
  };

  return (
    <Reorder.Item 
      value={tile}
      dragListener={false} // Nur über den Drag Handle verschiebbar
      dragControls={controls}
      whileDrag={{ scale: 1.05, zIndex: 10, cursor: 'grabbing', boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.7)' }}
      animate={isHolding ? { scale: 1.05, opacity: 0.9 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      style={{ 
        flex: '1 1 300px', 
        background: 'rgba(255,255,255,0.05)', 
        padding: '2rem', 
        borderRadius: '16px', 
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // Für den Drag-Grip
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      {/* Drag Handle - Nur auf Mobile sichtbar */}
      {isMobile && (
        <div 
          onPointerDown={handleDragInitiate}
          onClick={(e) => e.stopPropagation()} // Verhindert dass ein Klick auf den Grip die Seite öffnet
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            padding: '1.5rem',
            cursor: 'grab',
            touchAction: 'none', // Erlaubt Dragging NUR auf diesem Element!
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            zIndex: 20,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        >
          <GripHorizontal size={28} />
        </div>
      )}

      <div>
        {tileIcons[tile.id]}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white', paddingRight: isMobile ? '2rem' : '0' }}>{tile.title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', minHeight: '48px' }}>{tile.desc}</p>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <span 
          className="admin-tile-btn"
          style={{ display: 'inline-block', background: '#f97316', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          {tile.btn}
        </span>
      </div>
    </Reorder.Item>
  );
}
