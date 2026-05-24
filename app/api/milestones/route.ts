import { NextResponse } from 'next/server';
import { createMilestone, loadMilestones, updateMilestone } from '@/lib/supabase-data';

export async function GET() {
  try {
    return NextResponse.json(await loadMilestones());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load milestones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      categoryId?: string;
      title?: string;
      targetMonth?: 'May' | 'June' | 'July' | 'August';
      done?: boolean;
      aiGenerated?: boolean;
    };
    if (!body.categoryId || !body.title) {
      return NextResponse.json({ error: 'Missing milestone fields' }, { status: 400 });
    }
    return NextResponse.json(
      await createMilestone({
        categoryId: body.categoryId as never,
        title: body.title,
        targetMonth: body.targetMonth ?? 'June',
        done: body.done ?? false,
        aiGenerated: body.aiGenerated ?? false
      }),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create milestone' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      categoryId?: string;
      title?: string;
      targetMonth?: 'May' | 'June' | 'July' | 'August';
      done?: boolean;
      aiGenerated?: boolean;
    };
    if (!body.id) return NextResponse.json({ error: 'Missing milestone id' }, { status: 400 });
    return NextResponse.json(
      await updateMilestone(body.id, {
        categoryId: body.categoryId as never,
        title: body.title,
        targetMonth: body.targetMonth,
        done: body.done,
        aiGenerated: body.aiGenerated
      })
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update milestone' }, { status: 500 });
  }
}