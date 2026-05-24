import { NextResponse } from 'next/server';
import { applyBrainDumpResponse } from '@/lib/supabase-data';
import { BrainDumpResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { rawText?: string; response?: BrainDumpResponse };
    if (!body.rawText || !body.response) {
      return NextResponse.json({ error: 'Missing apply payload' }, { status: 400 });
    }
    return NextResponse.json(await applyBrainDumpResponse(body.rawText, body.response));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to apply brain dump' }, { status: 500 });
  }
}