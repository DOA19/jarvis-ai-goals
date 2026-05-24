export function StatusBadge({ status }: { status: string }) {
  const color = status === 'COMPLETE' ? 'var(--accent3)' : status === 'IN PROGRESS' ? 'var(--accent)' : 'var(--warn)';
  return (
    <span className="rounded-full border px-3 py-1 font-mono text-[11px]" style={{ borderColor: color, color }}>
      {status}
    </span>
  );
}
