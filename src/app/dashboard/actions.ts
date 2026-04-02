'use server';

import { getDbData, saveDbData, hashPassword, InternalDoc } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

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
    email: m.email,
    role: m.role,
    profileImage: m.profileImage,
    phone: m.phone
  }));

  return { success: true, members: safeMembers };
}

export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const userId = authCookie.split('|')[0];
  const db = await getDbData();
  const user = db.members.find(m => m.id === userId);

  if (!user) return { success: false, error: 'Nutzer nicht gefunden' };

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      phone: user.phone
    }
  };
}

export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const userId = authCookie.split('|')[0];
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const oldPassword = formData.get('oldPassword') as string;
  const phone = formData.get('phone') as string;
  const profileImage = formData.get('profileImage') as string;

  const db = await getDbData();
  const index = db.members.findIndex(m => m.id === userId);
  if (index === -1) return { success: false, error: 'Nutzer nicht gefunden' };

  // Password Verification Logic
  if (password && password.trim().length > 0) {
    if (!oldPassword) return { success: false, error: 'Altes Passwort zur Bestätigung erforderlich!' };
    if (db.members[index].passwordHash !== hashPassword(oldPassword)) {
      return { success: false, error: 'Das alte Passwort ist nicht korrekt!' };
    }
    db.members[index].passwordHash = hashPassword(password);
  }

  if (name) db.members[index].name = name;
  if (email) db.members[index].email = email;
  if (phone !== undefined) db.members[index].phone = phone;
  if (profileImage !== undefined) {
    db.members[index].profileImage = profileImage;
  }

  await saveDbData(db);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function uploadAvatarAction(formData: FormData) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const userId = authCookie.split('|')[0];
  const file = formData.get('file') as File;
  if (!file) return { success: false, error: 'Keine Datei gefunden' };

  const url = await uploadFile(file);
  if (!url) return { success: false, error: 'Upload fehlgeschlagen' };

  const db = await getDbData();
  const index = db.members.findIndex(m => m.id === userId);
  if (index === -1) return { success: false, error: 'Nutzer nicht gefunden' };

  db.members[index].profileImage = url;
  await saveDbData(db);
  revalidatePath('/dashboard');
  return { success: true, url };
}

export async function getInternalDocsAction() {
  const db = await getDbData();
  return { success: true, docs: db.internal_docs || [] };
}

export async function addInternalDocAction(formData: FormData) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') {
    return { success: false, error: 'Keine Berechtigung' };
  }

  const title = formData.get('title') as string;
  const file = formData.get('file') as File;
  const uploader = formData.get('uploader') as string;

  if (!title || !file) return { success: false, error: 'Titel und Datei erforderlich' };

  const url = await uploadFile(file);
  if (!url) return { success: false, error: 'Datei-Upload fehlgeschlagen' };

  const db = await getDbData();
  const newDoc: InternalDoc = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    url,
    date: new Date().toLocaleDateString('de-DE'),
    uploadedBy: uploader || 'Unbekannt'
  };

  db.internal_docs.push(newDoc);
  await saveDbData(db);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteInternalDocAction(id: string) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') {
    return { success: false, error: 'Keine Berechtigung' };
  }

  const db = await getDbData();
  db.internal_docs = db.internal_docs.filter(d => d.id !== id);
  await saveDbData(db);
  revalidatePath('/dashboard');
  return { success: true };
}
