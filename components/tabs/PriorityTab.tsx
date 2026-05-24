'use client';

import { CheckCircle2 } from 'lucide-react';
import { TaskItem } from '@/components/ui/TaskItem';
import { getCurrentPhase } from '@/lib/phase-calculator';
import { explainPriority, getPriorityQueue } from '@/lib/priority-engine';
import { useJarvisStore } from '@/store/jarvis-store';

export function PriorityTab() {
  const categories = useJarvisStore((state) => state.categories);
  const tasks = useJarvisStore((state) => state.tasks);
  const toggleTask = useJarvisStore((state) => state.toggleTask);
  const phase = getCurrentPhase();
  const queue = getPriorityQueue(tasks, phase.index);
  const hero = queue[0]?.task;
  const heroCategory = categories.find((category) => category.id === hero?.categoryId);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_0.9fr]">
      <div className="space-y-5">
        {hero && (
          <section className="jarvis-panel rounded-lg p-5">
            <p className="scan-label mb-2 text-sm">// TODAY'S #1 TASK</p>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-sm" style={{ color: heroCategory?.accentColor }}>
                  {heroCategory?.label}
                </p>
                <h2 className="mt-1 font-display text-4xl font-bold leading-tight text-white">{hero.text}</h2>
                <p className="mt-3 max-w-2xl text-sm text-muted">{explainPriority(hero)}</p>
              </div>
              <button
                onClick={() => toggleTask(hero.id)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--accent3)] px-4 py-3 font-mono text-sm text-accent3"
              >
                <CheckCircle2 size={18} />
                MARK COMPLETE
              </button>
            </div>
          </section>
        )}

        <section>
          <p className="scan-label mb-3 text-sm">// PRIORITY QUEUE</p>
          <div className="grid gap-3">
            {queue.map(({ task, score }, index) => (
              <TaskItem
                key={task.id}
                task={task}
                score={score}
                rank={index + 1}
                category={categories.find((category) => category.id === task.categoryId)}
              />
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <Panel title="// TODAY'S LOGIC">
          <ol className="space-y-2 text-sm text-muted">
            <li>1. Remove uncertainty first.</li>
            <li>2. Prioritize unlocks over maintenance.</li>
            <li>3. Handle deadlines before optional wins.</li>
            <li>4. Keep workouts consistent, not heroic.</li>
            <li>5. End the day with one visible artifact.</li>
          </ol>
        </Panel>
        <Panel title="// CURRENT PHASE FOCUS">
          <p className="font-display text-2xl font-bold text-white">{phase.name}</p>
          <p className="mt-2 text-sm text-muted">{phase.focus}</p>
        </Panel>
      </aside>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="jarvis-card p-4">
      <p className="scan-label mb-3 text-sm">{title}</p>
      {children}
    </section>
  );
}
