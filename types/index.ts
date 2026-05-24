export type CategoryId = 'medicine' | 'acting' | 'school' | 'fitness' | 'fun';

export type TaskType =
  | 'uncertainty'
  | 'unlock'
  | 'deadline'
  | 'maintenance'
  | 'optional'
  | 'outreach'
  | 'research';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  accentColor: string;
  nextAction: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  categoryId: CategoryId;
  text: string;
  done: boolean;
  impact: number;
  type: TaskType;
  duePhase: number;
  aiGenerated?: boolean;
  createdAt?: string;
  completedAt?: string | null;
  updatedAt?: string;
}

export interface Milestone {
  id: string;
  categoryId: CategoryId;
  title: string;
  targetMonth: 'May' | 'June' | 'July' | 'August';
  done: boolean;
  aiGenerated?: boolean;
}

export interface BrainDumpRecord {
  id: string;
  rawText: string;
  aiResponse: BrainDumpResponse;
  changesMade?: Record<string, unknown>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface BrainDumpResponse {
  summary: string;
  tasks_completed: Array<{ id?: string; text: string; category: CategoryId }>;
  tasks_to_add: Array<{
    text: string;
    category: CategoryId;
    impact: number;
    type: TaskType;
    due_phase: number;
  }>;
  tasks_to_update: Array<{ id: string; field: string; value: string | boolean | number }>;
  category_updates: Partial<Record<CategoryId, { next_action: string | null }>>;
  milestones_completed: string[];
  milestones_to_add: Array<{ category: CategoryId; title: string; target_month: string }>;
  priority_reassessment: {
    top_priority_category: CategoryId | null;
    reason: string | null;
  };
  ai_message: string;
  urgency_flags: Array<{ category: CategoryId; message: string }>;
}

export interface ProgressSnapshot {
  id: string;
  snapshotDate: string;
  categoryProgress: Record<CategoryId, number>;
  tasksCompleted: number;
  overallStatus: 'on_track' | 'slightly_behind' | 'seriously_behind';
  aiAssessment: string;
  createdAt: string;
}

export type TabId =
  | 'briefing'
  | 'priority'
  | 'brain'
  | 'chat'
  | 'roadmap'
  | 'templates'
  | 'systems'
  | 'dashboard';
