import { Category, Task } from '@/types';
import { getCategoryProgress, getStatusFromProgress } from '@/lib/progress';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function GoalCard({ category, tasks }: { category: Category; tasks: Task[] }) {
  const progress = getCategoryProgress(tasks, category.id);

  return (
    <article className="jarvis-card p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.emoji}</span>
          <div>
            <h3 className="font-display text-2xl font-bold text-white">{category.label}</h3>
            <p className="font-mono text-xs text-muted">{progress}% COMPLETE</p>
          </div>
        </div>
        <StatusBadge status={getStatusFromProgress(progress)} />
      </div>
      <p className="mb-4 text-sm text-muted">
        <span className="font-bold text-jarvisText">Next:</span> {category.nextAction}
      </p>
      <ProgressBar value={progress} color={category.accentColor} />
    </article>
  );
}
