import { getDbData } from '@/lib/db';
import ArchiveClient from './ArchiveClient';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const data = await getDbData();
  const docs = data.archiv_docs || [];
  const milestones = data.archiv_milestones || [];
  
  return <ArchiveClient docs={docs} milestones={milestones} />;
}
