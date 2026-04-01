import { cookies } from 'next/headers';
import Link from 'next/link';
import { logoutAction } from '@/app/login/actions';

export default async function AdminBar() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('auth')?.value === 'admin';

  if (!isAdmin) return null;

  return (
    <div className="admin-bar">
      <div className="admin-bar-links">
        <span style={{ fontWeight: '900', color: '#f97316', fontSize: '1.1rem' }}>🛠️ Admin-Modus aktiv</span>
        <span className="admin-bar-separator">|</span>
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
