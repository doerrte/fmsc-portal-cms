import { getDbData } from '@/lib/db';
import BauberichteClient from './BauberichteClient';

export const dynamic = 'force-dynamic';

export default async function BauberichtePage() {
  const data = await getDbData();
  const bauberichte = data.bauberichte || [];
  
  return <BauberichteClient items={bauberichte} />;
}
