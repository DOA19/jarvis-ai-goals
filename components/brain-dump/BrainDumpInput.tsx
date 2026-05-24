'use client';

import { Mic, Send, Square } from 'lucide-react';
import { useState } from 'react';

declare global {
  interface SpeechRecognitionResultLike {
    readonly 0: { transcript: string };
  }
  interface SpeechRecognitionEventLike {
    results: ArrayLike<SpeechRecognitionResultLike>;
  }
  interface SpeechRecognitionLike {
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  }
  interface SpeechRecognitionConstructorLike {
    new (): SpeechRecognitionLike;
  }
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

export function BrainDumpInput({
  value,
  onChange,
  onSubmit,
  disabled
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);

  function toggleVoice() {
    if (listening) {
      recognition?.stop();
      setListening(false);
      return;
    }

    const Speech = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Speech) return;
    const instance = new Speech();
    instance.continuous = true;
    instance.interimResults = true;
    instance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ');
      onChange(`${value} ${transcript}`.trim());
    };
    instance.onend = () => setListening(false);
    setRecognition(instance);
    setListening(true);
    instance.start();
  }

  return (
    <section className="jarvis-panel rounded-lg p-4">
      <p className="scan-label mb-3 text-sm">// RAW INPUT CHANNEL</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Just talk. What happened today? What's on your mind? What did you do, skip, or figure out?"
        className="min-h-[260px] w-full resize-y rounded-md border border-[var(--border2)] bg-black/20 p-4 text-base leading-7 text-jarvisText outline-none placeholder:text-muted focus:border-accent"
      />
      <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <span className="font-mono text-xs text-muted">{value.length} CHARACTERS</span>
        <div className="flex gap-2">
          <button
            onClick={toggleVoice}
            type="button"
            className={`flex items-center gap-2 rounded-md border px-4 py-3 font-mono text-sm ${
              listening ? 'border-[var(--danger)] text-danger' : 'border-[var(--border2)] text-accent'
            }`}
          >
            {listening ? <Square size={16} /> : <Mic size={16} />}
            {listening ? 'STOP' : 'VOICE'}
          </button>
          <button
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            className="flex items-center gap-2 rounded-md border border-accent bg-cyan-300/10 px-4 py-3 font-mono text-sm text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} />
            PROCESS WITH J.A.R.V.I.S.
          </button>
        </div>
      </div>
    </section>
  );
}
