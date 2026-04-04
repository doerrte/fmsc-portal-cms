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
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const db = await getDbData();
  const safeMembers = db.members.map((m: MemberItem) => ({
    id: m.id, name: m.name, email: m.email, role: m.role, profileImage: m.profileImage, phone: m.phone
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
  return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage, phone: user.phone } };
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
  if (password && password.trim().length > 0) {
    if (!oldPassword) return { success: false, error: 'Altes Passwort erforderlich!' };
    if (db.members[index].passwordHash !== hashPassword(oldPassword)) return { success: false, error: 'Altes Passwort falsch!' };
    db.members[index].passwordHash = hashPassword(password);
  }
  if (name) db.members[index].name = name;
  if (email) db.members[index].email = email;
  if (phone !== undefined) db.members[index].phone = phone;
  if (profileImage !== undefined) db.members[index].profileImage = profileImage;
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
  if (!file) return { success: false, error: 'Keine Datei' };
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
  const authCookie = (await cookies()).get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') return { success: false, error: 'Keine Berechtigung' };
  const title = formData.get('title') as string;
  const file = formData.get('file') as File;
  const uploader = formData.get('uploader') as string;
  if (!title || !file) return { success: false, error: 'Titel/Datei fehlt' };
  const url = await uploadFile(file);
  if (!url) return { success: false, error: 'Upload fehlgeschlagen' };
  const db = await getDbData();
  db.internal_docs.push({ id: Math.random().toString(36).substr(2, 9), title, url, date: new Date().toLocaleDateString('de-DE'), uploadedBy: uploader || 'Unbekannt' });
  await saveDbData(db);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteInternalDocAction(id: string) {
  const authCookie = (await cookies()).get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') return { success: false, error: 'Keine Berechtigung' };
  const db = await getDbData();
  db.internal_docs = db.internal_docs.filter((d: InternalDoc) => d.id !== id);
  await saveDbData(db);
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getMessagesAction() {
  const authCookie = (await cookies()).get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') return { success: false, error: 'Keine Berechtigung' };
  return { success: true, messages: (await getDbData()).messages || [] };
}

export async function deleteMessageAction(id: string) {
  const authCookie = (await cookies()).get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') return { success: false, error: 'Keine Berechtigung' };
  const db = await getDbData();
  db.messages = db.messages.filter((m: ContactMessage) => m.id !== id);
  await saveDbData(db);
  revalidatePath('/dashboard');
  revalidatePath('/admin/messages');
  return { success: true };
}

export async function updateMessageStatusAction(id: string, status: 'new' | 'read' | 'replied') {
  const authCookie = (await cookies()).get('auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const role = authCookie.split('|')[1];
  if (role !== 'admin' && role !== 'board') return { success: false, error: 'Keine Berechtigung' };
  const db = await getDbData();
  const index = db.messages.findIndex((m: ContactMessage) => m.id === id);
  if (index > -1) {
    db.messages[index].status = status;
    await saveDbData(db);
    revalidatePath('/dashboard');
    revalidatePath('/admin/messages');
    return { success: true };
  }
  return { success: false, error: 'Nicht gefunden' };
}

export async function savePushSubscriptionAction(subscriptionJson: string) {
  const authCookie = (await cookies()).get('auth')?.value || (await cookies()).get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  
  const userId = authCookie.split('|')[0];
  const subscription = JSON.parse(subscriptionJson);
  
  // CRITICAL VALIDATION: Ensure subscription has an endpoint
  if (!subscription || !subscription.endpoint) {
    console.error('[PUSH] Invalid subscription object received:', subscription);
    return { success: false, error: 'Ungültige Abonnement-Daten' };
  }

  const db = await getDbData();
  if (!db.push_subscriptions) db.push_subscriptions = [];
  
  db.push_subscriptions.push({ id: crypto.randomUUID(), userId, subscription });
  await saveDbData(db);
  console.log(`[PUSH] Saved for user: ${userId}`);
  return { success: true, userId };
}

export async function getMyUserIdAction() {
  const authCookie = (await cookies()).get('auth')?.value || (await cookies()).get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const [userId, role] = authCookie.split('|');
  return { success: true, userId, role };
}

export async function clearMyPushSubscriptionsAction() {
  const authCookie = (await cookies()).get('auth')?.value || (await cookies()).get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const [userId] = authCookie.split('|');
  const db = await getDbData();
  const initialCount = db.push_subscriptions?.length || 0;
  db.push_subscriptions = (db.push_subscriptions || []).filter((s: any) => (s.userId || s.user_id) !== userId);
  const deletedCount = initialCount - db.push_subscriptions.length;
  await saveDbData(db);
  console.log(`[PUSH] Cleared ${deletedCount} for user: ${userId}`);
  return { success: true, count: deletedCount };
}

export async function testPushAction() {
  const authCookie = (await cookies()).get('auth')?.value || (await cookies()).get('admin_auth')?.value;
  if (!authCookie) return { success: false, error: 'Nicht eingeloggt' };
  const [userId, role] = authCookie.split('|');
  const db = await getDbData();
  const currentUserId = userId.trim();
  const allDbIds = (db.push_subscriptions || []).map((s: any) => (s.userId || s.user_id || '').trim());
  
  const subs = (db.push_subscriptions || []).filter((s: any) => {
    const dbUserId = (s.userId || s.user_id || '').trim();
    return dbUserId === currentUserId;
  });

  const auditTrail = {
    sessionUserId: currentUserId,
    foundInDbCount: allDbIds.length,
    allDbUserIds: allDbIds,
    matchingSubsCount: subs.length
  };

  if (subs.length === 0) {
    return { success: true, pushAttempted: false, auditTrail, results: { successCount: 0, errorCount: 0 } };
  }

  const uniqueSubs = Array.from(new Map(subs.map(s => [s.subscription.endpoint, s])).values());
  
  // VAPID KEY CLEANSING (Synchronized with route.ts)
  const vapidP = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '').trim().replace(/['"]/g, '');
  const vapidPr = (process.env.VAPID_PRIVATE_KEY || '').trim().replace(/['"]/g, '').replace(/\\n/g, '\n');
  
  if (!vapidP || !vapidPr) return { success: false, error: 'VAPID missing' };
  
  let successCount = 0;
  for (const subData of uniqueSubs) {
    try {
      await sendNotification(subData.subscription, JSON.stringify({ title: 'Test-Zustellung', body: `Erfolgreich um ${new Date().toLocaleTimeString()}!`, icon: '/icon.png' }), vapidPr, vapidP);
      successCount++;
    } catch (e) { console.error(`[PUSH] Error:`, e); }
  }
  return { success: true, count: successCount, auditTrail };
}

export async function testSinglePushAction(subscriptionJson: string) {
  try {
    const subscription = JSON.parse(subscriptionJson);
    const vapidP = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '').trim().replace(/['"]/g, '');
    const vapidPr = (process.env.VAPID_PRIVATE_KEY || '').trim().replace(/['"]/g, '').replace(/\\n/g, '\n');
    if (!vapidP || !vapidPr) throw new Error('VAPID missing');
    await sendNotification(subscription, JSON.stringify({ title: 'Einzel-Test 🎯', body: 'Nur für dieses Gerät.', badgeCount: 1, vibrate: [200, 100, 200] }), vapidPr, vapidP);
    return { success: true };
  } catch (err: any) { return { success: false, error: err.message }; }
}

export async function testContactPushAction() {
  const db = await getDbData();
  const adminIds = db.members.filter((m: any) => m.role === 'admin' || m.role === 'board').map((m: any) => m.id);
  
  const subs = (db.push_subscriptions || []).filter((s: any) => {
    const sId = s.userId || s.user_id;
    return adminIds.includes(sId);
  });

  const auditTrail = {
    targetRoles: ['admin', 'board'],
    adminIdsFound: adminIds,
    totalSubsInDb: (db.push_subscriptions || []).length,
    matchingAdminSubs: subs.length
  };

  if (subs.length === 0) {
    return { success: true, pushAttempted: false, auditTrail, results: { successCount: 0, errorCount: 0 } };
  }

  const unreadCount = db.messages.filter((m: any) => m.status === 'new').length;
  const vapidP = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '').trim().replace(/['"]/g, '');
  const vapidPr = (process.env.VAPID_PRIVATE_KEY || '').trim().replace(/['"]/g, '').replace(/\\n/g, '\n');
  if (!vapidP || !vapidPr) return { success: false, error: 'VAPID missing' };

  let count = 0;
  for (const sub of subs) {
    try {
      await sendNotification(sub.subscription, JSON.stringify({ title: 'Max Mustermann (vom FMSC Kontaktformular)', body: 'E-Mail: max@mustermann.de\nBetreff: Hilfe\n\nHallo!', url: '/dashboard?tab=nachrichten', badgeCount: unreadCount || 1, vibrate: [200, 100, 200, 100, 200], tag: 'contact-form-message', icon: '/icon.png' }), vapidPr, vapidP);
      count++;
    } catch (e) { console.error(e); }
  }
  return { success: true, count, auditTrail };
}

export async function verifySubscriptionAction(endpoint: string) {
  const db = await getDbData();
  return { success: true, exists: db.push_subscriptions?.some((s: any) => s.subscription?.endpoint === endpoint) };
}
