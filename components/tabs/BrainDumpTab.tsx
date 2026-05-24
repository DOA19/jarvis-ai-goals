'use client';

import { useState } from 'react';
import { BrainDumpInput } from '@/components/brain-dump/BrainDumpInput';
import { ChangeConfirmModal } from '@/components/brain-dump/ChangeConfirmModal';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useBrainDump } from '@/hooks/useBrainDump';
import { useJarvisStore } from '@/store/jarvis-store';
import { BrainDumpResponse } from '@/types';

export function BrainDumpTab() {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<BrainDumpResponse | null>(null);
  const { processDump, loading, error } = useBrainDump();
  const applyBrainDump = useJarvisStore((state) => state.applyBrainDump);
  const dumps = useJarvisStore((state) => state.dumps);

  async function submit() {
    const response = await processDump(text);
    if (response) setPreview(response);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        <BrainDumpInput value={text} onChange={setText} onSubmit={submit} disabled={loading} />
        {loading && <SkeletonLoader label="Reading your update... detecting changes... preparing summary..." />}
        {error && <p className="rounded-md border border-[var(--danger)] p-3 font-mono text-sm text-danger">{error}</p>}
      </div>
      <aside className="jarvis-card p-4">
        <p className="scan-label mb-3 text-sm">// BRAIN DUMP HISTORY</p>
        <div className="space-y-3">
          {dumps.length === 0 ? <p className="text-sm text-muted">No dumps processed yet.</p> : null}
          {dumps.map((dump) => (
            <details key={dump.id} className="rounded-md border border-[var(--border)] p-3">
              <summary className="cursor-pointer font-mono text-xs text-accent">{new Date(dump.createdAt).toLocaleString()}</summary>
              <p className="mt-2 text-sm text-muted">{dump.aiResponse.summary}</p>
            </details>
          ))}
        </div>
      </aside>

      {preview && (
        <ChangeConfirmModal
          response={preview}
          onClose={() => setPreview(null)}
          onApply={() => {
            applyBrainDump(text, preview);
            setText('');
            setPreview(null);
          }}
        />
      )}
    </div>
  );
}
