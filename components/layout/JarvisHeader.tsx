import { Activity } from 'lucide-react';
import { formatDateLabel } from '@/lib/countdown';

export function JarvisHeader() {
  return (
    <header className="jarvis-panel scanline mb-4 overflow-hidden rounded-lg px-5 py-5">
      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="scan-label text-sm">// PERSONAL COMMAND CENTER</p>
          <h1 className="font-display text-5xl font-bold leading-none text-white md:text-7xl">J.A.R.V.I.S.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
            Just A Rather Very Intelligent System for medicine, acting, school, fitness, and fun.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[var(--border2)] px-4 py-2 font-mono text-sm text-accent">
            {formatDateLabel()}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[rgba(0,255,157,0.35)] px-4 py-2 font-mono text-sm text-accent3">
            <Activity size={16} />
            SYSTEMS ONLINE
          </div>
        </div>
      </div>
    </header>
  );
}
