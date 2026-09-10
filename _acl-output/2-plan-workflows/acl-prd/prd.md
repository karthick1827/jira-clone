---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-09T18:36:04.142Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: Assignee Filter Option PRD
created: 2026-09-09
updated: 2026-09-09
---

# 📋 Product Requirements Document (PRD)
## Feature: Assignee Filter Option (Jira Sprint Board)

---

## 0. Document Purpose

This document defines the functional, technical, and operational requirements for the **Assignee Filter Option** feature on the Jira Clone Sprint Board. This PRD acts as the official contract between Product Management, Engineering, and QA for Phase 2 under ACL-ADLC sequential delivery protocol. It informs the downstream **Phase 3A Architecture Spine** and **Phase 3B Epics & Stories Breakdown**.

---

## 1. Product Vision & Executive Summary

The **Assignee Filter Option** empowers team members, engineering leads, and scrum masters to filter board tasks by individual team members or unassigned work items in a single click. As teams scale their sprint boards with dozens of issues across Backlog, To Do, In Progress, In Review, and Done, finding tickets assigned to a specific engineer becomes tedious. 

Adding an assignee filter dropdown alongside the existing Search query bar and Priority filter dropdown establishes a comprehensive, multi-dimensional query toolbar, dramatically improving sprint standup efficiency, personal workflow isolation, and individual task tracking.

### Core Objectives
1. **Targeted Task Focus:** Allow developers to isolate their personal tasks (e.g. "Karthick N") with zero noise during daily standups.
2. **Unassigned Issue Triage:** Enable sprint leads to quickly isolate "Unassigned" issues for immediate sprint grooming and assignment.
3. **Multi-Filter Composability:** Seamlessly compose Assignee filtering with existing text search (by title/key) and Priority filtering (High/Medium/Low).
4. **Persistent State Experience:** Maintain selected assignee filter preferences across sessions and page refreshes via the established Zustand storage synchronizer.

---

## 2. Target User & Key User Journeys

### 2.1 Target Personas
- **Sprint Developer (Primary):** Wants to view only their assigned cards across all board columns to update progress and transition statuses during daily standup.
- **Scrum Master / Lead (Secondary):** Wants to inspect individual member workload distributions, verify balanced assignments, or identify unassigned tickets requiring triage.

### 2.2 User Journeys

- **UJ-1: Engineer Filters for Personal Tickets During Standup**
  - **Persona & Context:** Karthick (Senior Frontend Engineer) joins the daily 15-minute standup call.
  - **Entry State:** Board displays 30+ mixed issues across all 5 columns. Search bar is empty, Priority filter is set to "All Priorities".
  - **Path:**
    1. Karthick clicks the "Assignee" filter dropdown in the header controls row.
    2. He selects "Karthick N".
    3. The board immediately filters issues across all columns to display only cards assigned to "Karthick N".
    4. The header status statistics chips update or reflect the focused view.
  - **Climax:** Karthick easily talks through his in-progress and in-review tickets without visual clutter.
  - **Resolution:** Karthick concludes his update and resets the filter to return to full board view.

- **UJ-2: Lead Identifies Unassigned Backlog Items**
  - **Persona & Context:** Sarah (Engineering Manager / Scrum Lead) conducts sprint grooming.
  - **Entry State:** Board has several issues in Backlog and To Do.
  - **Path:**
    1. Sarah opens the "Assignee" dropdown and selects "Unassigned".
    2. The board isolates all tickets currently without an owner (`assignee: 'Unassigned'`).
    3. Sarah clicks on an unassigned ticket, opens the modal, and assigns it to Alex Rivera.
  - **Climax:** The reassigned ticket dynamically drops out of the "Unassigned" view in real-time.
  - **Resolution:** All tickets in the sprint are cleanly owned.

- **UJ-3: Multi-Criteria Filter Intersection & Reset**
  - **Persona & Context:** Alex (Frontend Dev) searching for high-priority bugs assigned to Elena.
  - **Entry State:** Board view is active.
  - **Path:**
    1. Alex sets Priority filter to "High Priority".
    2. Alex sets Assignee filter to "Elena Rostova".
    3. Board calculates intersection: `priority === 'high' && assignee === 'Elena Rostova'`.
    4. If no tickets match, the board renders the empty search state with a "Reset Search & Filters" button.
    5. Alex clicks "Reset Search & Filters", which resets Assignee to "All Assignees", Priority to "All Priorities", and Search to `""`.
  - **Climax:** Smooth recovery from zero-result intersections.

---

## 3. Domain Glossary

- **Assignee:** The team member string associated with an issue (e.g., `'Karthick N'`, `'Sarah Connor'`, `'Unassigned'`).
- **Assignee Filter (`assigneeFilter`):** Global store state string representing current filter selection: `'all' | string`.
- **Composite Filtering:** The logical AND evaluation: `matchesSearch && matchesPriority && matchesAssignee`.
- **Dynamic Assignee Extraction:** Deriving unique assignee names programmatically from the current `issues` collection, deduplicating, sorting alphabetically, and ensuring `'Unassigned'` is handled cleanly.

---

## 4. Functional Requirements

### FR-1: Assignee Filter State in Zustand Store
- **FR-1.1:** Extend `JiraState` with `assigneeFilter: string` initialized to `'all'`.
- **FR-1.2:** Add action `setAssigneeFilter: (assignee: string) => void` updating state immutably.
- **FR-1.3:** Include `assigneeFilter` in Zustand `persist` whitelist/partialize array so selection persists across browser reloads.

### FR-2: Dynamic Assignee Options Extraction
- **FR-2.1:** The UI must extract unique assignees dynamically from `issues` in `useJiraStore`.
- **FR-2.2:** The dropdown options must always include:
  1. `"All Assignees"` (value: `'all'`) as the default first option.
  2. Alphabetically sorted unique assignee names present in the system.
  3. `"Unassigned"` (if unassigned issues exist) positioned at the bottom or logically sorted.
- **FR-2.3:** If an assignee is deleted or renamed while selected, the store must gracefully fall back to `'all'`.

### FR-3: Header Controls Row UI Integration
- **FR-3.1:** Place the Assignee Filter control adjacent to the Priority Filter inside `.search-filter-wrapper` in `src/components/Header.tsx`.
- **FR-3.2:** Maintain consistent layout styling:
  - Icon: Lucide `User` or `Users` icon (`size={15}`).
  - Label: `<span class="filter-label">Assignee:</span>`.
  - Dropdown: `<select className="assignee-select">` mirroring `.priority-select` styles.
- **FR-3.3:** Maintain responsive wrapping across desktop and tablet screen widths without breaking the `.header-stats-chips` layout.

### FR-4: Board View Filtering & Empty State Integration
- **FR-4.1:** Update `filteredIssues` `useMemo` in `src/components/BoardView.tsx` to evaluate:
  ```typescript
  const matchesAssignee = assigneeFilter === 'all' || issue.assignee === assigneeFilter;
  return matchesSearch && matchesPriority && matchesAssignee;
  ```
- **FR-4.2:** Update `hasActiveFilters` in `BoardView.tsx`:
  ```typescript
  const hasActiveFilters = searchQuery !== '' || priorityFilter !== 'all' || assigneeFilter !== 'all';
  ```
- **FR-4.3:** Update `resetFilters` function in `BoardView.tsx` to call `setAssigneeFilter('all')`.
- **FR-4.4:** In the empty state message (`.no-search-results`), display the active assignee filter when active (e.g. `assigned to "Sarah Connor"`).

---

## 5. Non-Functional Requirements

- **NFR-1 (Zero Mutation & Zustand Invariants):** Actions must strictly adhere to project invariants in `_acl-output/project-context.md`. Never mutate state directly.
- **NFR-2 (Strict TypeScript Compliance):** `verbatimModuleSyntax` and `erasableSyntaxOnly` must be strictly respected. No TypeScript enums. Use `import type` for type-only imports.
- **NFR-3 (Performance):** Filter calculations in `useMemo` must execute in `<16ms` (sub-frame) for up to 1,000 issues.
- **NFR-4 (Styling Integrity):** Leverage existing CSS custom variables in `src/styles.css` without introducing external utility frameworks or conflicting inline overrides.
- **NFR-5 (Test Verification):** Maintain 100% pass rate in Vitest unit and integration test suite (`npm test`).

---

## 6. Assumptions & Open Questions

- `[ASSUMPTION]` **Dynamic vs Static Roster:** Dynamic extraction from active issues is preferred for Brownfield v1, as no centralized user/employee database table currently exists in `useJiraStore.ts`.
- `[ASSUMPTION]` **Single-Select Dropdown:** A single-select `<select>` element aligns with the current Priority filter design language and avoids introducing heavyweight multi-select libraries.
- `[ASSUMPTION]` **Reset Behavior:** "Reset Search & Filters" resets all three controls (searchQuery, priorityFilter, assigneeFilter) simultaneously.

---

## 7. Downstream Traceability

Upon manager sign-off of this PRD in Markdown Studio:
- **Phase 3A:** Technical architecture spine (`_acl-output/3-solutioning/acl-architecture/ARCHITECTURE-SPINE.md`) will define interface contracts, state migration strategy, and component hierarchy.
- **Phase 3B:** Epics & Stories breakdown (`_acl-output/3-solutioning/acl-create-epics-and-stories/epics.md`) will break down the implementation tasks for store enhancement, header UI, and board filtering.
