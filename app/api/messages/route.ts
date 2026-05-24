import { NextResponse } from 'next/server';
import { clearChatMessages, createChatMessage, loadChatMessages } from '@/lib/supabase-data';

export async function GET() {
  try {
    return NextResponse.json(await loadChatMessages());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { role?: 'user' | 'assistant'; content?: string };
    if (!body.role || !body.content) return NextResponse.json({ error: 'Missing message fields' }, { status: 400 });
    return NextResponse.json(await createChatMessage({ role: body.role, content: body.content }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create message' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearChatMessages();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to clear messages' }, { status: 500 });
  }
}