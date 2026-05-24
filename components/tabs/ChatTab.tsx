'use client';

import { Send, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getCurrentPhase } from '@/lib/phase-calculator';
import { getPriorityQueue } from '@/lib/priority-engine';
import { useJarvisStore } from '@/store/jarvis-store';

const quickActions = ['Plan my day', 'Weekly review', "I'm overwhelmed", "What's my #1 task?"];

export function ChatTab() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const tasks = useJarvisStore((state) => state.tasks);
  const categories = useJarvisStore((state) => state.categories);
  const messages = useJarvisStore((state) => state.messages);
  const addChatMessage = useJarvisStore((state) => state.addChatMessage);
  const clearChat = useJarvisStore((state) => state.clearChat);
  const phase = getCurrentPhase();
  const topTask = getPriorityQueue(tasks, phase.index)[0]?.task;

  const context = useMemo(
    () =>
      JSON.stringify({
        phase: phase.name,
        topTask: topTask?.text,
        incompleteTasks: tasks.filter((task) => !task.done).slice(0, 10),
        categories
      }),
    [categories, phase.name, tasks, topTask?.text]
  );

  async function send(text = input) {
    if (!text.trim()) return;
    setInput('');
    addChatMessage({ role: 'user', content: text });
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context })
      });
      const data = (await response.json()) as { content: string };
      addChatMessage({ role: 'assistant', content: data.content });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="jarvis-panel flex min-h-[640px] flex-col rounded-lg">
      <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
        <div>
          <p className="scan-label text-sm">// CONVERSATIONAL J.A.R.V.I.S.</p>
          <h2 className="font-display text-3xl font-bold text-white">Ask for plans, triage, or reality checks</h2>
        </div>
        <button onClick={clearChat} className="grid h-11 w-11 place-items-center rounded-md border border-[var(--border)] text-muted" aria-label="New chat">
          <Trash2 size={17} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-sm text-muted">Chat channel is clear. Ask what to do next.</p>}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] rounded-lg border px-4 py-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'border-[var(--border2)] bg-cyan-300/10 text-jarvisText'
                  : 'border-[var(--border)] bg-panel2 text-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && <p className="font-mono text-sm text-accent">J.A.R.V.I.S. is typing...</p>}
      </div>

      <div className="border-t border-[var(--border)] p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button key={action} onClick={() => send(action)} className="rounded-full border border-[var(--border)] px-3 py-2 font-mono text-xs text-muted">
              {action}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && send()}
            placeholder="Talk to J.A.R.V.I.S."
            className="min-h-11 flex-1 rounded-md border border-[var(--border2)] bg-black/20 px-4 text-jarvisText outline-none focus:border-accent"
          />
          <button onClick={() => send()} className="grid h-11 w-11 place-items-center rounded-md border border-accent text-accent">
            <Send size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
