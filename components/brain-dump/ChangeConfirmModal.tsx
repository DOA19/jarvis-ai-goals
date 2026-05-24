'use client';

import { X } from 'lucide-react';
import { BrainDumpResponse } from '@/types';
import { AIResponsePreview } from './AIResponsePreview';

export function ChangeConfirmModal({
  response,
  onApply,
  onClose
}: {
  response: BrainDumpResponse;
  onApply: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <section className="glass max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-[var(--border2)] p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="scan-label text-sm">// CHANGE PREVIEW</p>
            <h2 className="font-display text-3xl font-bold text-white">J.A.R.V.I.S. detected these changes</h2>
          </div>
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-md border border-[var(--border)] text-muted">
            <X size={18} />
          </button>
        </div>
        <AIResponsePreview response={response} />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-md border border-[var(--border)] px-4 py-3 font-mono text-sm text-muted">
            REVIEW EACH
          </button>
          <button onClick={onApply} className="rounded-md border border-accent bg-cyan-300/10 px-4 py-3 font-mono text-sm text-accent">
            APPLY ALL CHANGES
          </button>
        </div>
      </section>
    </div>
  );
}
