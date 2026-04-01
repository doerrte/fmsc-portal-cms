import { getDbData } from '@/lib/db';
import NewsClient from './NewsClient';

export const dynamic = 'force-dynamic';

export default async function NewsPageServer() {
  const data = await getDbData();
  return <NewsClient news={data.news} />;
}
