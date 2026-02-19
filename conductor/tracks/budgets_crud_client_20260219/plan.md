# Implementation Plan: Budget Management CRUD (Client)

## Phase 1: Shared Logic & Types [checkpoint: 4fc7c69]
- [x] Task: Verify and update shared Category entities and ApiClient methods
    - [x] Ensure `Category` entity in `shared` package matches backend requirements (MonthlyBudget, Icon, etc.)
    - [x] Add unit tests for `ApiClient.createCategory`, `ApiClient.updateCategory`, and `ApiClient.deleteCategory`
    - [x] Implement/Update shared logic if necessary
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared Logic & Types' (Protocol in workflow.md)

## Phase 2: Budget List UI [checkpoint: d39fede]
- [x] Task: Create Budget List Page (`/budgets`)
    - [x] Write tests for fetching and displaying the list of budgets
    - [x] Implement the `/budgets/page.tsx` using `ApiClient.getCategories()`
    - [x] Create a `BudgetListItem` component to display each category neatly
- [x] Task: Conductor - User Manual Verification 'Phase 2: Budget List UI' (Protocol in workflow.md)

## Phase 3: Budget Create/Edit Form [checkpoint: 5411e09]
- [x] Task: Implement Budget Form Component
    - [x] Write tests for the form validation and submission
    - [x] Create `BudgetForm.tsx` using Shadcn UI (Form, Input, Button, Icon selector)
    - [x] Implement "Create Budget" functionality with a Modal
- [x] Task: Implement Edit Budget functionality
    - [x] Write tests for editing an existing budget
    - [x] Update `BudgetForm.tsx` to support "Edit" mode
    - [x] Integrate Edit Modal into the `BudgetListItem`
- [x] Task: Conductor - User Manual Verification 'Phase 3: Budget Create/Edit Form' (Protocol in workflow.md)

## Phase 4: Delete & Refinement
- [x] Task: Implement Delete Budget functionality
    - [x] Write tests for deleting a budget with confirmation
    - [x] Create a `DeleteCategoryDialog` component
    - [x] Integrate delete functionality into the Budget List
- [x] Task: Final UI Polish & Mobile Responsiveness
    - [x] Ensure the budgets page looks great on mobile
    - [x] Add loading states and error handling for all API operations
- [x] Task: Conductor - User Manual Verification 'Phase 4: Delete & Refinement' (Protocol in workflow.md)
