'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const pw = formData.get('password') as string;
  if (pw === 'opa' || pw === 'fmsc2026') {
    // Setze das Auth Cookie (gilt für 30 Tage)
    const cookieStore = await cookies();
    cookieStore.set('auth', 'admin', { maxAge: 60 * 60 * 24 * 30 });
    return { success: true };
  }
  return { success: false, error: 'Falsches Passwort! Bitte verwende "opa"' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
  redirect('/');
}
