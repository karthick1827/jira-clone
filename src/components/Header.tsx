import React, { useMemo } from 'react';
import { useJiraStore } from '../store/useJiraStore';
import type { Priority } from '../types/jira';
import { Search, Plus, Filter, Kanban, X, User } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    openModal,
    issues,
  } = useJiraStore();

  const totalIssues = issues.length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length;
  const doneCount = issues.filter((i) => i.status === 'done').length;

  const uniqueAssignees = useMemo(() => {
    const names = new Set<string>();
    issues.forEach((i) => {
      if (i.assignee) names.add(i.assignee);
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [issues]);

  return (
    <header className="app-header">
      <div className="header-top-row">
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <Kanban size={22} className="brand-icon" />
          </div>
          <div>
            <h1 className="brand-title">Jira Kanban Sprint Board</h1>
            <span className="brand-subtitle">Project Key: PROJ &bull; Antigravity Engineering</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-primary create-issue-btn" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Create Issue</span>
          </button>
          <ProfileDropdown />
        </div>
      </div>

      <div className="header-controls-row">
        <div className="search-filter-wrapper">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title or issue key (e.g. PROJ-101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="priority-filter-container">
            <Filter size={15} className="filter-icon" />
            <span className="filter-label">Priority:</span>
            <select
              className="priority-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="assignee-filter-container">
            <User size={15} className="filter-icon" />
            <span className="filter-label">Assignee:</span>
            <select
              className="assignee-select"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            >
              <option value="all">All Assignees</option>
              {uniqueAssignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="header-stats-chips">
          <div className="stat-chip">
            <span className="stat-label">Total</span>
            <span className="stat-value">{totalIssues}</span>
          </div>
          <div className="stat-chip in-progress">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{inProgressCount}</span>
          </div>
          <div className="stat-chip done">
            <span className="stat-label">Done</span>
            <span className="stat-value">{doneCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
