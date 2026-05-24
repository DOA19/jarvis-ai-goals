import { NextResponse } from 'next/server';
import { CHAT_SYSTEM_PROMPT } from '@/lib/ai-prompts';
import { extractAIContent, callAI } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    const { message, context } = (await request.json()) as { message?: string; context?: string };
    if (!message?.trim()) return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    const prompt = CHAT_SYSTEM_PROMPT.replace('{{USER_CONTEXT}}', context ?? 'No context supplied.');

    try {
      const payload = await callAI(prompt, message, false);
      const content = extractAIContent(payload);
      return NextResponse.json({
        content:
          content ||
          "Systems online. I need a little more context, but the next move is simple: pick the highest-impact incomplete task and finish the first 10 minutes now."
      });
    } catch (error) {
      const details = error instanceof Error ? error.message : 'Unknown OpenRouter failure';
      return NextResponse.json({
        content: `OpenRouter is configured, but the request failed: ${details}`
      });
    }
  } catch {
    return NextResponse.json({ error: 'Systems temporarily offline. Try again in a moment.' }, { status: 500 });
  }
}
