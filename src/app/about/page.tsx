import { getDbData } from '@/lib/db';
import AboutClient from './AboutClient';

export default async function AboutPage() {
  const data = await getDbData();
  return <AboutClient about={data.about} />;
}
