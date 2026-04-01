'use server';

import { getDbData, saveDbData, EventItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveEvent(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.events = data.events.filter(e => e.id !== id);
  } else {
    const ev: EventItem = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
    };

    if (id) {
      const index = data.events.findIndex(e => e.id === id);
      if (index > -1) data.events[index] = ev;
    } else {
      data.events.push(ev);
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/events');
  revalidatePath('/admin/events');
}
