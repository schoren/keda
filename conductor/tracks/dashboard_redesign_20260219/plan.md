# Implementation Plan: "What's Left" Dashboard Redesign

## Phase 1: Shared Logic & Types [checkpoint: 6b5ca21]
- [x] Task: Implement shared budget health logic in `@repo/shared` 3acdebb
    - [x] Write unit tests for budget status calculation (Success, Warning, Danger)
    - [x] Export `getBudgetStatus` and related constants/types from `@repo/shared`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared Logic & Types' (Protocol in workflow.md)

## Phase 2: Visual Updates to Category Components [checkpoint: 9edffec]
- [x] Task: Update `CategoryCard` for "What's Left" focus e153a5f
    - [x] Write unit tests for `CategoryCard` using shared health logic
    - [x] Update `CategoryCard.tsx` to make "Remaining" amount the primary numeric element
    - [x] Ensure 24px border radius and monospace amounts
- [x] Task: Update `CategoryGrid` for Zero-Friction navigation e153a5f
    - [x] Write unit tests for redirection logic when a category is tapped
    - [x] Update `CategoryGrid.tsx` or `CategoryCard` to link directly to `/expenses/new?categoryId={id}`
    - [x] Add the "Add Quick Expense" placeholder at the end of the grid
- [x] Task: Conductor - User Manual Verification 'Phase 2: Visual Updates to Category Components' (Protocol in workflow.md)

## Phase 3: Dashboard Layout Refactoring [checkpoint: 9edffec]
- [x] Task: Implement Minimized Header in `app/page.tsx`
    - [x] Write tests for the existence and visibility of minimized header elements
    - [x] Refactor `app/page.tsx` to reduce the visual weight of the Total Balance summary
    - [x] Ensure the Category Grid is the most visually dominant section
- [x] Task: Conductor - User Manual Verification 'Phase 3: Dashboard Layout Refactoring' (Protocol in workflow.md)

## Phase 4: State & Polish [checkpoint: 9edffec]
- [x] Task: Verify Real-time Life Bar Updates
    - [x] Write integration test verifying that adding an expense immediately updates the category card's Life Bar
    - [x] Ensure smooth transitions and no layout shifts during updates
- [x] Task: Final Mobile UI Audit
    - [x] Verify that 24px radius and condensed grid look perfect on small screens
    - [x] Confirm zero-friction tapping targets meet accessibility standards (min 44px)
- [x] Task: Conductor - User Manual Verification 'Phase 4: State & Polish' (Protocol in workflow.md)

## Phase 5: Mobile Layout Refinements
- [ ] Task: Implement Mobile Sidebar (Hamburger Menu)
    - [ ] Update `DashboardLayout.tsx` to include a mobile-friendly drawer or slide-out menu.
    - [ ] Remove `BottomNav` on mobile to free up vertical space.
- [ ] Task: Condense Dashboard Header
    - [ ] Update `app/page.tsx` to use a minimal header on mobile (Hamburger + Month Navigator).
    - [ ] Remove search, notifications, and profile card from the mobile view.
- [ ] Task: Create Slim Fixed Bottom Summary
    - [ ] Implement `MobileSummary.tsx` showing Total vs Spent with a thin Life Bar.
    - [ ] Fix this summary to the bottom of the viewport on mobile devices.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Mobile Layout Refinements' (Protocol in workflow.md)
