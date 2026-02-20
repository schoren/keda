# Implementation Plan: Accounts CRUD

## Phase 1: Shared Logic and API Client [checkpoint: fa1d545]
- [x] Task: Update `Account` entity and define `AccountType` in `client/packages/shared/src/entities.ts`. 0897a0f
- [x] Task: Implement `getAccounts`, `createAccount`, `updateAccount`, and `deleteAccount` in `client/packages/shared/src/api.ts`. (Verified existing)
- [x] Task: Add unit tests for the new API methods in `client/packages/shared/src/__tests__/api.test.ts`. (Verified existing)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared Logic' (Protocol in workflow.md)

## Phase 2: Account Management UI [checkpoint: 8d53eee]
- [x] Task: Create the `/accounts` page component in `client/apps/web/app/accounts/page.tsx`. 166b4cb
- [x] Task: Implement `AccountList` component with support for displaying the backend-generated `display_name`. 166b4cb
- [x] Task: Implement `AccountForm` component with dynamic fields based on the selected `type`. 166b4cb
- [x] Task: Integrate `create`, `update`, and `delete` actions with the UI and handle mandatory `cash` account restrictions. 166b4cb
- [x] Task: Add unit tests for `AccountList` and `AccountForm` in `client/apps/web/components/__tests__/`. 363542e
- [x] Task: Conductor - User Manual Verification 'Phase 2: Account Management UI' (Protocol in workflow.md)

## Phase 3: UX Polishing and Integration [checkpoint: 7ce02b4]
- [x] Task: Ensure the layout is responsive and mobile-friendly. 166b4cb
- [x] Task: Add loading states and error handling for all account actions. 1073528
- [x] Task: Update navigation to include a link to the `/accounts` page. 1073528
- [x] Task: Conductor - User Manual Verification 'Phase 3: UX Polishing' (Protocol in workflow.md)
