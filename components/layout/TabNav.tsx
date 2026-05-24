'use client';

import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { TabId } from '@/types';

export function TabNav({
  tabs,
  activeTab,
  onChange
}: {
  tabs: Array<{ id: TabId; label: string; icon: React.ElementType }>;
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const mobilePrimary = tabs.slice(0, 4);
  const mobileMore = tabs.slice(4);

  return (
    <>
      <nav className="mb-5 hidden border-b border-[var(--border)] md:flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-sm transition ${
                active ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-jarvisText'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border2)] bg-[rgba(10,15,30,0.96)] px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobilePrimary.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-md py-1 font-mono text-[10px] ${
                  active ? 'text-accent' : 'text-muted'
                }`}
              >
                <Icon size={20} />
                {tab.label.split(' ')[0]}
              </button>
            );
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-1 rounded-md py-1 font-mono text-[10px] text-muted"
          >
            <MoreHorizontal size={20} />
            More
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="glass absolute bottom-0 left-0 right-0 rounded-t-lg border border-[var(--border2)] p-4" onClick={(e) => e.stopPropagation()}>
            <p className="scan-label mb-3 text-sm">// MORE SYSTEMS</p>
            <div className="grid gap-2">
              {mobileMore.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onChange(tab.id);
                      setMoreOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-md border border-[var(--border)] px-3 py-3 text-left text-jarvisText"
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
