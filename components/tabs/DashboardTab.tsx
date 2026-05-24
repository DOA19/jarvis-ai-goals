'use client';

import { Copy } from 'lucide-react';
import { TaskItem } from '@/components/ui/TaskItem';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getCategoryProgress, getOverallProgress } from '@/lib/progress';
import { useJarvisStore } from '@/store/jarvis-store';

export function DashboardTab() {
  const categories = useJarvisStore((state) => state.categories);
  const tasks = useJarvisStore((state) => state.tasks);
  const addToast = useJarvisStore((state) => state.addToast);
  const overall = getOverallProgress(tasks);

  async function exportDashboard() {
    const text = [
      `J.A.R.V.I.S. Dashboard - ${new Date().toLocaleDateString()}`,
      `Overall progress: ${overall}%`,
      ...categories.map((category) => `${category.label}: ${getCategoryProgress(tasks, category.id)}% - ${category.nextAction}`)
    ].join('\n');
    await navigator.clipboard.writeText(text);
    addToast('Dashboard copied', 'success');
  }

  return (
    <div className="space-y-6">
      <section className="jarvis-panel rounded-lg p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="scan-label text-sm">// TOTAL SYSTEM PROGRESS</p>
            <h2 className="font-display text-5xl font-bold text-white">{overall}%</h2>
          </div>
          <button onClick={exportDashboard} className="flex items-center gap-2 rounded-md border border-[var(--border2)] px-4 py-3 font-mono text-sm text-accent">
            <Copy size={16} />
            EXPORT
          </button>
        </div>
        <ProgressBar value={overall} color="var(--accent3)" />
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {categories.map((category) => {
          const progress = getCategoryProgress(tasks, category.id);
          return (
            <article key={category.id} className="jarvis-card p-4">
              <p className="text-2xl">{category.emoji}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{progress}%</h3>
              <p className="font-mono text-xs text-muted">{category.label}</p>
            </article>
          );
        })}
      </section>

      <section>
        <p className="scan-label mb-3 text-sm">// FULL TASK CHECKLIST</p>
        <div className="grid gap-5 lg:grid-cols-2">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-white">{category.label}</h3>
              {tasks
                .filter((task) => task.categoryId === category.id)
                .map((task) => (
                  <TaskItem key={task.id} task={task} category={category} />
                ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
