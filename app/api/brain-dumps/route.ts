import { NextResponse } from 'next/server';
import { createBrainDumpRecord, loadBrainDumps } from '@/lib/supabase-data';
import { BrainDumpResponse } from '@/types';

export async function GET() {
  try {
    return NextResponse.json(await loadBrainDumps());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load brain dumps' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      rawText?: string;
      aiResponse?: BrainDumpResponse;
      changesMade?: Record<string, unknown>;
    };
    if (!body.rawText || !body.aiResponse) {
      return NextResponse.json({ error: 'Missing brain dump fields' }, { status: 400 });
    }
    return NextResponse.json(await createBrainDumpRecord(body.rawText, body.aiResponse, body.changesMade ?? {}), {
      status: 201
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create brain dump' }, { status: 500 });
  }
}