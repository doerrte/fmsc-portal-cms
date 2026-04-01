'use server';

import { getDbData, saveDbData, InfoSafetyRule, InfoDocItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function saveInfoGeneral(formData: FormData) {
  const data = await getDbData();
  
  if (!data.info) data.info = { safetyRules: [], guestRules: "", guestWarning: "", docs: [] };
  
  data.info.guestRules = formData.get('guestRules') as string || '';
  data.info.guestWarning = formData.get('guestWarning') as string || '';

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/info');
  revalidatePath('/admin/info');
}

export async function saveInfoSafetyRule(formData: FormData) {
  const data = await getDbData();
  if (!data.info) data.info = { safetyRules: [], guestRules: "", guestWarning: "", docs: [] };
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.info.safetyRules = data.info.safetyRules.filter(n => n.id !== id);
  } else {
    const item: InfoSafetyRule = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      desc: formData.get('desc') as string,
      icon: formData.get('icon') as string,
    };

    if (id) {
      const index = data.info.safetyRules.findIndex(n => n.id === id);
      if (index > -1) data.info.safetyRules[index] = item;
    } else {
      data.info.safetyRules.push(item);
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/info');
  revalidatePath('/admin/info');
}

export async function saveInfoDoc(formData: FormData) {
  const data = await getDbData();
  if (!data.info) data.info = { safetyRules: [], guestRules: "", guestWarning: "", docs: [] };
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.info.docs = data.info.docs.filter(n => n.id !== id);
  } else {
    let filePath = formData.get('url') as string;
    
    // File upload handling for PDF
    const fileFile = formData.get('fileFile') as File | null;
    let sizeInfo = formData.get('sizeInfo') as string || '0 MB';

    if (fileFile && fileFile.size > 0) {
      const uploaded = await uploadFile(fileFile);
      if (uploaded) {
        filePath = uploaded;
        sizeInfo = (fileFile.size / (1024 * 1024)).toFixed(1) + ' MB';
      }
    }

    if (id && (!fileFile || fileFile.size === 0) && !filePath) {
      const existing = data.info.docs.find(n => n.id === id);
      if (existing) filePath = existing.url;
    }

    const item: InfoDocItem = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      url: filePath || '',
      sizeInfo: sizeInfo,
    };

    if (id) {
      const index = data.info.docs.findIndex(n => n.id === id);
      if (index > -1) data.info.docs[index] = item;
    } else {
      data.info.docs.push(item);
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/info');
  revalidatePath('/admin/info');
}
