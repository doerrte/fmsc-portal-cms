'use server';

import { getDbData, saveDbData, BauberichtItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function saveBaubericht(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';
  const isDeleteUpdate = formData.get('action') === 'deleteUpdate';

  if (isDelete) {
    data.bauberichte = data.bauberichte.filter(n => n.id !== id);
  } else if (isDeleteUpdate) {
    const updateId = formData.get('updateId') as string;
    const existingItem = data.bauberichte.find(n => n.id === id);
    if (existingItem && existingItem.updates) {
      existingItem.updates = existingItem.updates.filter(u => u.id !== updateId);
    }
  } else {
    let existingItem: BauberichtItem | undefined;
    if (id) {
      const index = data.bauberichte.findIndex(n => n.id === id);
      if (index > -1) {
        existingItem = data.bauberichte[index];
      }
    }

    let pdfUrl = existingItem?.pdfUrl;
    const pdfFile = formData.get('pdfFile') as File | null;
    if (pdfFile && pdfFile.size > 0 && pdfFile.name !== 'undefined') {
      const uploaded = await uploadFile(pdfFile);
      if (uploaded) pdfUrl = uploaded;
    }

    let updates = existingItem?.updates || [];

    const newUpdateText = formData.get('newUpdateText') as string;
    if (newUpdateText) {
      const date = new Date().toISOString().split('T')[0];
      const imageFiles = formData.getAll('imageFiles') as File[];
      const validImages = imageFiles.filter(f => f && f.size > 0 && f.name !== 'undefined');
      let images: string[] = [];
      if (validImages.length > 0) {
        const urls = await Promise.all(validImages.map(f => uploadFile(f)));
        images = urls.filter(u => u !== null) as string[];
      }

      updates.unshift({ // Add newest to the top
        id: Date.now().toString(),
        date: date,
        text: newUpdateText,
        images: images,
      });
    }

    const bauberichtItem: BauberichtItem = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      pilot: formData.get('pilot') as string,
      status: formData.get('status') as string,
      progress: parseInt(formData.get('progress') as string) || 0,
      date: existingItem?.date || formData.get('date') as string,
      desc: existingItem?.desc,
      tech: formData.get('tech') as string,
      pdfUrl,
      images: existingItem?.images,
      updates,
    };

    if (id && existingItem) {
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
