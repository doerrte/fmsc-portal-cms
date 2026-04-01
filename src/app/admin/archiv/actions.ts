'use server';

import { getDbData, saveDbData, ArchiveDoc, ArchiveMilestone } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function saveArchivDoc(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.archiv_docs = data.archiv_docs.filter(n => n.id !== id);
  } else {
    let filePath = formData.get('url') as string;
    
    // File upload handling for PDF
    const fileFile = formData.get('fileFile') as File | null;
    if (fileFile && fileFile.size > 0) {
      const uploaded = await uploadFile(fileFile);
      if (uploaded) filePath = uploaded;
    }

    // Retain old file if none uploaded during edit
    if (id && (!fileFile || fileFile.size === 0) && !filePath) {
      const existing = data.archiv_docs.find(n => n.id === id);
      if (existing) filePath = existing.url;
    }

    const docItem: ArchiveDoc = {
      id: id || Date.now().toString(),
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      type: formData.get('type') as string,
      url: filePath || '',
    };

    if (id) {
      const index = data.archiv_docs.findIndex(n => n.id === id);
      if (index > -1) {
        data.archiv_docs[index] = docItem;
      }
    } else {
      data.archiv_docs.push(docItem); // add to end
    }
  }

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/archiv');
  revalidatePath('/admin/archiv');
}

export async function saveArchivMilestone(formData: FormData) {
  const data = await getDbData();
  
  const id = formData.get('id') as string;
  const isDelete = formData.get('action') === 'delete';

  if (isDelete) {
    data.archiv_milestones = data.archiv_milestones.filter(n => n.id !== id);
  } else {
    const milestone: ArchiveMilestone = {
      id: id || Date.now().toString(),
      year: formData.get('year') as string,
      text: formData.get('text') as string,
    };

    if (id) {
      const index = data.archiv_milestones.findIndex(n => n.id === id);
      if (index > -1) {
        data.archiv_milestones[index] = milestone;
      }
    } else {
      data.archiv_milestones.push(milestone);
    }
  }

  // Sort milestones descending by year
  data.archiv_milestones.sort((a, b) => parseInt(b.year) - parseInt(a.year));

  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/archiv');
  revalidatePath('/admin/archiv');
}
