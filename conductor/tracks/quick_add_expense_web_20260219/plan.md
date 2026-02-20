# Implementation Plan: Quick-Add Expense Screen

## Phase 1: Shared Logic and Data Types [checkpoint: 62f9bfa]
- [x] Task: Define `CreateExpenseRequest` and updated `Expense` types in `client/packages/shared/src/entities.ts`.
- [x] Task: Implement `getCategoryHistory` and `getCategoryBalance` helpers in `client/packages/shared/src/api.ts` for autocomplete and balance tracking.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared Logic' (Protocol in workflow.md)

## Phase 2: Specialized UI Components [checkpoint: 69cd459]
- [x] Task: Implement `NumericKeypad` with `00`/`000` support and mobile/desktop conditional rendering.
- [x] Task: Implement `DynamicAmountDisplay` with auto-scaling font size and thousand separator formatting logic.
- [x] Task: Implement `NoteAutocomplete` component using category history data.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Specialized UI Components' (Protocol in workflow.md)

## Phase 3: Screen Integration & UX Refinement
- [ ] Task: Implement real-time budget impact calculations (Remaining vs Projected).
- [ ] Task: Implement the mobile layout with fixed "Save" button and scroll indicators.
- [ ] Task: Integrate components into the main route and implement submission logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Screen Implementation' (Protocol in workflow.md)
