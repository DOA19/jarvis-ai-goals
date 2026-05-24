'use client';

import { useJarvisStore } from '@/store/jarvis-store';

export function useTasks() {
  const tasks = useJarvisStore((state) => state.tasks);
  const toggleTask = useJarvisStore((state) => state.toggleTask);
  return { tasks, toggleTask };
}
