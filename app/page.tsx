'use client';

import { useEffect, useMemo } from 'react';
import { Brain, CalendarDays, ClipboardList, Gauge, LayoutDashboard, Map, MessageSquare, Shield, Zap } from 'lucide-react';
import { JarvisHeader } from '@/components/layout/JarvisHeader';
import { CountdownStrip } from '@/components/layout/CountdownStrip';
import { TabNav } from '@/components/layout/TabNav';
import { PasswordGate } from '@/components/layout/PasswordGate';
import { BriefingTab } from '@/components/tabs/BriefingTab';
import { PriorityTab } from '@/components/tabs/PriorityTab';
import { BrainDumpTab } from '@/components/tabs/BrainDumpTab';
import { ChatTab } from '@/components/tabs/ChatTab';
import { RoadmapTab } from '@/components/tabs/RoadmapTab';
import { TemplatesTab } from '@/components/tabs/TemplatesTab';
import { SystemsTab } from '@/components/tabs/SystemsTab';
import { DashboardTab } from '@/components/tabs/DashboardTab';
import { Toast } from '@/components/ui/Toast';
import { useJarvisStore } from '@/store/jarvis-store';
import { TabId } from '@/types';

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'briefing', label: 'Briefing', icon: LayoutDashboard },
  { id: 'priority', label: 'Priority', icon: Zap },
  { id: 'brain', label: 'Brain Dump', icon: Brain },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'templates', label: 'Templates', icon: ClipboardList },
  { id: 'systems', label: 'Systems', icon: Shield },
  { id: 'dashboard', label: 'Dashboard', icon: Gauge }
];

export default function Home() {
  const activeTab = useJarvisStore((state) => state.activeTab);
  const setActiveTab = useJarvisStore((state) => state.setActiveTab);
  const hydrate = useJarvisStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target?.tagName === 'TEXTAREA' || target?.tagName === 'INPUT') return;
      const keyMap: Record<string, TabId> = {
        b: 'brain',
        c: 'chat',
        '1': 'briefing',
        '2': 'priority',
        '3': 'brain',
        '4': 'chat',
        '5': 'roadmap',
        '6': 'templates',
        '7': 'systems',
        '8': 'dashboard'
      };
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setActiveTab('brain');
      }
      const next = keyMap[event.key.toLowerCase()];
      if (next) setActiveTab(next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setActiveTab]);

  const content = useMemo(() => {
    switch (activeTab) {
      case 'priority':
        return <PriorityTab />;
      case 'brain':
        return <BrainDumpTab />;
      case 'chat':
        return <ChatTab />;
      case 'roadmap':
        return <RoadmapTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'systems':
        return <SystemsTab />;
      case 'dashboard':
        return <DashboardTab />;
      default:
        return <BriefingTab />;
    }
  }, [activeTab]);

  return (
    <PasswordGate>
      <main className="min-h-screen bg-hud text-jarvisText">
        <div className="fixed inset-0 -z-10 grid-bg" />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-28 pt-4 md:px-6 md:pb-10">
          <JarvisHeader />
          <CountdownStrip />
          <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <section className="tab-shell animate-tab">{content}</section>
        </div>
        <Toast />
      </main>
    </PasswordGate>
  );
}
