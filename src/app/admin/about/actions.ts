'use server';

import { getDbData, saveDbData } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveAboutSettings(formData: FormData) {
  const data = await getDbData();
  
  data.about = {
    historyText1: formData.get('historyText1') as string,
    historyText2: formData.get('historyText2') as string,
  };

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/admin/about');
}
