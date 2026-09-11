---
status: In Review
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-11T03:44:02.461Z
gate_signature: ACL-STUDIO-APPROVAL-IN-REVIEW
title: "Story 3.2: Empty Results State & Filter Reset"
tier: Tier 2 (Major Overhaul)
story_id: "3.2"
epic_id: "3"
created: 2026-09-10
---

# 📦 Story 3.2: Empty Results State & Filter Reset

## Overview & Scope
Enhance empty state feedback and atomic filter reset functionality in `src/components/BoardView.tsx` when no issues match the composite filters including assignee filter.

## Technical Contract
- **Component File**: `src/components/BoardView.tsx`
- **Active Filters Evaluation**:
  - `hasActiveFilters`: `searchQuery !== '' || priorityFilter !== 'all' || assigneeFilter !== 'all'`.
- **Reset Handler**:
  - `resetFilters` function resets `searchQuery` to `''`, `priorityFilter` to `'all'`, and `assigneeFilter` to `'all'`.
- **Empty State Display**:
  - In `.no-search-results`, display the active assignee filter message: `{assigneeFilter !== 'all' && ' assigned to "' + assigneeFilter + '"'}`.

## Acceptance Criteria
- [x] Update `hasActiveFilters` to evaluate `searchQuery !== '' || priorityFilter !== 'all' || assigneeFilter !== 'all'`.
- [x] Update `resetFilters` handler to call `setAssigneeFilter('all')`, resetting all filters atomically.
- [x] In the empty state message (`.no-search-results`), display the active assignee filter when active.
