import React from 'react';
import { getDbData } from '@/lib/db';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import EditButton from '@/components/EditButton';

export const dynamic = 'force-dynamic';

export default async function BauberichtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const data = await getDbData();
  const report = data.bauberichte.find(r => r.id === unwrappedParams.id);

  if (!report) {
    notFound();
  }

  // Ensure updates exist
  const updates = report.updates || [];

  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: '120px', paddingBottom: '40px' }}>
        <div className="container">
          <Link href="/bauberichte" style={{ color: '#567eb6', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '2rem', fontWeight: 'bold' }}>
            <ArrowLeft size={16} /> Zurück zur Übersicht
          </Link>

          <div style={{ background: 'var(--card-bg)', padding: '3rem', borderRadius: '32px', border: '1px solid var(--card-border)', marginBottom: '3rem', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Logbuch • {report.pilot}</span>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '0.5rem 0' }}>{report.title} <EditButton href="/admin/bauberichte" label="Bearbeiten" /></h1>
                <p style={{ color: '#567eb6', fontWeight: 'bold' }}>{report.tech}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ background: 'rgba(86, 126, 182, 0.1)', color: '#567eb6', padding: '8px 16px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', display: 'inline-block', marginBottom: '1rem' }}>
                  {report.status}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>FORTSCHRITT</span>
                  <div style={{ width: '150px', height: '6px', background: 'var(--card-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${report.progress}%`, background: 'linear-gradient(90deg, #567eb6, var(--status-clear))', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{report.progress}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {report.pdfUrl && (
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <a href={report.pdfUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--status-clear)', padding: '16px 32px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)', fontWeight: '800', textDecoration: 'none' }}>
                <FileText size={20} /> PDF DOKUMENT ÖFFNEN
              </a>
            </div>
          )}

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: 'var(--card-border)' }} />

            {updates.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Noch keine Logbucheinträge vorhanden.</p>
            ) : updates.map((update, idx) => (
              <div key={update.id} style={{ position: 'relative', paddingLeft: '60px', marginBottom: '4rem' }}>
                {/* Timeline dot */}
                <div style={{ position: 'absolute', left: '16px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: '#f97316', boxShadow: '0 0 0 4px var(--background)' }} />
                
                <span style={{ fontSize: '0.9rem', color: '#f97316', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <Clock size={14} /> Update vom {update.date}
                </span>

                <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
                  {update.text}
                </div>

                {update.images && update.images.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {update.images.map((imgUrl, i) => (
                      <img key={i} src={imgUrl} alt={`Foto ${i}`} style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--card-border)' }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
