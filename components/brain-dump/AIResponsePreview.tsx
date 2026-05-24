import { BrainDumpResponse } from '@/types';

export function AIResponsePreview({ response }: { response: BrainDumpResponse }) {
  return (
    <div className="space-y-4">
      <Section title="// SUMMARY">
        <p className="text-sm text-jarvisText">{response.summary}</p>
      </Section>
      <Section title="// TASKS COMPLETE">
        <List items={response.tasks_completed.map((item) => `${item.category}: ${item.text}`)} empty="No completions detected." tone="text-accent3" />
      </Section>
      <Section title="// NEW TASKS">
        <List items={response.tasks_to_add.map((item) => `${item.category}: ${item.text}`)} empty="No new tasks detected." tone="text-accent" />
      </Section>
      <Section title="// CATEGORY NEXT ACTIONS">
        <List
          items={Object.entries(response.category_updates)
            .filter(([, update]) => update?.next_action)
            .map(([category, update]) => `${category}: ${update?.next_action}`)}
          empty="No category changes detected."
          tone="text-accent2"
        />
      </Section>
      <Section title="// J.A.R.V.I.S. MESSAGE">
        <p className="text-sm text-muted">{response.ai_message}</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-[var(--border)] p-3">
      <p className="scan-label mb-2 text-xs">{title}</p>
      {children}
    </section>
  );
}

function List({ items, empty, tone }: { items: string[]; empty: string; tone: string }) {
  if (!items.length) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className={`text-sm ${tone}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}
