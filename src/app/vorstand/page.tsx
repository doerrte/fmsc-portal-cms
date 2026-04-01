import { getDbData } from '@/lib/db';
import VorstandClient from './VorstandClient';

export default async function VorstandPage() {
  const data = await getDbData();
  return <VorstandClient vorstand={data.vorstand} />;
}
