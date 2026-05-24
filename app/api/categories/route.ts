import { NextResponse } from 'next/server';
import { categoriesSeed } from '@/lib/seed-data';

export async function GET() {
  return NextResponse.json(categoriesSeed);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return NextResponse.json(body);
}
