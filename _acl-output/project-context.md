---
project_name: 'jira-clone'
project_type: brownfield
user_name: 'Karthick.natarajan'
date: '2026-09-09'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'Accepted'
rule_count: 27
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Framework & Runtime**: React 19.2.7, TypeScript 6.0.2 (targeting ES2023, bundler resolution)
- **Build Tooling**: Vite 8.1.1 (@vitejs/plugin-react 6.0.3), Oxlint 1.71.0
- **State Management**: Zustand 5.0.14 (`zustand/middleware` persist used for local storage synchronization)
- **Iconography**: Lucide React 1.26.0
- **Test Suite**: Vitest 5.0.0, JSDOM 29.1.1, @testing-library/react 16.3.3, @testing-library/jest-dom 7.0.1
- **Compatibility Notes**:
  - React 19 rules apply (use modern hooks; avoid deprecated legacy APIs).
  - TypeScript strict erasable syntax & verbatim module syntax are enforced.

## Critical Implementation Rules

### Language-Specific Rules

- **Strict Type-Only Imports (`verbatimModuleSyntax: true`)**:
  - Always use `import type { ... } from '...'` when importing interfaces, type aliases, or type definitions.
  - Never mix value and type imports in a single non-type import statement if the type is solely used for typing.
- **Erasable Syntax Only (`erasableSyntaxOnly: true`)**:
  - **No TypeScript Enums**: Use string literal union types instead (e.g., `export type Priority = 'low' | 'medium' | 'high'`).
  - Do not use runtime TypeScript constructs such as namespaces or parameter properties in class constructors.
- **Zero Unused Symbols**:
  - `noUnusedLocals` and `noUnusedParameters` are enabled. Unused variables, imports, or parameters will cause build failures during `tsc -b`. Prefix intentional unused handler parameters with `_`.
- **Target & Resolution**:
  - Target is modern `ES2023`. Native array/object methods (e.g. `toSorted()`, modern array features) are supported natively.
  - Bundler module resolution (`moduleResolution: "bundler"`).

### Framework-Specific Rules

- **Component Architecture**:
  - Components are typed with `React.FC<Props>` and explicit interface definitions (`interface ComponentNameProps { ... }`).
  - Use named exports consistently (`export const ComponentName: React.FC<Props> = ...`).
  - Place all UI components in `src/components/`.
- **State Management (Zustand)**:
  - Global state is accessed via `useJiraStore` from `src/store/useJiraStore.ts`.
  - State is persisted to `localStorage` under key `'jira-kanban-storage'`.
  - Keep state updates strictly immutable (use `map`, `filter`, spread syntax).
  - Issue IDs must strictly conform to `PROJ-${number}` auto-incremented from current store state.
  - Modals and edit states are managed centrally through store actions (`openModal`, `closeModal`, `selectedIssue`).
- **Interactive Event Handling**:
  - Nested interactive controls inside clickable cards (such as status selectors or actions) must call `e.stopPropagation()` or guard via `closest()` to prevent unintentionally triggering card modals.
- **Theme Synchronization**:
  - Theme preference is tracked via `localStorage.getItem('jira-theme-preference')` with fallback to `window.matchMedia('(prefers-color-scheme: light)')`.
  - Themes are applied by setting `data-theme="light"` or `data-theme="dark"` on `document.documentElement`.

### Testing Rules

- **Framework & Runner**:
  - All automated tests run via Vitest (`npm test` executes `vitest run`).
  - Environment is set to `jsdom` with `globals: true`.
- **Test File Organization**:
  - Tests must be placed inside `__tests__/` subdirectories adjacent to the target components (e.g., `src/components/__tests__/IssueCard.test.tsx`).
  - File naming pattern: `<ComponentName>.test.tsx`.
- **Global Setup & Environment Hygiene**:
  - Global test setup resides in `src/test/setup.ts` which automatically clears `localStorage` and cleans up theme attributes in `beforeEach`.
  - `window.matchMedia` is pre-mocked in `setup.ts`.
- **Testing Conventions & Accessibility**:
  - Query elements primarily through semantic ARIA roles and accessible text (`screen.getByRole`, `screen.getByLabelText`, `screen.getByText`).
  - Always verify modal lifecycle: backdrop clicking, `Escape` keyboard shortcuts, close buttons, and state dispatch.
  - Mock callbacks and handler spies using `vi.fn()`.

### Code Quality & Style Rules

- **Linter (Oxlint)**:
  - Run lint verification via `npm run lint` (`oxlint`). Code must pass without warnings or errors.
- **Design System & CSS Custom Properties**:
  - Global styles and tokens are centralized in `src/styles.css`.
  - Never hardcode hex color codes inside components; always consume design variables (e.g., `var(--bg-card)`, `var(--text-primary)`, `var(--accent-blue)`).
  - Use semantic BEM-like class names (`issue-card`, `card-top`, `modal-backdrop`, `avatar-circle`) rather than inline style objects.
- **Naming Conventions**:
  - Components: `PascalCase.tsx` (e.g., `BoardView.tsx`, `IssueModal.tsx`).
  - Zustand Stores: `camelCase.ts` prefixed with `use` (e.g., `useJiraStore.ts`).
  - Domain Types: `kebab-case.ts` or `camelCase.ts` under `src/types/` (e.g., `jira.ts`).
  - Unit Tests: `<ComponentName>.test.tsx` within an adjacent `__tests__/` directory.
- **Clean Architecture & File Size**:
  - Keep components modular. Separate modal presentation, column containers, and card rendering into dedicated files.

### Development Workflow Rules

- **Build & Verification Pipeline**:
  - `npm run build` runs `tsc -b && vite build`. Any type discrepancy will block the build.
  - `npm test` runs the entire Vitest suite headlessly. Run this before committing any feature or refactor.
  - `npm run lint` runs Oxlint for rapid syntax and stylistic verification.
- **Commit Conventions**:
  - Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:` with issue key references where applicable (e.g., `feat: add swimlane filtering [PROJ-108]`).

### Critical Don't-Miss Rules

- 🛑 **Never use TypeScript Enums**:
  - Enforced by `erasableSyntaxOnly`. Always use string union types (e.g. `'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done'`).
- 🛑 **Never import types as values**:
  - Enforced by `verbatimModuleSyntax`. Always use `import type { ... } from ...`.
- 🛑 **Never mutate Zustand state**:
  - Always return new array and object references in `useJiraStore` actions (`map`, `filter`, spread).
- 🛑 **Never bypass event containment in cards**:
  - Any interactive element nested inside `.issue-card` (like `<select>`, buttons, or links) MUST stop event bubbling (`e.stopPropagation()` or `(e.target as HTMLElement).closest(...)`) to prevent unwanted card selection/modal triggers.
- 🛑 **Never introduce external CSS-in-JS or Tailwind**:
  - Maintain the native CSS custom properties system defined in `src/styles.css`.
- ⚠️ **ID Generation Invariant**:
  - New issue IDs MUST follow the `PROJ-${number}` sequence derived from the existing max number + 1.
- ⚠️ **Date Invariants**:
  - `createdAt` and `updatedAt` strings must adhere to `YYYY-MM-DD` (`new Date().toISOString().split('T')[0]`).

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-09-09
