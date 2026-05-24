'use client';

import { create } from 'zustand';
import { BrainDumpRecord, BrainDumpResponse, Category, CategoryId, ChatMessage, Milestone, TabId, Task } from '@/types';

type Toast = { id: string; message: string; tone?: 'success' | 'warn' | 'danger' | 'info' };

interface JarvisState {
  activeTab: TabId;
  categories: Category[];
  tasks: Task[];
  milestones: Milestone[];
  dumps: BrainDumpRecord[];
  messages: ChatMessage[];
  toasts: Toast[];
  hydrated: boolean;
  setActiveTab: (tab: TabId) => void;
  hydrate: () => void;
  addToast: (message: string, tone?: Toast['tone']) => void;
  removeToast: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleMilestone: (id: string) => void;
  applyBrainDump: (rawText: string, response: BrainDumpResponse) => void;
  updateCategoryNextAction: (id: CategoryId, nextAction: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  clearChat: () => void;
}

const emptyState = { categories: [] as Category[], tasks: [] as Task[], milestones: [] as Milestone[], dumps: [] as BrainDumpRecord[], messages: [] as ChatMessage[] };

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useJarvisStore = create<JarvisState>((set, get) => ({
  activeTab: 'briefing',
  categories: emptyState.categories,
  tasks: emptyState.tasks,
  milestones: emptyState.milestones,
  dumps: emptyState.dumps,
  messages: emptyState.messages,
  toasts: [],
  hydrated: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  hydrate: () => {
    if (typeof window === 'undefined' || get().hydrated) return;
    void (async () => {
      try {
        const [categoriesResponse, tasksResponse, milestonesResponse, dumpsResponse, messagesResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tasks'),
          fetch('/api/milestones'),
          fetch('/api/brain-dumps'),
          fetch('/api/messages')
        ]);

        const [categories, tasks, milestones, dumps, messages] = await Promise.all([
          categoriesResponse.ok ? categoriesResponse.json() : Promise.resolve([]),
          tasksResponse.ok ? tasksResponse.json() : Promise.resolve([]),
          milestonesResponse.ok ? milestonesResponse.json() : Promise.resolve([]),
          dumpsResponse.ok ? dumpsResponse.json() : Promise.resolve([]),
          messagesResponse.ok ? messagesResponse.json() : Promise.resolve([])
        ]);

        set({ categories, tasks, milestones, dumps, messages, hydrated: true });
      } catch {
        set({ hydrated: true });
      }
    })();
  },
  addToast: (message, tone = 'info') => {
    const id = newId('toast');
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    window.setTimeout(() => get().removeToast(id), 4200);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  toggleTask: (id) => {
    const task = get().tasks.find((item) => item.id === id);
    if (!task) return;
    const done = !task.done;
    const completedAt = done ? new Date().toISOString() : null;
    const updatedAt = new Date().toISOString();

    set((state) => ({
      tasks: state.tasks.map((item) => (item.id === id ? { ...item, done, completedAt, updatedAt } : item))
    }));

    void fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done, completedAt, updatedAt })
    });

    get().addToast('Task status updated', 'success');
  },
  toggleMilestone: (id) => {
    const milestone = get().milestones.find((item) => item.id === id);
    if (!milestone) return;
    const done = !milestone.done;

    set((state) => ({
      milestones: state.milestones.map((item) => (item.id === id ? { ...item, done } : item))
    }));

    void fetch('/api/milestones', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done })
    });
  },
  applyBrainDump: (rawText, response) => {
    const count =
      response.tasks_completed.length + response.tasks_to_add.length + Object.keys(response.category_updates).length + response.milestones_to_add.length;

    set((state) => {
      const tasks = state.tasks.map((task) => {
        const matched = response.tasks_completed.some(
          (item) =>
            item.id === task.id ||
            (item.category === task.categoryId && task.text.toLowerCase().includes(item.text.toLowerCase().slice(0, 18)))
        );
        if (!matched) return task;
        return { ...task, done: true, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      });

      for (const item of response.tasks_to_add) {
        tasks.push({
          id: newId('task'),
          categoryId: item.category,
          text: item.text,
          done: false,
          impact: item.impact,
          type: item.type,
          duePhase: item.due_phase,
          aiGenerated: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      const categories = state.categories.map((category) => {
        const update = response.category_updates[category.id]?.next_action;
        return update ? { ...category, nextAction: update, updatedAt: new Date().toISOString() } : category;
      });

      const milestones = [...state.milestones];
      for (const item of response.milestones_to_add) {
        milestones.push({
          id: newId('milestone'),
          categoryId: item.category,
          title: item.title,
          targetMonth: ['May', 'June', 'July', 'August'].includes(item.target_month) ? (item.target_month as Milestone['targetMonth']) : 'June',
          done: false,
          aiGenerated: true
        });
      }

      const dumps = [
        {
          id: newId('dump'),
          rawText,
          aiResponse: response,
          changesMade: {
            completed: response.tasks_completed.length,
            added: response.tasks_to_add.length,
            categoryUpdates: Object.keys(response.category_updates).length
          },
          createdAt: new Date().toISOString()
        },
        ...state.dumps
      ];

      return { categories, tasks, milestones, dumps };
    });

    void fetch('/api/brain-dumps/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, response })
    });

    get().addToast(`J.A.R.V.I.S. updated ${count} system items`, 'success');
  },
  updateCategoryNextAction: (id, nextAction) => {
    set((state) => ({
      categories: state.categories.map((category) => (category.id === id ? { ...category, nextAction } : category))
    }));

    void fetch('/api/categories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nextAction })
    });
  },
  addChatMessage: (message) => {
    const id = newId('message');
    const createdAt = new Date().toISOString();
    set((state) => {
      const messages = [...state.messages, { ...message, id, createdAt }].slice(-20);
      return { messages };
    });

    void fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  },
  clearChat: () => {
    set({ messages: [] });
    void fetch('/api/messages', { method: 'DELETE' });
  }
}));
