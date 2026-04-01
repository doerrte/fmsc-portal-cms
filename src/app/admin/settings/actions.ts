'use server';

import { getDbData, saveDbData, Settings } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/lib/upload';

export async function saveSettings(formData: FormData) {
  const data = await getDbData();
  
  const heroFile = formData.get('homepageHeroImage') as File | null;
  const teaserFile = formData.get('homepageTeaserImage') as File | null;
  
  let heroPath = data.settings?.homepageHeroImage;
  let teaserPath = data.settings?.homepageTeaserImage;

  if (heroFile && heroFile.size > 0) {
    const uploaded = await uploadFile(heroFile);
    if (uploaded) heroPath = uploaded;
  }

  if (teaserFile && teaserFile.size > 0) {
    const uploaded = await uploadFile(teaserFile);
    if (uploaded) teaserPath = uploaded;
  }

  const settings: Settings = {
    homepageHeroTitle: formData.get('homepageHeroTitle') as string,
    homepageHeroSubtitle: formData.get('homepageHeroSubtitle') as string,
    homepageTeaserTitle: formData.get('homepageTeaserTitle') as string,
    homepageTeaserSubtitle: formData.get('homepageTeaserSubtitle') as string,
    homepageHeroImage: heroPath,
    homepageTeaserImage: teaserPath,
  };

  data.settings = settings;
  await saveDbData(data);
  revalidatePath('/');
  revalidatePath('/admin/settings');
}
