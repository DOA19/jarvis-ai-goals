'use client';

import { useJarvisStore } from '@/store/jarvis-store';

export function Toast() {
  const toasts = useJarvisStore((state) => state.toasts);
  const removeToast = useJarvisStore((state) => state.removeToast);

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className="jarvis-panel rounded-md px-4 py-3 text-left font-mono text-sm text-accent shadow-2xl"
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
