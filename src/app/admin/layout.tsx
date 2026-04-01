'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === '/admin';
  
  return (
    <div className="admin-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: 'var(--background)', color: 'var(--foreground)' }}>
      {!isDashboard && (
        <div style={{ padding: '1.5rem 2rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#f97316', textDecoration: 'none', fontWeight: 'bold', padding: '8px 16px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px' }}>
             <Home size={18} /> Zurück zur Admin-Übersicht
           </Link>
           <ThemeToggle />
        </div>
      )}
      <main className="admin-main" style={{ flex: 1, width: '100%', padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
