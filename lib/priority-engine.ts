import { CategoryId, Task } from '@/types';

export function scoreTask(task: Task, categoryId: CategoryId, phaseIndex: number): number {
  let score = task.impact * 10;

  const typeBonus: Record<string, number> = {
    uncertainty: 20,
    unlock: 16,
    deadline: 14,
    outreach: 10,
    research: 6,
    maintenance: 6,
    optional: -8
  };
  score += typeBonus[task.type] ?? 0;

  if (task.duePhase <= phaseIndex + 1) score += 15;

  const phaseBoosts: Record<number, CategoryId[]> = {
    0: ['medicine', 'school', 'acting'],
    1: ['medicine', 'acting', 'fitness', 'fun'],
    2: ['school', 'medicine', 'acting'],
    3: ['school', 'medicine', 'fitness'],
    4: ['school', 'medicine']
  };
  if (phaseBoosts[phaseIndex]?.includes(categoryId)) score += 10;

  return score;
}

export function getPriorityQueue(tasks: Task[], phaseIndex: number) {
  return tasks
    .filter((task) => !task.done)
    .map((task) => ({ task, score: scoreTask(task, task.categoryId, phaseIndex) }))
    .sort((a, b) => b.score - a.score);
}

export function explainPriority(task: Task): string {
  const typeReason: Record<string, string> = {
    uncertainty: 'it removes uncertainty and makes the next move obvious',
    unlock: 'it unlocks progress that depends on this being done',
    deadline: 'it has time pressure attached',
    outreach: 'first contact creates momentum',
    research: 'it turns a vague goal into a concrete option set',
    maintenance: 'it keeps the system from drifting',
    optional: 'it is useful, but lower leverage than the core blockers'
  };
  return `This is first because ${typeReason[task.type] ?? 'it has the strongest score'} and carries impact ${task.impact}/5.`;
}
