'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDbData, hashPassword } from '@/lib/db';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const pw = formData.get('password') as string;
  
  if (!email || !pw) {
    return { success: false, error: 'Bitte E-Mail und Passwort eingeben.' };
  }
  
  const db = await getDbData();
  
  // Fallback Login (nur aktiv, wenn es keine Member in der DB gibt)
  if (db.members.length === 0) {
    if (email === 'admin@fmsc.de' && (pw === 'fmsc2026' || pw === 'opa')) {
      const cookieStore = await cookies();
      cookieStore.set('auth', 'fallback-admin|admin', { maxAge: 60 * 60 * 24 * 30 });
      return { success: true, role: 'admin' };
    }
    return { success: false, error: 'Keine Accounts vorhanden. Nutze den Fallback-Admin Login.' };
  }

  const user = db.members.find(m => m.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { success: false, error: 'E-Mail oder Passwort falsch' };
  }
  
  const hashedPw = hashPassword(pw);
  if (user.passwordHash !== hashedPw) {
    return { success: false, error: 'E-Mail oder Passwort falsch' };
  }
  
  // Login erfolgreich
  const cookieStore = await cookies();
  cookieStore.set('auth', `${user.id}|${user.role}`, { maxAge: 60 * 60 * 24 * 30 });
  return { success: true, role: user.role };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
  redirect('/');
}
