'use client';

import { Copy } from 'lucide-react';
import { useJarvisStore } from '@/store/jarvis-store';

export function PromptBox({ title, text }: { title: string; text: string }) {
  const addToast = useJarvisStore((state) => state.addToast);

  return (
    <section className="jarvis-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-bold text-white">{title}</h3>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            addToast('Template copied', 'success');
          }}
          className="flex items-center gap-2 rounded-md border border-[var(--border2)] px-3 py-2 font-mono text-xs text-accent"
        >
          <Copy size={15} />
          COPY
        </button>
      </div>
      <pre className="whitespace-pre-wrap rounded-md border border-[var(--border)] bg-black/20 p-4 font-body text-sm leading-6 text-muted">
        {text}
      </pre>
    </section>
  );
}
