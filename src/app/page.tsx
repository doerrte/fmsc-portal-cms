import { getDbData } from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getDbData();
  return <HomeClient data={data} />;
}
