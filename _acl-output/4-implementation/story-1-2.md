---
status: In Review
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-10T04:36:26.743Z
gate_signature: ACL-STUDIO-APPROVAL-IN-REVIEW
title: "Story 1.2: Store Unit Tests for Assignee Filter"
tier: Tier 2 (Major Overhaul)
story_id: "1.2"
epic_id: "1"
created: 2026-09-10
---

# 📦 Story 1.2: Store Unit Tests for Assignee Filter

## Overview & Scope
Implement unit tests in `src/store/__tests__/useJiraStore.test.ts` to verify state transitions and immutability for the newly added `assigneeFilter` store property and `setAssigneeFilter` action.

## Technical Contract
- **Test File**: `src/store/__tests__/useJiraStore.test.ts`
- **Assertions**:
  - Verify that the initial `assigneeFilter` state evaluates to `'all'`.
  - Verify that invoking `useJiraStore.getState().setAssigneeFilter('Sarah Connor')` updates `assigneeFilter` to `'Sarah Connor'`.
  - Verify that invoking `setAssigneeFilter` preserves the existing `issues` list, `searchQuery`, `priorityFilter`, and other store properties without mutations.
- **Test Framework**: Vitest.

## Acceptance Criteria
- [x] Test verifying default `assigneeFilter` is `'all'`.
- [x] Test verifying calling `setAssigneeFilter('Sarah Connor')` updates state cleanly.
- [x] Test verifying updating `assigneeFilter` does not mutate issues or other store properties.
