import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/db';

export async function GET() {
  const data = await getDbData();
  return NextResponse.json(data.about || { historyText1: '', historyText2: '' });
}
