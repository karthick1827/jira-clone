import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Issue, IssueStatus, Priority } from '../types/jira';

interface JiraState {
  issues: Issue[];
  searchQuery: string;
  priorityFilter: Priority | 'all';
  assigneeFilter: string;
  selectedIssue: Issue | null;
  isModalOpen: boolean;
  modalInitialStatus: IssueStatus;
  
  // Actions
  addIssue: (issueData: Omit<Issue, 'id' | 'createdAt'>) => void;
  moveIssue: (id: string, newStatus: IssueStatus) => void;
  deleteIssue: (id: string) => void;
  updateIssue: (id: string, updatedData: Partial<Omit<Issue, 'id' | 'createdAt'>>) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | 'all') => void;
  setAssigneeFilter: (assignee: string) => void;
  openModal: (issue?: Issue | null, initialStatus?: IssueStatus) => void;
  closeModal: () => void;
}

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'PROJ-101',
    title: 'Implement OAuth 2.0 User Authentication Flow',
    description: 'Integrate Auth0 / Social login providers for secure user onboarding and session token persistence across mobile and desktop.',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Sarah Connor',
    createdAt: '2026-07-20',
  },
  {
    id: 'PROJ-102',
    title: 'Design Dark Mode Color Tokens & Palette',
    description: 'Define CSS variable system for dark mode support including background, text contrast, surface cards, and accessibility ratios.',
    status: 'done',
    priority: 'medium',
    assignee: 'Alex Rivera',
    createdAt: '2026-07-18',
  },
  {
    id: 'PROJ-103',
    title: 'Optimize Core Web Vitals & Bundle Size',
    description: 'Analyze Webpack bundle chunks, implement lazy loading for heavy chart components, and improve LCP under 1.2s.',
    status: 'in_review',
    priority: 'high',
    assignee: 'Karthick N',
    createdAt: '2026-07-21',
  },
  {
    id: 'PROJ-104',
    title: 'Setup Zustand State Management with LocalStorage Persistence',
    description: 'Configure store slice for task status transitions, search filtering, and state hydration using persist middleware.',
    status: 'done',
    priority: 'medium',
    assignee: 'Elena Rostova',
    createdAt: '2026-07-19',
  },
  {
    id: 'PROJ-105',
    title: 'Fix Mobile Navigation Drawer Layout Shift',
    description: 'Resolve Cumulative Layout Shift (CLS) issue occurring on viewport resize when toggling hamburger navigation menu.',
    status: 'todo',
    priority: 'high',
    assignee: 'Marcus Vance',
    createdAt: '2026-07-22',
  },
  {
    id: 'PROJ-106',
    title: 'Add Drag and Drop Support for Kanban Columns',
    description: 'Enable HTML5 drag and drop capability across Backlog, To Do, In Progress, In Review, and Done columns.',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Karthick N',
    createdAt: '2026-07-23',
  },
  {
    id: 'PROJ-107',
    title: 'API Rate Limiting & Error Boundary Setup',
    description: 'Implement exponential backoff retry logic and global error fallback UI for network degradation events.',
    status: 'backlog',
    priority: 'low',
    assignee: 'Sarah Connor',
    createdAt: '2026-07-24',
  },
  {
    id: 'PROJ-108',
    title: 'Export Board Metrics to CSV / JSON Report',
    description: 'Provide an export button in board settings to download sprint task distributions and velocity reports.',
    status: 'backlog',
    priority: 'low',
    assignee: 'Unassigned',
    createdAt: '2026-07-24',
  },
];

export const useJiraStore = create<JiraState>()(
  persist(
    (set) => ({
      issues: INITIAL_ISSUES,
      searchQuery: '',
      priorityFilter: 'all',
      assigneeFilter: 'all',
      selectedIssue: null,
      isModalOpen: false,
      modalInitialStatus: 'todo',

      addIssue: (issueData) => {
        set((state) => {
          // Generate next issue ID (e.g. PROJ-109)
          const nextNumber = state.issues.reduce((max, issue) => {
            const num = parseInt(issue.id.replace('PROJ-', ''), 10);
            return !isNaN(num) && num > max ? num : max;
          }, 100) + 1;

          const newIssue: Issue = {
            ...issueData,
            id: `PROJ-${nextNumber}`,
            createdAt: new Date().toISOString().split('T')[0],
          };

          return {
            issues: [newIssue, ...state.issues],
          };
        });
      },

      moveIssue: (id, newStatus) => {
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === id
              ? { ...issue, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
              : issue
          ),
        }));
      },

      deleteIssue: (id) => {
        set((state) => ({
          issues: state.issues.filter((issue) => issue.id !== id),
          isModalOpen: state.selectedIssue?.id === id ? false : state.isModalOpen,
          selectedIssue: state.selectedIssue?.id === id ? null : state.selectedIssue,
        }));
      },

      updateIssue: (id, updatedData) => {
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === id
              ? {
                  ...issue,
                  ...updatedData,
                  updatedAt: new Date().toISOString().split('T')[0],
                }
              : issue
          ),
        }));
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setPriorityFilter: (priority) => {
        set({ priorityFilter: priority });
      },

      setAssigneeFilter: (assignee) => {
        set({ assigneeFilter: assignee });
      },

      openModal: (issue = null, initialStatus = 'todo') => {
        set({
          selectedIssue: issue,
          modalInitialStatus: issue ? issue.status : initialStatus,
          isModalOpen: true,
        });
      },

      closeModal: () => {
        set({
          isModalOpen: false,
          selectedIssue: null,
        });
      },
    }),
    {
      name: 'jira-kanban-storage',
    }
  )
);
