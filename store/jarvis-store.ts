'use client';

import { create } from 'zustand';
import { BrainDumpRecord, BrainDumpResponse, Category, CategoryId, ChatMessage, Milestone, TabId, Task } from '@/types';
import { categoriesSeed, milestonesSeed, tasksSeed } from '@/lib/seed-data';

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

const STORAGE_KEY = 'jarvis-state-v1';

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function persist(state: Pick<JarvisState, 'categories' | 'tasks' | 'milestones' | 'dumps' | 'messages'>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      categories: state.categories,
      tasks: state.tasks,
      milestones: state.milestones,
      dumps: state.dumps,
      messages: state.messages
    })
  );
}

export const useJarvisStore = create<JarvisState>((set, get) => ({
  activeTab: 'briefing',
  categories: categoriesSeed,
  tasks: tasksSeed,
  milestones: milestonesSeed,
  dumps: [],
  messages: [],
  toasts: [],
  hydrated: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  hydrate: () => {
    if (typeof window === 'undefined' || get().hydrated) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<JarvisState>;
        set({
          categories: parsed.categories ?? categoriesSeed,
          tasks: parsed.tasks ?? tasksSeed,
          milestones: parsed.milestones ?? milestonesSeed,
          dumps: parsed.dumps ?? [],
          messages: parsed.messages ?? [],
          hydrated: true
        });
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    set({ hydrated: true });
  },
  addToast: (message, tone = 'info') => {
    const id = newId('toast');
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    window.setTimeout(() => get().removeToast(id), 4200);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  toggleTask: (id) => {
    set((state) => {
      const tasks = state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
              completedAt: !task.done ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString()
            }
          : task
      );
      persist({ ...state, tasks });
      return { tasks };
    });
    get().addToast('Task status updated', 'success');
  },
  toggleMilestone: (id) => {
    set((state) => {
      const milestones = state.milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, done: !milestone.done } : milestone
      );
      persist({ ...state, milestones });
      return { milestones };
    });
  },
  applyBrainDump: (rawText, response) => {
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

      persist({ ...state, categories, tasks, milestones, dumps });
      return { categories, tasks, milestones, dumps };
    });
    const count =
      response.tasks_completed.length + response.tasks_to_add.length + Object.keys(response.category_updates).length;
    get().addToast(`J.A.R.V.I.S. updated ${count} system items`, 'success');
  },
  updateCategoryNextAction: (id, nextAction) => {
    set((state) => {
      const categories = state.categories.map((category) => (category.id === id ? { ...category, nextAction } : category));
      persist({ ...state, categories });
      return { categories };
    });
  },
  addChatMessage: (message) => {
    set((state) => {
      const messages = [
        ...state.messages,
        { ...message, id: newId('message'), createdAt: new Date().toISOString() }
      ].slice(-20);
      persist({ ...state, messages });
      return { messages };
    });
  },
  clearChat: () => {
    set((state) => {
      persist({ ...state, messages: [] });
      return { messages: [] };
    });
  }
}));
