import React, { useMemo } from 'react';
import { useJiraStore } from '../store/useJiraStore';
import { COLUMNS } from '../types/jira';
import { KanbanColumn } from './KanbanColumn';
import { SearchX, RotateCcw } from 'lucide-react';

export const BoardView: React.FC = () => {
  const {
    issues,
    searchQuery,
    priorityFilter,
    assigneeFilter,
    setSearchQuery,
    setPriorityFilter,
    setAssigneeFilter,
  } = useJiraStore();

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search filter (title or ID)
      const matchesSearch =
        searchQuery.trim() === '' ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.assignee.toLowerCase().includes(searchQuery.toLowerCase());

      // Priority filter
      const matchesPriority =
        priorityFilter === 'all' || issue.priority === priorityFilter;

      // Assignee filter
      const matchesAssignee =
        assigneeFilter === 'all' ||
        (assigneeFilter === 'Unassigned'
          ? !issue.assignee || issue.assignee === 'Unassigned'
          : issue.assignee === assigneeFilter);

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [issues, searchQuery, priorityFilter, assigneeFilter]);

  const hasActiveFilters =
    searchQuery !== '' || priorityFilter !== 'all' || assigneeFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setAssigneeFilter('all');
  };

  return (
    <main className="board-main-container">
      {hasActiveFilters && filteredIssues.length === 0 ? (
        <div className="no-search-results">
          <SearchX size={36} className="no-results-icon" />
          <h3>No matching issues found</h3>
          <p>
            No issues matched
            {searchQuery && ` search query "${searchQuery}"`}
            {priorityFilter !== 'all' && ` with priority "${priorityFilter}"`}
            {assigneeFilter !== 'all' && ` assigned to "${assigneeFilter}"`}
            .
          </p>
          <button className="btn-secondary reset-filters-btn" onClick={resetFilters}>
            <RotateCcw size={14} />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      ) : (
        <div className="kanban-grid">
          {COLUMNS.map((column) => {
            const columnIssues = filteredIssues.filter(
              (issue) => issue.status === column.id
            );

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                issues={columnIssues}
              />
            );
          })}
        </div>
      )}
    </main>
  );
};
