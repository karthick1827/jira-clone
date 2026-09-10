---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-09T19:03:55.368Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: "Story 1.1: Extend Zustand Store with Assignee State & Action"
tier: Tier 2 (Major Overhaul)
story_id: "1.1"
epic_id: "1"
created: 2026-09-10
---

# 📦 Story 1.1: Extend Zustand Store with Assignee State & Action

## Overview & Scope
Update the global store in `src/store/useJiraStore.ts` to introduce global `assigneeFilter` state, defaulting to `'all'`, with an immutable setter action and localStorage persistence.

## Technical Contract
- **State Interface**:
  - Add `assigneeFilter: string` property to `JiraState` interface.
  - Default value: `'all'`.
- **Actions**:
  - Add `setAssigneeFilter: (assignee: string) => void` action.
  - State transition must update `assigneeFilter` immutably without altering `issues`, `columns`, or other store slices.
- **Persistence Middleware**:
  - Ensure `assigneeFilter` is included in the `persist` middleware whitelist/storage config.
- **Compiler Compatibility**:
  - Strict TypeScript compliance under `verbatimModuleSyntax` and `erasableSyntaxOnly`.

## Acceptance Criteria
- [x] Add `assigneeFilter: string` to `JiraState` interface initialized to `'all'`.
- [x] Add `setAssigneeFilter: (assignee: string) => void` action that returns a new state object immutably.
- [x] Include `assigneeFilter` in the `persist` middleware storage configuration so preferences persist across browser reloads.
- [x] Ensure strict TypeScript compliance under `verbatimModuleSyntax` and `erasableSyntaxOnly`.
