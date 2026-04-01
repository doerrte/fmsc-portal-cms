import { getDbData } from '@/lib/db';
import EventsClient from './EventsClient';

export default async function EventsPage() {
  const data = await getDbData();
  return <EventsClient events={data.events} />;
}
