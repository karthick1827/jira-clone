import React from 'react';
import type { Issue, IssueStatus } from '../types/jira';
import { COLUMNS } from '../types/jira';
import { PriorityBadge } from './PriorityBadge';
import { useJiraStore } from '../store/useJiraStore';
import { GripVertical, User } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, issueId: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onDragStart }) => {
  const { openModal, moveIssue } = useJiraStore();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent modal trigger if clicking on interactive select element
    if ((e.target as HTMLElement).closest('.card-status-select')) {
      return;
    }
    openModal(issue);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    moveIssue(issue.id, e.target.value as IssueStatus);
  };

  // Extract initials for assignee avatar badge
  const getInitials = (name: string) => {
    if (!name || name === 'Unassigned') return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="issue-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', issue.id);
        e.dataTransfer.effectAllowed = 'move';
        if (onDragStart) onDragStart(e, issue.id);
      }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      <div className="card-top">
        <div className="card-key-group">
          <span title="Drag card to move column">
            <GripVertical size={14} className="drag-handle" />
          </span>
          <span className="issue-key">{issue.id}</span>
        </div>
        <PriorityBadge priority={issue.priority} />
      </div>

      <h4 className="card-title">{issue.title}</h4>

      {issue.description && (
        <p className="card-description-preview">
          {issue.description.length > 80
            ? `${issue.description.substring(0, 80)}...`
            : issue.description}
        </p>
      )}

      <div className="card-footer">
        <div className="assignee-badge" title={`Assignee: ${issue.assignee}`}>
          <div className="avatar-circle">
            {issue.assignee === 'Unassigned' ? (
              <User size={12} />
            ) : (
              <span>{getInitials(issue.assignee)}</span>
            )}
          </div>
          <span className="assignee-name">{issue.assignee}</span>
        </div>

        <div className="card-status-select-wrapper" onClick={(e) => e.stopPropagation()}>
          <select
            className="card-status-select"
            value={issue.status}
            onChange={handleStatusChange}
            aria-label={`Change status for ${issue.id}`}
          >
            {COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
