# Implementation Plan: "What's Left" Dashboard Redesign

## Phase 1: Shared Logic & Types [checkpoint: 6b5ca21]
- [x] Task: Implement shared budget health logic in `@repo/shared` 3acdebb
    - [x] Write unit tests for budget status calculation (Success, Warning, Danger)
    - [x] Export `getBudgetStatus` and related constants/types from `@repo/shared`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared Logic & Types' (Protocol in workflow.md)

## Phase 2: Visual Updates to Category Components
- [x] Task: Update `CategoryCard` for "What's Left" focus e153a5f
    - [x] Write unit tests for `CategoryCard` using shared health logic
    - [x] Update `CategoryCard.tsx` to make "Remaining" amount the primary numeric element
    - [x] Ensure 24px border radius and monospace amounts
- [x] Task: Update `CategoryGrid` for Zero-Friction navigation e153a5f
    - [x] Write unit tests for redirection logic when a category is tapped
    - [x] Update `CategoryGrid.tsx` or `CategoryCard` to link directly to `/expenses/new?categoryId={id}`
    - [x] Add the "Add Quick Expense" placeholder at the end of the grid
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Visual Updates to Category Components' (Protocol in workflow.md)

## Phase 3: Dashboard Layout Refactoring
- [ ] Task: Implement Minimized Header in `app/page.tsx`
    - [ ] Write tests for the existence and visibility of minimized header elements
    - [ ] Refactor `app/page.tsx` to reduce the visual weight of the Total Balance summary
    - [ ] Ensure the Category Grid is the most visually dominant section
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dashboard Layout Refactoring' (Protocol in workflow.md)

## Phase 4: State & Polish
- [ ] Task: Verify Real-time Life Bar Updates
    - [ ] Write integration test verifying that adding an expense immediately updates the category card's Life Bar
    - [ ] Ensure smooth transitions and no layout shifts during updates
- [ ] Task: Final Mobile UI Audit
    - [ ] Verify that 24px radius and condensed grid look perfect on small screens
    - [ ] Confirm zero-friction tapping targets meet accessibility standards (min 44px)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: State & Polish' (Protocol in workflow.md)
