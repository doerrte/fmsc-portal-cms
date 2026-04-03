import React from 'react';
import { getDbData } from '@/lib/db';
import MessagesClient from './MessagesClient';

export default async function AdminMessagesPage() {
  const data = await getDbData();
  
  return (
    <div className="admin-container">
      <MessagesClient initialMessages={data.messages || []} />
    </div>
  );
}
