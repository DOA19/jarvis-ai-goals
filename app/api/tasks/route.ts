import { NextResponse } from 'next/server';
import { tasksSeed } from '@/lib/seed-data';

export async function GET() {
  return NextResponse.json(tasksSeed);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ...body, id: crypto.randomUUID(), done: false }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return NextResponse.json(body);
}
