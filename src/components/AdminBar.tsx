import { cookies } from 'next/headers';
import Link from 'next/link';
import { logoutAction } from '@/app/login/actions';

export default async function AdminBar() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  const isAdmin = authCookie ? authCookie.split('|')[1] === 'admin' : false;

  if (!isAdmin) return null;

  return (
    <div className="admin-bar">
      <div className="admin-bar-links">
        <span style={{ fontWeight: '900', color: '#f97316', fontSize: '1.1rem' }}>🛠️ Admin-Modus aktiv</span>
      </div>
    </div>
  );
}
