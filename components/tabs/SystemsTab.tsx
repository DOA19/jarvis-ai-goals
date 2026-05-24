import { PHASES } from '@/lib/phase-calculator';

export function SystemsTab() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="// PRIORITY DECISION SYSTEM">
        <ol className="space-y-3 text-sm text-muted">
          <li>1. Conversations that remove unknowns outrank busywork.</li>
          <li>2. Unlocks beat maintenance when energy is limited.</li>
          <li>3. Deadline pressure gets handled before optional exploration.</li>
          <li>4. Momentum matters, but only if it produces the next concrete move.</li>
          <li>5. If everything feels urgent, do the shortest high-impact task.</li>
        </ol>
      </Panel>
      <Panel title="// BURNOUT PREVENTION">
        <ol className="space-y-3 text-sm text-muted">
          <li>1. No more than five major tasks in one day.</li>
          <li>2. Keep at least thirty minutes unclaimed.</li>
          <li>3. A workout can be consistency, not punishment.</li>
          <li>4. Social goals count because the system is a life, not a spreadsheet.</li>
          <li>5. When overwhelmed, shrink the task until it can start.</li>
        </ol>
      </Panel>
      <section className="lg:col-span-2">
        <p className="scan-label mb-3 text-sm">// PHASE DEFINITIONS</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {PHASES.map((phase) => (
            <article key={phase.index} className="jarvis-card p-4">
              <p className="font-mono text-xs text-accent">{phase.name}</p>
              <p className="mt-2 text-sm text-muted">{phase.focus}</p>
            </article>
          ))}
        </div>
      </section>
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
