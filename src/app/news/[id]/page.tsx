import { getDbData } from '@/lib/db';
import NewsDetailClient from './NewsDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDbData();
  const newsItem = data.news.find((n: any) => n.id === id);
  const otherNews = data.news.filter((n: any) => n.id !== id).slice(0, 3);

  if (!newsItem) {
    notFound();
  }

  return <NewsDetailClient item={newsItem} relatedNews={otherNews} />;
}
