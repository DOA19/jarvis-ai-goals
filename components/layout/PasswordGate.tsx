'use client';

import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

const ACCESS_KEY = 'jarvis-access-granted';

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const expected = process.env.NEXT_PUBLIC_JARVIS_APP_PASSWORD ?? 'jarvis2026';

  useEffect(() => {
    const stored = localStorage.getItem(ACCESS_KEY) === 'true';
    setUnlocked(stored);
    setReady(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
  }, []);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <main className="grid min-h-screen place-items-center bg-hud p-4 text-jarvisText">
      <section className="jarvis-panel w-full max-w-md rounded-lg p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-md border border-[var(--border2)] text-accent">
            <Lock size={20} />
          </div>
          <div>
            <p className="scan-label text-sm">// ACCESS GATE</p>
            <h1 className="font-display text-3xl font-bold text-white">J.A.R.V.I.S.</h1>
          </div>
        </div>
        <input
          value={password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && password === expected) {
              localStorage.setItem(ACCESS_KEY, 'true');
              setUnlocked(true);
            }
          }}
          placeholder="Enter access password"
          className="mb-3 min-h-11 w-full rounded-md border border-[var(--border2)] bg-black/20 px-4 text-jarvisText outline-none focus:border-accent"
        />
        <button
          onClick={() => {
            if (password === expected) {
              localStorage.setItem(ACCESS_KEY, 'true');
              setUnlocked(true);
            }
          }}
          className="w-full rounded-md border border-accent bg-cyan-300/10 px-4 py-3 font-mono text-sm text-accent"
        >
          UNLOCK SYSTEM
        </button>
      </section>
    </main>
  );
}
