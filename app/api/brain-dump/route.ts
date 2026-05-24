import { NextResponse } from 'next/server';
import { BRAIN_DUMP_SYSTEM_PROMPT } from '@/lib/ai-prompts';
import { extractAIContent, callAI } from '@/lib/openrouter';
import { heuristicBrainDump } from '@/lib/local-ai';
import { BrainDumpResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const { text } = (await request.json()) as { text?: string };
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Missing brain dump text' }, { status: 400 });
    }

    try {
      const payload = await callAI(BRAIN_DUMP_SYSTEM_PROMPT, text, true);
      const content = extractAIContent(payload);
      const parsed = JSON.parse(content) as BrainDumpResponse;
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(heuristicBrainDump(text));
    }
  } catch {
    return NextResponse.json({ error: 'Systems temporarily offline. Try again in a moment.' }, { status: 500 });
  }
}
