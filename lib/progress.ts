import { CategoryId, Task } from '@/types';

export function getCategoryProgress(tasks: Task[], categoryId: CategoryId) {
  const categoryTasks = tasks.filter((task) => task.categoryId === categoryId);
  if (!categoryTasks.length) return 0;
  return Math.round((categoryTasks.filter((task) => task.done).length / categoryTasks.length) * 100);
}

export function getOverallProgress(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100);
}

export function getStatusFromProgress(progress: number) {
  if (progress >= 100) return 'COMPLETE';
  if (progress >= 35) return 'IN PROGRESS';
  return 'INITIATE';
}
