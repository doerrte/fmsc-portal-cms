import { getDbData } from '@/lib/db';
import InfoClient from './InfoClient';

export const dynamic = 'force-dynamic';

export default async function InfoPage() {
  const data = await getDbData();
  const info = data.info || { safetyRules: [], guestRules: "", guestWarning: "", docs: [] };
  
  return <InfoClient info={info} />;
}
