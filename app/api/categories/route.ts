import { NextResponse } from 'next/server';
import { loadCategories, updateCategoryNextAction } from '@/lib/supabase-data';

export async function GET() {
  try {
    return NextResponse.json(await loadCategories());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load categories' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; nextAction?: string | null };
    if (!body.id) return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
    return NextResponse.json(await updateCategoryNextAction(body.id as never, body.nextAction ?? null));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update category' }, { status: 500 });
  }
}
