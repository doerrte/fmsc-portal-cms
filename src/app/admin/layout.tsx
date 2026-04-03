'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === '/admin';
  
  return (
    <div className="admin-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: 'var(--background)', color: 'var(--foreground)' }}>
      {!isDashboard && (
        <div className="admin-sub-header" style={{ 
          padding: '1rem 2rem', 
          background: 'var(--card-bg)', 
          borderBottom: '1px solid var(--card-border)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
           <Link href="/admin" className="admin-back-btn">
             <Home size={18} /> <span>Zurück zur Admin-Übersicht</span>
           </Link>
        </div>
      )}
      <main className="admin-main" style={{ 
        flex: 1, 
        width: '100%', 
        padding: '2rem',
        paddingTop: isDashboard ? '140px' : '2rem' // Pushes content below fixed bars on dashboard
      }}>
        {children}
      </main>
    </div>
  );
}
