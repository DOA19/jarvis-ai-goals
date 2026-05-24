import { BrainDumpResponse, CategoryId, TaskType } from '@/types';

const categories: CategoryId[] = ['medicine', 'acting', 'school', 'fitness', 'fun'];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function heuristicBrainDump(text: string): BrainDumpResponse {
  const lower = text.toLowerCase();
  const completed: BrainDumpResponse['tasks_completed'] = [];
  const add: BrainDumpResponse['tasks_to_add'] = [];
  const updates: BrainDumpResponse['category_updates'] = {};
  const urgency: BrainDumpResponse['urgency_flags'] = [];
  let top: CategoryId | null = null;
  let reason: string | null = null;

  if (includesAny(lower, ['mcat', 'mom'])) {
    completed.push({ text: 'Talk to Mom about MCAT summer plan', category: 'medicine' });
    updates.medicine = { next_action: 'MCAT uncertainty is clearer. Keep PCT access and shadowing outreach moving.' };
    top = 'medicine';
  }
  if (includesAny(lower, ['pct', 'follow up', 'follow-up'])) {
    urgency.push({ category: 'medicine', message: 'PCT access still needs a direct follow-up.' });
    updates.medicine = { next_action: 'Send the PCT access follow-up email before it gets stale.' };
    top = 'medicine';
    reason = 'PCT access is still an unresolved unlock.';
  }
  if (includesAny(lower, ['john', 'athena', 'headshot', 'photographer'])) {
    completed.push({ text: 'DM John or Athena about headshot photographer', category: 'acting' });
    updates.acting = { next_action: 'Convert the headshot lead into a booked session.' };
    top = 'acting';
    reason = 'A warm headshot lead is available and should be acted on quickly.';
  }
  const nameMatch = text.match(/(?:named|name is|called)\s+([A-Z][a-z]+)/);
  if (nameMatch && includesAny(lower, ['headshot', 'photographer'])) {
    add.push({
      text: `DM ${nameMatch[1]} about headshot session booking`,
      category: 'acting',
      impact: 5,
      type: 'unlock',
      due_phase: 2
    });
  }
  if (includesAny(lower, ['planet fitness', 'gym', 'workout', 'worked out'])) {
    updates.fitness = { next_action: 'Keep the workout rhythm alive with three blocked sessions this week.' };
    if (includesAny(lower, ['twice', '2x', 'three', '3x', 'picked', 'primary'])) {
      completed.push({ text: 'Pick your primary gym (Planet Fitness or 24 Hour)', category: 'fitness' });
    }
  }
  if (includesAny(lower, ['capstone', 'biochem', 'tejas', 'ai paper'])) {
    updates.school = { next_action: 'Turn the school thread into one concrete deliverable this week.' };
    if (includesAny(lower, ['mom', 'scope'])) completed.push({ text: 'Talk to Mom about capstone scope', category: 'school' });
  }
  if (includesAny(lower, ['six flags', 'concert', 'friends', 'social'])) {
    updates.fun = { next_action: 'Put the social plan on the calendar with a real date.' };
  }

  if (!top) {
    const hit = categories.find((category) => lower.includes(category));
    top = hit ?? null;
  }

  const cleanSummary = text.length > 140 ? `${text.slice(0, 137).trim()}...` : text;

  return {
    summary: cleanSummary || 'No goal update detected.',
    tasks_completed: completed,
    tasks_to_add: add,
    tasks_to_update: [],
    category_updates: updates,
    milestones_completed: [],
    milestones_to_add: [],
    priority_reassessment: {
      top_priority_category: top,
      reason: reason ?? (top ? `${top} has the clearest next move from this update.` : null)
    },
    ai_message:
      completed.length || add.length
        ? 'Update parsed. I found real movement and a few next actions worth locking in now.'
        : 'I logged the update, but I did not see a definite task completion. Keep it concrete and I can update the system more aggressively.',
    urgency_flags: urgency
  };
}

export function normalizeTaskType(value: string): TaskType {
  const allowed: TaskType[] = ['uncertainty', 'unlock', 'deadline', 'maintenance', 'optional', 'outreach', 'research'];
  return allowed.includes(value as TaskType) ? (value as TaskType) : 'maintenance';
}
