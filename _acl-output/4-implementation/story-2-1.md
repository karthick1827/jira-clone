---
status: In Review
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-10T04:36:30.730Z
gate_signature: ACL-STUDIO-APPROVAL-IN-REVIEW
title: "Story 2.1: Assignee Filter UI Component in Header"
tier: Tier 2 (Major Overhaul)
story_id: "2.1"
epic_id: "2"
created: 2026-09-10
---

# 📦 Story 2.1: Assignee Filter UI Component in Header

## Overview & Scope
Integrate the Assignee Filter selector dropdown into `src/components/Header.tsx` inside the `.search-filter-wrapper`, allowing users to select an assignee to filter the board.

## Technical Contract
- **Component File**: `src/components/Header.tsx`
- **Dynamic Options**:
  - Compute `uniqueAssignees` using `useMemo` from `issues` in `useJiraStore`, sorted alphabetically.
- **UI Elements**:
  - Render `.assignee-filter-container` containing:
    - Lucide `User` icon (`size={15}`).
    - `<span className="filter-label">Assignee:</span>`.
    - `<select className="assignee-select">` bound to `assigneeFilter` value and `setAssigneeFilter` change handler.
    - First option: `<option value="all">All Assignees</option>`.
    - Followed by mapped `<option>` items for each unique assignee.

## Acceptance Criteria
- [x] Dynamically compute `uniqueAssignees` from `issues` using `useMemo`, sorting alphabetically.
- [x] Render a `.assignee-filter-container` with Lucide `User` icon (`size={15}`) and `<span className="filter-label">Assignee:</span>`.
- [x] Render `<select className="assignee-select">` bound to `assigneeFilter` and `setAssigneeFilter`.
- [x] Include `<option value="all">All Assignees</option>` as the first option followed by mapped assignees.
