---
status: Rejected
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-10T04:36:39.639Z
gate_signature: ACL-STUDIO-APPROVAL-REJECTED
title: "Story 3.1: Composite Filtering in Board View"
tier: Tier 2 (Major Overhaul)
story_id: "3.1"
epic_id: "3"
created: 2026-09-10
---

# 📦 Story 3.1: Composite Filtering in Board View

## Overview & Scope
Update the issue filtering pipeline in `src/components/BoardView.tsx` to include `assigneeFilter`, performing multi-criteria filtering across search query, priority filter, and assignee filter.

## Technical Contract
- **Component File**: `src/components/BoardView.tsx`
- **Filtering Logic**:
  - `assigneeFilter` retrieved from `useJiraStore()`.
  - Dependency array of `filteredIssues` `useMemo` includes `[issues, searchQuery, priorityFilter, assigneeFilter]`.
  - Matching condition:
    - If `assigneeFilter === 'all'`: matches all issues.
    - If `assigneeFilter === 'Unassigned'`: matches issues with `!issue.assignee || issue.assignee === 'Unassigned'`.
    - Otherwise: `issue.assignee === assigneeFilter`.
  - Composite predicate: `matchesSearch && matchesPriority && matchesAssignee`.

## Acceptance Criteria
- [x] Update `filteredIssues` `useMemo` dependency array to include `assigneeFilter`.
- [x] Evaluate composite filter condition: `matchesSearch && matchesPriority && matchesAssignee`.
- [x] Ensure issues without an assignee or assigned to "Unassigned" are filterable via `'Unassigned'`.
