'use client';

import { Check, RotateCcw } from 'lucide-react';
import { Category, Task } from '@/types';
import { useJarvisStore } from '@/store/jarvis-store';

export function TaskItem({ task, category, rank, score }: { task: Task; category?: Category; rank?: number; score?: number }) {
  const toggleTask = useJarvisStore((state) => state.toggleTask);

  return (
    <div className="jarvis-card flex items-center gap-3 p-3">
      {rank ? <span className="w-7 font-display text-2xl font-bold text-accent">{rank}</span> : null}
      <button
        onClick={() => toggleTask(task.id)}
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-md border transition ${
          task.done ? 'pulse-check border-[var(--accent3)] text-accent3' : 'border-[var(--border2)] text-muted hover:text-accent'
        }`}
        aria-label={task.done ? 'Undo task' : 'Complete task'}
      >
        {task.done ? <RotateCcw size={17} /> : <Check size={18} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`${task.done ? 'text-muted line-through' : 'text-jarvisText'} text-sm font-semibold`}>{task.text}</p>
        <p className="mt-1 font-mono text-xs text-muted">
          {category?.label ?? task.categoryId} / impact {task.impact} / {task.type}
          {score ? ` / score ${score}` : ''}
        </p>
      </div>
    </div>
  );
}
