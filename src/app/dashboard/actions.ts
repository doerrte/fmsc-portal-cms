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
    if (subscription && typeof subscription.endpoint === 'string') {
      subscription.endpoint = subscription.endpoint.trim();
    }
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

  const saveError = await saveDbData(db) as any;
  if (saveError) {
    console.error(`[PUSH] Database Error for ${userId}:`, saveError);
    return { success: false, error: 'Datenbank-Speicherfehler: ' + (saveError?.message || 'Unbekannt') };
  }

  console.log(`[PUSH] ${existingIndex > -1 ? 'Updated' : 'Created new'} subscription for user: ${userId}`);
  return { success: true, isUpdate: existingIndex > -1 };
}

export async function testPushAction() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value || cookieStore.get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const [userId, role] = authCookie.split('|');
  const db = await getDbData();
  
  // Get all unique subscriptions for admins/board members and current user
  const adminIds = db.members
    .filter((m: any) => m.role === 'admin' || m.role === 'board')
    .map((m: any) => m.id);
  
  const subs = db.push_subscriptions.filter((s: any) => {
    const sId = s.userId || s.user_id;
    return sId === userId || adminIds.includes(sId);
  });
  
  console.log(`[PUSH] Test-Broadcast started for user: ${userId} (${role})`);
  console.log(`[PUSH] Found ${subs.length} candidates in the admin-pool.`);

  // Use a map to avoid duplicate endpoints during test
  const uniqueEndpoints = new Map();
  subs.forEach(s => uniqueEndpoints.set(s.subscription.endpoint, s));
  const uniqueSubs = Array.from(uniqueEndpoints.values());
  
  console.log(`[PUSH] Identified ${uniqueSubs.length} unique endpoints to message.`);

  let lastError = null;
  const staleSubIds: string[] = [];
  const results = await Promise.all(uniqueSubs.map(async (subData) => {
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
      if (!vapidPublicKey || !vapidPrivateKey) throw new Error('VAPID keys not configured');

      const res = await sendNotification(
        subData.subscription, 
        JSON.stringify({
          title: 'Test-Zustellung',
          body: `Erfolgreich um ${new Date().toLocaleTimeString()}!`,
          icon: '/icon.png'
        }),
        vapidPrivateKey,
        vapidPublicKey
      );

      if (!res.ok) {
        throw new Error(`Push service status: ${res.status}`);
      }
      return { success: true };
    } catch (err: any) {
      const errMsg = err.message || '';
      console.error(`[PUSH] Error for sub ${subData.id}:`, errMsg);
      
      // Cleanup for terminal errors
      if (errMsg.includes('VapidPkHashMismatch') || 
          errMsg.includes('410') || 
          errMsg.includes('403') || 
          errMsg.includes('404') ||
          errMsg.toLowerCase().includes('invalid url')) {
        staleSubIds.push(subData.id);
      }
      
      lastError = errMsg;
      return { success: false };
    }
  }));

  // Automatic Cleanup
  if (staleSubIds.length > 0) {
    db.push_subscriptions = db.push_subscriptions.filter(s => !staleSubIds.includes(s.id));
    await saveDbData(db);
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  return { 
    success: true, 
    count: successCount, 
    failed: failCount,
    cleaned: staleSubIds.length,
    error: lastError 
  };
}

export async function verifySubscriptionAction(endpoint: string) {
  const db = await getDbData();
  const exists = db.push_subscriptions?.some((s: any) => s.subscription?.endpoint === endpoint);
  return { success: true, exists };
}

export async function clearMyPushSubscriptionsAction() {
  const authCookie = (await cookies()).get('fmsc_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht angemeldet' };
  const userId = authCookie.split('|')[0];
  
  const db = await getDbData();
  const initialCount = db.push_subscriptions?.length || 0;
  db.push_subscriptions = db.push_subscriptions.filter((s: any) => (s.userId || s.user_id) !== userId);
  const deletedCount = initialCount - db.push_subscriptions.length;
  
  await saveDbData(db);
  console.log(`[PUSH] Cleared ${deletedCount} subscriptions for user: ${userId}`);
  return { success: true, deletedCount };
}

export async function testSinglePushAction(subscriptionJson: string) {
  try {
    const subscription = JSON.parse(subscriptionJson);
    const payload = JSON.stringify({
      title: 'Einzel-Test 🎯',
      body: 'Diese Nachricht wurde nur an DIESES Gerät gesendet.',
      badgeCount: 1
    });
    
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    if (!vapidPublicKey || !vapidPrivateKey) throw new Error('VAPID keys not configured');
    
    await sendNotification(subscription, payload, vapidPrivateKey, vapidPublicKey);
    return { success: true };
  } catch (err: any) {
    console.error('[PUSH] Single test failed:', err);
    return { success: false, error: err.message };
  }
}

export async function testContactPushAction() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth')?.value || cookieStore.get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };

  const [userId] = authCookie.split('|');
  const db = await getDbData();
  
  // Calculate real unread count for the simulation
  const unreadCount = db.messages.filter((m: any) => m.status === 'new').length;

  const mySubs = db.push_subscriptions.filter((s: any) => (s.userId || s.user_id) === userId);
  if (mySubs.length === 0) return { success: false, error: 'Kein Abo für diesen User gefunden.' };

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublicKey || !vapidPrivateKey) throw new Error('VAPID keys not configured');

  const payload = JSON.stringify({
    title: 'Max Mustermann (vom FMSC Kontaktformular)',
    body: 'E-Mail: max@mustermann.de\nBetreff: Schnupperflug\n\nHallo, ich würde gerne mal bei Euch vorbeischauen und mitfliegen!',
    url: '/dashboard?tab=nachrichten',
    badgeCount: unreadCount || 1, // At least 1 for the simulation preview
    tag: 'contact-form-message',
    icon: '/icon.png'
  });

  const results = await Promise.all(mySubs.map(async (s) => {
    try {
      const res = await sendNotification(s.subscription, payload, vapidPrivateKey, vapidPublicKey);
      return res.ok;
    } catch (e) {
      return false;
    }
  }));

  return { success: results.some(r => r), count: results.filter(r => r).length };
}
