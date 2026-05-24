'use client';

import { Check } from 'lucide-react';
import { PHASES } from '@/lib/phase-calculator';
import { useJarvisStore } from '@/store/jarvis-store';

const months = ['May', 'June', 'July', 'August'] as const;

export function RoadmapTab() {
  const milestones = useJarvisStore((state) => state.milestones);
  const categories = useJarvisStore((state) => state.categories);
  const toggleMilestone = useJarvisStore((state) => state.toggleMilestone);

  return (
    <div className="space-y-5">
      <section className="jarvis-panel rounded-lg p-4">
        <p className="scan-label mb-3 text-sm">// PHASE TIMELINE</p>
        <div className="grid gap-2 md:grid-cols-5">
          {PHASES.map((phase) => (
            <div key={phase.index} className="rounded-md border border-[var(--border)] p-3">
              <p className="font-mono text-xs text-accent">{phase.shortName}</p>
              <p className="mt-1 text-xs text-muted">{phase.dateRange}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {months.map((month) => (
          <article key={month} className="jarvis-card p-4">
            <h3 className="font-display text-3xl font-bold text-white">{month}</h3>
            <div className="mt-4 space-y-3">
              {milestones
                .filter((milestone) => milestone.targetMonth === month)
                .map((milestone) => {
                  const category = categories.find((item) => item.id === milestone.categoryId);
                  return (
                    <button
                      key={milestone.id}
                      onClick={() => toggleMilestone(milestone.id)}
                      className="flex w-full items-start gap-3 rounded-md border border-[var(--border)] p-3 text-left"
                    >
                      <span
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded border"
                        style={{ borderColor: category?.accentColor, color: category?.accentColor }}
                      >
                        {milestone.done ? <Check size={14} /> : null}
                      </span>
                      <span>
                        <span className={`block text-sm ${milestone.done ? 'text-muted line-through' : 'text-jarvisText'}`}>{milestone.title}</span>
                        <span className="mt-1 block font-mono text-xs text-muted">{category?.label}</span>
                      </span>
                    </button>
                  );
                })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
