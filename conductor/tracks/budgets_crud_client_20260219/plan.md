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

## Phase 3: Budget Create/Edit Form
- [ ] Task: Implement Budget Form Component
    - [ ] Write tests for the form validation and submission
    - [ ] Create `BudgetForm.tsx` using Shadcn UI (Form, Input, Button, Icon selector)
    - [ ] Implement "Create Budget" functionality with a Modal
- [ ] Task: Implement Edit Budget functionality
    - [ ] Write tests for editing an existing budget
    - [ ] Update `BudgetForm.tsx` to support "Edit" mode
    - [ ] Integrate Edit Modal into the `BudgetListItem`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Budget Create/Edit Form' (Protocol in workflow.md)

## Phase 4: Delete & Refinement
- [ ] Task: Implement Delete Budget functionality
    - [ ] Write tests for deleting a budget with confirmation
    - [ ] Create a `DeleteCategoryDialog` component
    - [ ] Integrate delete functionality into the Budget List
- [ ] Task: Final UI Polish & Mobile Responsiveness
    - [ ] Ensure the budgets page looks great on mobile
    - [ ] Add loading states and error handling for all API operations
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Delete & Refinement' (Protocol in workflow.md)
