'use client';

import { useState } from 'react';
import { BrainDumpResponse } from '@/types';

export function useBrainDump() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function processDump(text: string): Promise<BrainDumpResponse | null> {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('AI failed');
      return (await response.json()) as BrainDumpResponse;
    } catch {
      setError('Systems temporarily offline. Try again in a moment.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { processDump, loading, error };
}
