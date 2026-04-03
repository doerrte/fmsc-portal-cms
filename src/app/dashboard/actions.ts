'use server';

import { getDbData, saveDbData, hashPassword, InternalDoc, MemberItem, ContactMessage, PushSubscriptionItem } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';
import { sendNotification } from '@/lib/webpush';
import crypto from 'crypto';

export async function getSafeMembersAction() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  
  if (!authCookie) {
    return { success: false, error: 'Nicht eingeloggt' };
  }

  const db = await getDbData();
  
  // Return only safe fields (no passwords)
  const safeMembers = db.members.map((m: MemberItem) => ({
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
  const user = db.members.find((m: MemberItem) => m.id === userId);

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
  const index = db.members.findIndex((m: MemberItem) => m.id === userId);
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
  const index = db.members.findIndex((m: MemberItem) => m.id === userId);
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
  db.internal_docs = db.internal_docs.filter((d: InternalDoc) => d.id !== id);
  await saveDbData(db);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getMessagesAction() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') {
    return { success: false, error: 'Keine Berechtigung' };
  }

  const db = await getDbData();
  return { success: true, messages: db.messages || [] };
}

export async function deleteMessageAction(id: string) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') {
    return { success: false, error: 'Keine Berechtigung' };
  }

  const db = await getDbData();
  db.messages = db.messages.filter((m: ContactMessage) => m.id !== id);
  await saveDbData(db);
  revalidatePath('/dashboard');
  revalidatePath('/admin/messages');
  return { success: true };
}

export async function updateMessageStatusAction(id: string, status: 'new' | 'read' | 'replied') {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') {
    return { success: false, error: 'Keine Berechtigung' };
  }

  const db = await getDbData();
  const index = db.messages.findIndex((m: ContactMessage) => m.id === id);
  if (index > -1) {
    db.messages[index].status = status;
    await saveDbData(db);
    revalidatePath('/dashboard');
    revalidatePath('/admin/messages');
    return { success: true };
  }
  return { success: false, error: 'Nachricht nicht gefunden' };
}

export async function savePushSubscriptionAction(subscriptionRaw: string) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value || cookieStore.get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const userId = authCookie.split('|')[0];
  const db = await getDbData();
  
  let subscription: any;
  try {
    subscription = typeof subscriptionRaw === 'string' ? JSON.parse(subscriptionRaw) : subscriptionRaw;
  } catch (e) {
    return { success: false, error: 'Ungültiges Abonnement-Format' };
  }

  if (!db.push_subscriptions) db.push_subscriptions = [];

  // Check if subscription already exists for this endpoint
  const existingIndex = db.push_subscriptions.findIndex(
    (s: PushSubscriptionItem) => s.subscription && s.subscription.endpoint === subscription.endpoint
  );

  if (existingIndex > -1) {
    db.push_subscriptions[existingIndex].subscription = subscription;
    db.push_subscriptions[existingIndex].userId = userId;
  } else {
    db.push_subscriptions.push({
      id: crypto.randomUUID(),
      userId,
      subscription
    });
  }

  await saveDbData(db);
  console.log(`[PUSH] Saved subscription for user: ${userId}`);
  return { success: true };
}

export async function testPushAction() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value || cookieStore.get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const userId = authCookie.split('|')[0];
  const db = await getDbData();
  
  const subs = db.push_subscriptions.filter((s: any) => (s.userId || s.user_id) === userId);
  
  console.log(`[TEST PUSH] Found ${subs?.length || 0} subscriptions for user ${userId}`);

  const results = await Promise.all((subs || []).map(async (subData) => {
    try {
      console.log(`[TEST PUSH] Starting send to sub: ${subData.id}`);
      const result = await sendNotification(subData.subscription, JSON.stringify({
        title: 'FMSC Portal Test',
        body: 'Dies ist eine Test-Benachrichtigung.',
        icon: '/icons/icon-192x192.png'
      }));
      console.log(`[TEST PUSH] Success for sub: ${subData.id}`);
      return { subId: subData.id, success: true };
    } catch (err: any) {
      console.error(`[TEST PUSH] ERROR for sub ${subData.id}:`, err.message || err);
      return { subId: subData.id, success: false, error: err.message || err };
    }
  }));

  const successCount = results.filter(r => r.success).length;
  console.log(`[TEST PUSH] Completed. Total success: ${successCount}`);
  return { success: true, count: successCount };
}
