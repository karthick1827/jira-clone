---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-09T18:39:43.033Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: Assignee Filter Epics & Stories Breakdown
created: 2026-09-09
updated: 2026-09-09
---

# 📋 Epics & User Stories Breakdown: Assignee Filter Option
## Implementation Backlog (Phase 3B)

---

## Overview

This backlog outlines the epics and granular user stories required to implement the **Assignee Filter Option** on the Jira Kanban board. It adheres strictly to the approved **PRD** (`_acl-output/2-plan-workflows/acl-prd/prd.md`) and **Architecture Spine** (`_acl-output/3-solutioning/acl-architecture/ARCHITECTURE-SPINE.md`).

---

## Epic 1: Global State & Filter Store Enhancement

### Story 1.1: Extend Zustand Store with Assignee State & Action
- **Description:** Update `src/store/useJiraStore.ts` to support global `assigneeFilter` state, defaulting to `'all'`, with immutable setter actions and localStorage persistence.
- **Acceptance Criteria:**
  - [x] Add `assigneeFilter: string` to `JiraState` interface initialized to `'all'`.
  - [x] Add `setAssigneeFilter: (assignee: string) => void` action that returns a new state object immutably.
  - [x] Include `assigneeFilter` in the `persist` middleware storage configuration so preferences persist across browser reloads.
  - [x] Ensure strict TypeScript compliance under `verbatimModuleSyntax` and `erasableSyntaxOnly`.

### Story 1.2: Store Unit Tests for Assignee Filter
- **Description:** Implement unit tests in `src/store/__tests__/useJiraStore.test.ts` to test state transitions and immutability.
- **Acceptance Criteria:**
  - [x] Test verifying default `assigneeFilter` is `'all'`.
  - [x] Test verifying calling `setAssigneeFilter('Sarah Connor')` updates state cleanly.
  - [x] Test verifying updating `assigneeFilter` does not mutate issues or other store properties.

---

## Epic 2: Header Filter Controls & Responsive Styling

### Story 2.1: Assignee Filter UI Component in Header
- **Description:** Integrate the Assignee Filter selector into `src/components/Header.tsx` inside the `.search-filter-wrapper`.
- **Acceptance Criteria:**
  - [x] Dynamically compute `uniqueAssignees` from `issues` using `useMemo`, sorting alphabetically.
  - [x] Render a `.assignee-filter-container` with Lucide `User` icon (`size={15}`) and `<span className="filter-label">Assignee:</span>`.
  - [x] Render `<select className="assignee-select">` bound to `assigneeFilter` and `setAssigneeFilter`.
  - [x] Include `<option value="all">All Assignees</option>` as the first option followed by mapped assignees.

### Story 2.2: CSS Custom Properties & Responsive Layout
- **Description:** Add CSS rules in `src/styles.css` for `.assignee-filter-container` and `.assignee-select`.
- **Acceptance Criteria:**
  - [x] Match existing design tokens from `.priority-filter-container` and `.priority-select`.
  - [x] Maintain responsive flex-wrapping on narrow and tablet viewports without clipping `.header-stats-chips`.
  - [x] Avoid introducing external CSS libraries or modifying global design variables.

---

## Epic 3: Board View Filtering & Empty State Integration

### Story 3.1: Composite Filtering in Board View
- **Description:** Update the filtering pipeline in `src/components/BoardView.tsx` to include `assigneeFilter`.
- **Acceptance Criteria:**
  - [x] Update `filteredIssues` `useMemo` dependency array to include `assigneeFilter`.
  - [x] Evaluate composite filter condition: `matchesSearch && matchesPriority && matchesAssignee`.
  - [x] Ensure issues without an assignee or assigned to "Unassigned" are filterable via `'Unassigned'`.

### Story 3.2: Empty Results State & Filter Reset
- **Description:** Enhance empty state feedback and reset functionality in `src/components/BoardView.tsx`.
- **Acceptance Criteria:**
  - [x] Update `hasActiveFilters` to evaluate `searchQuery !== '' || priorityFilter !== 'all' || assigneeFilter !== 'all'`.
  - [x] Update `resetFilters` handler to call `setAssigneeFilter('all')`, resetting all filters atomically.
  - [x] In the empty state message (`.no-search-results`), display the active assignee filter when active.

### Story 3.3: Integration Testing & Verification
- **Description:** Validate full board filtering behavior and run end-to-end test assertions.
- **Acceptance Criteria:**
  - [x] Verify that selecting an assignee filters cards correctly across Backlog, To Do, In Progress, In Review, and Done columns.
  - [x] Verify that composite filters (Search + Priority + Assignee) compute the intersection accurately.
  - [x] Ensure all existing tests in `src/components/__tests__/` continue to pass with `npm test`.
  - [x] Run `npm run lint` with 0 errors.
