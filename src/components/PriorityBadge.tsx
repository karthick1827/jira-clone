import React from 'react';
import type { Priority } from '../types/jira';
import { ChevronDown, Equal, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showLabel = true }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'high':
        return {
          label: 'High',
          icon: <ArrowUp size={14} className="priority-icon high" />,
          className: 'badge-priority-high',
        };
      case 'medium':
        return {
          label: 'Medium',
          icon: <Equal size={14} className="priority-icon medium" />,
          className: 'badge-priority-medium',
        };
      case 'low':
        return {
          label: 'Low',
          icon: <ChevronDown size={14} className="priority-icon low" />,
          className: 'badge-priority-low',
        };
      default:
        return {
          label: priority,
          icon: null,
          className: '',
        };
    }
  };

  const config = getPriorityConfig();

  return (
    <span className={`priority-badge ${config.className}`} title={`Priority: ${config.label}`}>
      {config.icon}
      {showLabel && <span className="priority-label">{config.label}</span>}
    </span>
  );
};
