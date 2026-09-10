import { describe, it, expect, beforeEach } from 'vitest';
import { useJiraStore } from '../useJiraStore';

describe('useJiraStore - Assignee Filter', () => {
  beforeEach(() => {
    useJiraStore.setState({
      assigneeFilter: 'all',
      searchQuery: '',
      priorityFilter: 'all',
    });
  });

  it('initializes with assigneeFilter set to "all"', () => {
    const state = useJiraStore.getState();
    expect(state.assigneeFilter).toBe('all');
  });

  it('updates assigneeFilter when calling setAssigneeFilter', () => {
    const { setAssigneeFilter } = useJiraStore.getState();
    setAssigneeFilter('Sarah Connor');
    expect(useJiraStore.getState().assigneeFilter).toBe('Sarah Connor');
  });

  it('resets assigneeFilter back to "all"', () => {
    const { setAssigneeFilter } = useJiraStore.getState();
    setAssigneeFilter('Karthick N');
    expect(useJiraStore.getState().assigneeFilter).toBe('Karthick N');

    setAssigneeFilter('all');
    expect(useJiraStore.getState().assigneeFilter).toBe('all');
  });

  it('preserves existing issues and other state when changing assigneeFilter', () => {
    const initialIssues = useJiraStore.getState().issues;
    const { setAssigneeFilter } = useJiraStore.getState();

    setAssigneeFilter('Alex Rivera');
    const updatedState = useJiraStore.getState();

    expect(updatedState.assigneeFilter).toBe('Alex Rivera');
    expect(updatedState.issues).toEqual(initialIssues);
  });
});
