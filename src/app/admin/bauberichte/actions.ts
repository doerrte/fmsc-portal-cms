'use server';

import { getDbData, saveDbData, BauberichtItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function saveBaubericht(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.bauberichte = data.bauberichte.filter(n => n.id !== id);
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

    let images = existingItem?.images || [];
    if (formData.get('clearImages') === 'true') {
      images = [];
    }

    const imageFiles = formData.getAll('imageFiles') as File[];
    const validImages = imageFiles.filter(f => f && f.size > 0 && f.name !== 'undefined');
    if (validImages.length > 0) {
      const urls = await Promise.all(validImages.map(f => uploadFile(f)));
      const successfulUrls = urls.filter(u => u !== null) as string[];
      images = [...images, ...successfulUrls];
    }

    const bauberichtItem: BauberichtItem = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      pilot: formData.get('pilot') as string,
      status: formData.get('status') as string,
      progress: parseInt(formData.get('progress') as string) || 0,
      date: formData.get('date') as string,
      desc: formData.get('desc') as string,
      tech: formData.get('tech') as string,
      pdfUrl,
      images,
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
