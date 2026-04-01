'use server';

import { getDbData, saveDbData, NewsItem } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function saveNews(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.news = data.news.filter(n => n.id !== id);
  } else {
    let imagePath = '';
    if (id) {
      const existing = data.news.find(n => n.id === id);
      if (existing && existing.image) imagePath = existing.image;
    }

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploaded = await uploadFile(imageFile);
      if (uploaded) imagePath = uploaded;
    }

    const newsItem: NewsItem = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      tag: formData.get('tag') as string,
      location: formData.get('location') as string,
      content: formData.get('content') as string,
      image: imagePath,
    };

    if (id) {
      // Edit
      const index = data.news.findIndex(n => n.id === id);
      if (index > -1) {
        data.news[index] = newsItem;
      }
    } else {
      // Create new
      data.news.unshift(newsItem);
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath('/admin/news');
}
