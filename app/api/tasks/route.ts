import { NextResponse } from 'next/server';
import { createTask, loadTasks, updateTask } from '@/lib/supabase-data';

export async function GET() {
  try {
    return NextResponse.json(await loadTasks());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      categoryId?: string;
      text?: string;
      done?: boolean;
      impact?: number;
      type?: 'uncertainty' | 'unlock' | 'deadline' | 'maintenance' | 'optional' | 'outreach' | 'research';
      duePhase?: number;
      aiGenerated?: boolean;
    };
    if (!body.categoryId || !body.text) {
      return NextResponse.json({ error: 'Missing task fields' }, { status: 400 });
    }
    return NextResponse.json(
      await createTask({
        categoryId: body.categoryId as never,
        text: body.text,
        done: body.done ?? false,
        impact: body.impact ?? 3,
        type: body.type ?? 'maintenance',
        duePhase: body.duePhase ?? 2,
        aiGenerated: body.aiGenerated ?? false
      }),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create task' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      done?: boolean;
      completedAt?: string | null;
      categoryId?: string;
      text?: string;
      impact?: number;
      type?: 'uncertainty' | 'unlock' | 'deadline' | 'maintenance' | 'optional' | 'outreach' | 'research';
      duePhase?: number;
      aiGenerated?: boolean;
      updatedAt?: string;
    };
    if (!body.id) return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
    return NextResponse.json(
      await updateTask(body.id, {
        done: body.done,
        completedAt: body.completedAt,
        categoryId: body.categoryId as never,
        text: body.text,
        impact: body.impact,
        type: body.type,
        duePhase: body.duePhase,
        aiGenerated: body.aiGenerated,
        updatedAt: body.updatedAt
      })
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update task' }, { status: 500 });
  }
}
