import { getDbData } from '@/lib/db';
import MembersClient from './MembersClient';

export default async function MembersPage() {
  const db = await getDbData();
  const members = db.members || [];

  return <MembersClient initialMembers={members} />;
}
