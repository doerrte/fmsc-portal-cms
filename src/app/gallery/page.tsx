import { getDbData } from '@/lib/db';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const data = await getDbData();
  const gallery = data.gallery || [];
  
  return <GalleryClient items={gallery} />;
}
