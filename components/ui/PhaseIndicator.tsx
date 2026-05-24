export function PhaseIndicator({ phase }: { phase: { name: string; focus: string } }) {
  return (
    <div className="rounded-md border border-[rgba(123,97,255,0.35)] px-4 py-3">
      <p className="font-mono text-xs text-accent2">{phase.name}</p>
      <p className="mt-1 max-w-md text-xs text-muted">{phase.focus}</p>
    </div>
  );
}
