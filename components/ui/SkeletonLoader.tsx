export function SkeletonLoader({ label = 'J.A.R.V.I.S. is analyzing your update...' }: { label?: string }) {
  return (
    <div className="jarvis-card scanline p-5">
      <p className="scan-label mb-4 text-sm">{label}</p>
      <div className="space-y-3">
        <div className="h-4 w-4/5 animate-pulse rounded bg-cyan-300/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-cyan-300/10" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-cyan-300/10" />
      </div>
    </div>
  );
}
