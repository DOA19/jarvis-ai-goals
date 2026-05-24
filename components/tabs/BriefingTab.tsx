'use client';

import { GoalCard } from '@/components/ui/GoalCard';
import { TaskItem } from '@/components/ui/TaskItem';
import { getCurrentPhase } from '@/lib/phase-calculator';
import { getPriorityQueue } from '@/lib/priority-engine';
import { useJarvisStore } from '@/store/jarvis-store';

export function BriefingTab() {
  const categories = useJarvisStore((state) => state.categories);
  const tasks = useJarvisStore((state) => state.tasks);
  const phase = getCurrentPhase();
  const queue = getPriorityQueue(tasks, phase.index).slice(0, 6);

  return (
    <div className="space-y-6">
      <section>
        <p className="scan-label mb-3 text-sm">// FIVE PILLARS</p>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <GoalCard key={category.id} category={category} tasks={tasks} />
          ))}
        </div>
      </section>

      <section>
        <p className="scan-label mb-3 text-sm">// TODAY'S PRIORITIZED ACTION LIST</p>
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
  );
}
