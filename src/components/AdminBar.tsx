import { cookies } from 'next/headers';
import Link from 'next/link';
import { logoutAction } from '@/app/login/actions';

export default async function AdminBar() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('auth')?.value === 'admin';

  if (!isAdmin) return null;

  return (
    <div style={{
      background: '#0f172a',
      color: '#fff',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #f97316',
      position: 'sticky',
      top: 0,
      zIndex: 99999,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <span style={{ fontWeight: '900', color: '#f97316', fontSize: '1.1rem' }}>🛠️ Admin-Modus aktiv</span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
        <Link href="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard-Übersicht</Link>
        <Link href="/admin/news" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>News erstellen</Link>
        <Link href="/admin/events" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Termin erstellen</Link>
      </div>
      <div>
        <form action={logoutAction}>
          <button type="submit" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
            Abmelden
          </button>
        </form>
      </div>
    </div>
  );
}
