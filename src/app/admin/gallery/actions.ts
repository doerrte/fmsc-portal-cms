'use server';

import { getDbData, saveDbData, GalleryItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function saveGallery(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.gallery = data.gallery.filter(n => n.id !== id);
  } else {
    let imagePath = formData.get('url') as string;
    
    // File upload handling for images
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploaded = await uploadFile(imageFile);
      if (uploaded) imagePath = uploaded;
    }

    // Retain old image if none uploaded during edit
    if (id && (!imageFile || imageFile.size === 0) && !imagePath) {
      const existing = data.gallery.find(n => n.id === id);
      if (existing) imagePath = existing.url;
    }

    let vidUrl = formData.get('videoUrl') as string;
    const videoFile = formData.get('videoFile') as File | null;
    if (videoFile && videoFile.size > 0) {
      const uploadedVid = await uploadFile(videoFile);
      if (uploadedVid) vidUrl = uploadedVid;
    }

    if (id && (!videoFile || videoFile.size === 0) && !vidUrl) {
      const existing = data.gallery.find(n => n.id === id);
      if (existing && existing.videoUrl) vidUrl = existing.videoUrl;
    }

    const type = formData.get('type') as 'image' | 'video';

    const galleryItem: GalleryItem = {
      id: id || Date.now().toString(),
      type,
      category: formData.get('category') as string,
      title: formData.get('title') as string,
      url: imagePath || '',
      date: formData.get('date') as string,
      videoUrl: vidUrl,
    };

    if (id) {
      const index = data.gallery.findIndex(n => n.id === id);
      if (index > -1) {
        data.gallery[index] = galleryItem;
      }
    } else {
      data.gallery.unshift(galleryItem);
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/gallery');
  revalidatePath('/admin/gallery');
}
