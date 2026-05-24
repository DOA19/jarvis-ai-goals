'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { getCurrentPhase } from '@/lib/phase-calculator';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PhaseIndicator } from '@/components/ui/PhaseIndicator';

export function CountdownStrip() {
  const countdown = useCountdown();
  const phase = getCurrentPhase();

  return (
    <section className="jarvis-panel mb-4 rounded-lg px-4 py-3">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1.4fr_auto] md:items-center">
        <Metric label="DAYS LEFT" value={countdown.daysLeft} />
        <Metric label="WEEKS" value={countdown.weeksLeft} />
        <div>
          <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted">
            <span>% ELAPSED</span>
            <span className="text-accent">{countdown.percentElapsed}%</span>
          </div>
          <ProgressBar value={countdown.percentElapsed} color="var(--accent)" />
        </div>
        <PhaseIndicator phase={phase} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-end gap-3">
      <span className="font-display text-4xl font-bold text-white">{value}</span>
      <span className="pb-2 font-mono text-xs text-muted">{label}</span>
    </div>
  );
}
