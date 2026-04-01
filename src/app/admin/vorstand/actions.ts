'use server';

import { getDbData, saveDbData, VorstandItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveVorstand(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.vorstand = data.vorstand.filter(v => v.id !== id);
  } else {
    const item: VorstandItem = {
      id: id || Date.now().toString(),
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      desc: formData.get('desc') as string || '',
      type: formData.get('type') as string,
    };

    if (id) {
      const index = data.vorstand.findIndex(v => v.id === id);
      if (index > -1) data.vorstand[index] = item;
    } else {
      data.vorstand.push(item);
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/vorstand');
  revalidatePath('/admin/vorstand');
}
