'use server';

import { getDbData, saveDbData, MemberItem, hashPassword } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addMemberAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as 'admin' | 'board' | 'member';

  if (!name || !email || !password || !role) {
    return { success: false, error: 'Bitte alle Felder ausfüllen.' };
  }

  const db = await getDbData();
  
  if (db.members.find(m => m.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Diese E-Mail ist bereits registriert!' };
  }

  const newMember: MemberItem = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    passwordHash: hashPassword(password),
    role,
    createdAt: new Date().toISOString(),
    phone: phone || ''
  };

  db.members.push(newMember);
  await saveDbData(db);
  revalidatePath('/admin/members');
  return { success: true };
}

export async function updateMemberAction(formData: FormData) {
  const id = formData.get('id') as string;
  const role = formData.get('role') as 'admin' | 'board' | 'member';
  const phone = formData.get('phone') as string;
  const newPassword = formData.get('password') as string;

  const db = await getDbData();
  const index = db.members.findIndex(m => m.id === id);
  
  if (index === -1) return { success: false, error: 'Mitglied nicht gefunden' };
  
  db.members[index].role = role;
  if (phone !== undefined) {
    db.members[index].phone = phone;
  }
  
  if (newPassword && newPassword.trim().length > 0) {
    db.members[index].passwordHash = hashPassword(newPassword);
  }
  
  await saveDbData(db);
  revalidatePath('/admin/members');
  return { success: true };
}

export async function deleteMemberAction(id: string) {
  const db = await getDbData();
  db.members = db.members.filter(m => m.id !== id);
  await saveDbData(db);
  revalidatePath('/admin/members');
  return { success: true };
}
