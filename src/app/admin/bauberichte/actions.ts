'use server';

import { getDbData, saveDbData, BauberichtItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveBaubericht(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.bauberichte = data.bauberichte.filter(n => n.id !== id);
  } else {
    const bauberichtItem: BauberichtItem = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      pilot: formData.get('pilot') as string,
      status: formData.get('status') as string,
      progress: parseInt(formData.get('progress') as string) || 0,
      date: formData.get('date') as string,
      desc: formData.get('desc') as string,
      tech: formData.get('tech') as string,
    };

    if (id) {
      const index = data.bauberichte.findIndex(n => n.id === id);
      if (index > -1) {
        data.bauberichte[index] = bauberichtItem;
      }
    } else {
      data.bauberichte.unshift(bauberichtItem);
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/bauberichte');
  revalidatePath('/admin/bauberichte');
}
