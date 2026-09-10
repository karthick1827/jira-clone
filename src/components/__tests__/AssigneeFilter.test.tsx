import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from '../Header';
import { BoardView } from '../BoardView';
import { useJiraStore } from '../../store/useJiraStore';

describe('Assignee Filter Integration', () => {
  beforeEach(() => {
    useJiraStore.setState({
      assigneeFilter: 'all',
      searchQuery: '',
      priorityFilter: 'all',
    });
  });

  it('renders the assignee filter dropdown in Header with unique assignees', () => {
    render(<Header />);

    const assigneeSelect = screen.getByDisplayValue('All Assignees') as HTMLSelectElement;
    expect(assigneeSelect).toBeInTheDocument();
    expect(assigneeSelect.classList.contains('assignee-select')).toBe(true);

    // Check options
    expect(screen.getByRole('option', { name: 'All Assignees' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Sarah Connor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Karthick N' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alex Rivera' })).toBeInTheDocument();
  });

  it('filters issues on BoardView when assignee is selected', () => {
    const { rerender } = render(<BoardView />);

    // Initially, multiple issues should be present
    expect(screen.getByText('Implement OAuth 2.0 User Authentication Flow')).toBeInTheDocument();
    expect(screen.getByText('Design Dark Mode Color Tokens & Palette')).toBeInTheDocument();

    // Select Sarah Connor
    useJiraStore.getState().setAssigneeFilter('Sarah Connor');
    rerender(<BoardView />);

    // Sarah Connor issues should be present
    expect(screen.getByText('Implement OAuth 2.0 User Authentication Flow')).toBeInTheDocument();
    expect(screen.getByText('API Rate Limiting & Error Boundary Setup')).toBeInTheDocument();

    // Alex Rivera issue should not be present
    expect(screen.queryByText('Design Dark Mode Color Tokens & Palette')).not.toBeInTheDocument();
  });

  it('updates assigneeFilter when changing Header select', () => {
    render(<Header />);
    const select = screen.getByDisplayValue('All Assignees');
    fireEvent.change(select, { target: { value: 'Sarah Connor' } });
    expect(useJiraStore.getState().assigneeFilter).toBe('Sarah Connor');
  });

  it('shows empty state message with active assignee and resets all filters on click', () => {
    // Set non-matching combination before render
    useJiraStore.setState({
      searchQuery: 'NonExistentTitleXYZ',
      assigneeFilter: 'Sarah Connor',
    });

    render(<BoardView />);

    expect(screen.getByText(/No matching issues found/i)).toBeInTheDocument();
    expect(screen.getByText(/assigned to "Sarah Connor"/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset Search & Filters/i });
    fireEvent.click(resetBtn);

    const state = useJiraStore.getState();
    expect(state.searchQuery).toBe('');
    expect(state.priorityFilter).toBe('all');
    expect(state.assigneeFilter).toBe('all');
  });
});
