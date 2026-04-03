'use server';

import { getDbData, saveDbData } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteMessage(id: string) {
  const data = await getDbData();
  data.messages = data.messages.filter(m => m.id !== id);
  await saveDbData(data);
  revalidatePath('/admin/messages');
}

export async function updateMessageStatus(id: string, status: 'new' | 'read' | 'replied') {
  const data = await getDbData();
  const index = data.messages.findIndex(m => m.id === id);
  if (index > -1) {
    data.messages[index].status = status;
    await saveDbData(data);
    revalidatePath('/admin/messages');
  }
}
