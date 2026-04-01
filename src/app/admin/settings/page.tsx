import React from 'react';
import { getDbData } from '@/lib/db';
import { saveSettings } from './actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const data = await getDbData();
  const settings = data.settings;

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Texte anpassen</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Passe die Haupttexte auf der Startseite an. Änderungen sind sofort nach dem Speichern sichtbar.
      </p>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '800px' }}>
        <form action={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f97316' }}>Helden-Bereich (Ganz oben auf der Webseite)</h3>
            <label style={{ fontSize: '1rem', fontWeight: '600' }}>Haupt-Überschrift</label>
            <input 
              name="homepageHeroTitle" 
              defaultValue={settings.homepageHeroTitle} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '1rem' }} 
              required
            />
            
            <label style={{ fontSize: '1rem', fontWeight: '600', marginTop: '1rem' }}>Unter-Titel (Beschreibung)</label>
            <textarea 
              name="homepageHeroSubtitle" 
              defaultValue={settings.homepageHeroSubtitle} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }} 
              required
            />

            <label style={{ fontSize: '1rem', fontWeight: '600', marginTop: '1rem' }}>Hintergrundbild (Optional)</label>
            <input 
              type="file"
              name="homepageHeroImage" 
              accept="image/*"
              style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
            />
            {settings.homepageHeroImage && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Aktuelles Bild: {settings.homepageHeroImage}</p>}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f97316' }}>News-Teaser (Darunter)</h3>
            <label style={{ fontSize: '1rem', fontWeight: '600' }}>Überschrift für Neuigkeiten</label>
            <input 
              name="homepageTeaserTitle" 
              defaultValue={settings.homepageTeaserTitle} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '1rem' }} 
              required
            />
            
            <label style={{ fontSize: '1rem', fontWeight: '600', marginTop: '1rem' }}>Neuigkeiten Beschreibung</label>
            <input 
              name="homepageTeaserSubtitle" 
              defaultValue={settings.homepageTeaserSubtitle} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '1rem' }} 
              required
            />

            <label style={{ fontSize: '1rem', fontWeight: '600', marginTop: '1rem' }}>Teaser Bild (Optional)</label>
            <input 
              type="file"
              name="homepageTeaserImage" 
              accept="image/*"
              style={{ padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
            />
            {settings.homepageTeaserImage && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Aktuelles Bild: {settings.homepageTeaserImage}</p>}
          </div>

          <button type="submit" style={{ background: '#f97316', color: 'white', padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', border: 'none', transition: 'all 0.2s', marginTop: '1rem' }}>
            Änderungen Speichern
          </button>
        </form>
      </div>
    </div>
  );
}
