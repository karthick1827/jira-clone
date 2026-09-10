export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export interface Issue {
  id: string; // e.g. "PROJ-101"
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  assignee: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ColumnConfig {
  id: IssueStatus;
  title: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeColor: string;
}

export const COLUMNS: ColumnConfig[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    description: 'Issues planned for upcoming iterations',
    color: '#6b7280',
    badgeBg: '#f3f4f6',
    badgeColor: '#374151',
  },
  {
    id: 'todo',
    title: 'To Do',
    description: 'Ready for implementation',
    color: '#3b82f6',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    description: 'Currently actively being worked on',
    color: '#eab308',
    badgeBg: '#fefce8',
    badgeColor: '#a16207',
  },
  {
    id: 'in_review',
    title: 'In Review',
    description: 'Code review or QA testing',
    color: '#a855f7',
    badgeBg: '#faf5ff',
    badgeColor: '#6b21a8',
  },
  {
    id: 'done',
    title: 'Done',
    description: 'Completed and verified',
    color: '#22c55e',
    badgeBg: '#f0fdf4',
    badgeColor: '#15803d',
  },
];
