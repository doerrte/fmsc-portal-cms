'use client';
import Link from 'next/link';
import { useAdmin } from './AdminContext';

export default function EditButton({ href, label = 'Bearbeiten' }: { href: string; label?: string }) {
  const isAdmin = useAdmin();

  if (!isAdmin) return null;

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginLeft: '12px', verticalAlign: 'middle' }}>
      <Link href={href} style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px', 
        background: '#f97316', 
        color: '#fff', 
        padding: '6px 16px', 
        borderRadius: '99px', 
        fontSize: '0.85rem', 
        fontWeight: 'bold', 
        textDecoration: 'none',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        ✏️ {label}
      </Link>
    </div>
  );
}
