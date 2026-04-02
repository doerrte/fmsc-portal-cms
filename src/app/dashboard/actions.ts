'use server';

import { getDbData } from '@/lib/db';
import { cookies } from 'next/headers';

export async function getSafeMembersAction() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  
  if (!authCookie) {
    return { success: false, error: 'Nicht eingeloggt' };
  }

  const db = await getDbData();
  
  // Return only safe fields (no passwords)
  const safeMembers = db.members.map(m => ({
    id: m.id,
    name: m.name,
    role: m.role
  }));

  return { success: true, members: safeMembers };
}
