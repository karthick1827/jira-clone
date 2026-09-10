import React, { useState } from 'react';
import type { ColumnConfig, Issue } from '../types/jira';
import { IssueCard } from './IssueCard';
import { useJiraStore } from '../store/useJiraStore';
import { Plus, Inbox } from 'lucide-react';

interface KanbanColumnProps {
  column: ColumnConfig;
  issues: Issue[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, issues }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { moveIssue, openModal } = useJiraStore();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const issueId = e.dataTransfer.getData('text/plain');
    if (issueId) {
      moveIssue(issueId, column.id);
    }
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title-group">
          <span className="column-dot" style={{ backgroundColor: column.color }} />
          <h3 className="column-title">{column.title}</h3>
          <span
            className="column-count-badge"
            style={{
              backgroundColor: column.badgeBg,
              color: column.badgeColor,
            }}
          >
            {issues.length}
          </span>
        </div>

        <button
          className="column-add-btn"
          onClick={() => openModal(null, column.id)}
          title={`Add issue to ${column.title}`}
          aria-label={`Add issue to ${column.title}`}
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="column-description">{column.description}</p>

      <div className="column-cards-container">
        {issues.length === 0 ? (
          <div className="column-empty-state">
            <Inbox size={24} className="empty-icon" />
            <span>No issues in {column.title}</span>
          </div>
        ) : (
          issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
};
