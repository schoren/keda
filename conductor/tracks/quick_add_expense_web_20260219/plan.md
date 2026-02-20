# Implementation Plan: Quick-Add Expense Screen

## Phase 1: Shared Logic and Data Types
This phase focuses on ensuring the `shared` package has the necessary data structures and API methods to handle expense creation.

- [ ] Task: Define `CreateExpenseRequest` and updated `Expense` types in `client/packages/shared/src/entities.ts`.
- [ ] Task: Write unit tests for `createExpense` API method in `client/packages/shared/src/__tests__/api.test.ts`.
- [ ] Task: Implement `createExpense` in `client/packages/shared/src/api.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Shared Logic' (Protocol in workflow.md)

## Phase 2: Custom Numeric Keypad Component
Development of the specialized UI component for rapid amount entry.

- [ ] Task: Write unit tests for `NumericKeypad` in `client/apps/web/components/NumericKeypad.test.tsx`.
- [ ] Task: Implement `NumericKeypad` component in `client/apps/web/components/NumericKeypad.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Custom Numeric Keypad' (Protocol in workflow.md)

## Phase 3: Expense Entry Screen & Integration
Implementation of the main screen and its integration with the backend and shared logic.

- [ ] Task: Scaffold the new route at `client/apps/web/app/categories/[id]/add-expense/page.tsx`.
- [ ] Task: Write integration tests for the expense submission flow in `client/apps/web/__tests__/add-expense.test.tsx`.
- [ ] Task: Implement screen UI including amount display, account selector, and optional fields.
- [ ] Task: Implement submission logic and success/error handling.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Screen Implementation' (Protocol in workflow.md)
