import { createServerSupabase } from '@/lib/supabase';
import { BrainDumpRecord, BrainDumpResponse, Category, CategoryId, ChatMessage, Milestone, Task } from '@/types';

type CategoryRow = {
  id: string;
  label: string;
  emoji: string;
  accent_color: string | null;
  next_action: string | null;
  updated_at: string | null;
};

type TaskRow = {
  id: string;
  category_id: string;
  text: string;
  done: boolean;
  impact: number | null;
  type: Task['type'] | null;
  due_phase: number | null;
  ai_generated: boolean | null;
  created_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
};

type MilestoneRow = {
  id: string;
  category_id: string;
  title: string;
  target_month: Milestone['targetMonth'] | string | null;
  done: boolean;
  ai_generated: boolean | null;
  created_at: string | null;
};

type BrainDumpRow = {
  id: string;
  raw_text: string;
  ai_response: BrainDumpResponse | null;
  changes_made: Record<string, unknown> | null;
  created_at: string | null;
};

type ChatMessageRow = {
  id: string;
  role: ChatMessage['role'];
  content: string;
  created_at: string | null;
};

function getSupabase() {
  const supabase = createServerSupabase();
  if (!supabase) {
    throw new Error('Supabase server key is not configured.');
  }
  return supabase;
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id as CategoryId,
    label: row.label,
    emoji: row.emoji,
    accentColor: row.accent_color ?? '#00d4ff',
    nextAction: row.next_action ?? '',
    updatedAt: row.updated_at ?? undefined
  };
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    categoryId: row.category_id as CategoryId,
    text: row.text,
    done: row.done,
    impact: row.impact ?? 3,
    type: row.type ?? 'maintenance',
    duePhase: row.due_phase ?? 2,
    aiGenerated: row.ai_generated ?? false,
    createdAt: row.created_at ?? undefined,
    completedAt: row.completed_at ?? null,
    updatedAt: row.updated_at ?? undefined
  };
}

function mapMilestone(row: MilestoneRow): Milestone {
  const targetMonth = row.target_month;
  return {
    id: row.id,
    categoryId: row.category_id as CategoryId,
    title: row.title,
    targetMonth: targetMonth === 'May' || targetMonth === 'June' || targetMonth === 'July' || targetMonth === 'August' ? targetMonth : 'June',
    done: row.done,
    aiGenerated: row.ai_generated ?? false
  };
}

function mapBrainDump(row: BrainDumpRow): BrainDumpRecord {
  return {
    id: row.id,
    rawText: row.raw_text,
    aiResponse: row.ai_response ?? {
      summary: '',
      tasks_completed: [],
      tasks_to_add: [],
      tasks_to_update: [],
      category_updates: {},
      milestones_completed: [],
      milestones_to_add: [],
      priority_reassessment: { top_priority_category: null, reason: null },
      ai_message: '',
      urgency_flags: []
    },
    changesMade: row.changes_made ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString()
  };
}

function mapChatMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at ?? new Date().toISOString()
  };
}

function isTargetMonth(value: string): value is Milestone['targetMonth'] {
  return value === 'May' || value === 'June' || value === 'July' || value === 'August';
}

function cleanTaskPatch(updates: Partial<Task>) {
  return {
    category_id: updates.categoryId,
    text: updates.text,
    done: updates.done,
    impact: updates.impact,
    type: updates.type,
    due_phase: updates.duePhase,
    ai_generated: updates.aiGenerated,
    completed_at: updates.completedAt,
    updated_at: updates.updatedAt
  };
}

export async function loadCategories() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

export async function loadTasks() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapTask);
}

export async function loadMilestones() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('milestones').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapMilestone);
}

export async function loadBrainDumps() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('brain_dumps').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBrainDump);
}

export async function loadChatMessages() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapChatMessage);
}

export async function updateCategoryNextAction(id: CategoryId, nextAction: string | null) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('categories')
    .update({ next_action: nextAction, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapCategory(data as CategoryRow);
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...cleanTaskPatch(updates), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapTask(data as TaskRow);
}

export async function createTask(task: Pick<Task, 'categoryId' | 'text' | 'done' | 'impact' | 'type' | 'duePhase' | 'aiGenerated'>) {
  const supabase = getSupabase();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      category_id: task.categoryId,
      text: task.text,
      done: task.done,
      impact: task.impact,
      type: task.type,
      due_phase: task.duePhase,
      ai_generated: task.aiGenerated,
      created_at: now,
      updated_at: now,
      completed_at: task.done ? now : null
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapTask(data as TaskRow);
}

export async function updateMilestone(id: string, updates: Partial<Milestone>) {
  const supabase = getSupabase();
  const payload: Record<string, unknown> = {};
  if (updates.categoryId !== undefined) payload.category_id = updates.categoryId;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.targetMonth !== undefined) payload.target_month = updates.targetMonth;
  if (updates.done !== undefined) payload.done = updates.done;
  if (updates.aiGenerated !== undefined) payload.ai_generated = updates.aiGenerated;
  const { data, error } = await supabase.from('milestones').update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return mapMilestone(data as MilestoneRow);
}

export async function createMilestone(milestone: Pick<Milestone, 'categoryId' | 'title' | 'targetMonth' | 'done' | 'aiGenerated'>) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('milestones')
    .insert({
      category_id: milestone.categoryId,
      title: milestone.title,
      target_month: isTargetMonth(milestone.targetMonth) ? milestone.targetMonth : 'June',
      done: milestone.done,
      ai_generated: milestone.aiGenerated,
      created_at: new Date().toISOString()
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapMilestone(data as MilestoneRow);
}

export async function createChatMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      role: message.role,
      content: message.content,
      created_at: new Date().toISOString()
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapChatMessage(data as ChatMessageRow);
}

export async function clearChatMessages() {
  const supabase = getSupabase();
  const { error } = await supabase.from('chat_messages').delete().neq('id', '');
  if (error) throw error;
}

export async function createBrainDumpRecord(rawText: string, aiResponse: BrainDumpResponse, changesMade: Record<string, unknown>) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('brain_dumps')
    .insert({
      raw_text: rawText,
      ai_response: aiResponse,
      changes_made: changesMade,
      created_at: new Date().toISOString()
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapBrainDump(data as BrainDumpRow);
}

export async function applyBrainDumpResponse(rawText: string, response: BrainDumpResponse) {
  const tasks = await loadTasks();
  const now = new Date().toISOString();
  const completedTaskIds = tasks
    .filter((task) =>
      response.tasks_completed.some(
        (item) => item.id === task.id || (item.category === task.categoryId && task.text.toLowerCase().includes(item.text.toLowerCase().slice(0, 18)))
      )
    )
    .map((task) => task.id);

  for (const id of completedTaskIds) {
    await updateTask(id, { done: true, completedAt: now, updatedAt: now });
  }

  for (const item of response.tasks_to_add) {
    await createTask({
      categoryId: item.category,
      text: item.text,
      done: false,
      impact: item.impact,
      type: item.type,
      duePhase: item.due_phase,
      aiGenerated: true
    });
  }

  const categoryUpdates = Object.entries(response.category_updates);
  for (const [id, update] of categoryUpdates) {
    if (update?.next_action !== undefined) {
      await updateCategoryNextAction(id as CategoryId, update.next_action);
    }
  }

  for (const item of response.milestones_to_add) {
    await createMilestone({
      categoryId: item.category,
      title: item.title,
      targetMonth: isTargetMonth(item.target_month) ? item.target_month : 'June',
      done: false,
      aiGenerated: true
    });
  }

  const changesMade = {
    completed: completedTaskIds.length,
    added: response.tasks_to_add.length,
    categoryUpdates: categoryUpdates.length,
    milestonesAdded: response.milestones_to_add.length
  };

  await createBrainDumpRecord(rawText, response, changesMade);
  return changesMade;
}