# Specification: "What's Left" Dashboard Redesign

## Overview
Redesign the primary dashboard to strictly align with the "What matters is what's left" philosophy. The UI will prioritize visual "life bars" for each category and provide a zero-friction path to entering new expenses. Reusable logic for budget health will be centralized in the shared package.

## Functional Requirements
- **Condensed Mobile Header:** On mobile, the header will be drastically simplified:
    - Hamburger menu button to open the Sidebar.
    - Month Navigator placed directly next to the hamburger button.
    - Remove profile image, search, and notification icons from the top fold.
- **"Life Bar" Grid:** The main content area will feature a grid of Category Cards. Each card will prominently display:
    - The "Remaining" amount as the largest numeric element.
    - A dynamic "Life Bar" (progress bar) that changes color based on health:
        - Success (Green): > 30% remaining.
        - Warning (Amber): 10-30% remaining.
        - Danger (Red): < 10% remaining or over-budget.
- **Slim Fixed Bottom Summary:** A minimal, fixed summary bar at the bottom of the screen showing total monthly budget status (Spent vs Total) with a slim life bar. This replaces the `BottomNav` on mobile.
- **Zero-Friction Entry:** Tapping any Category Card will immediately redirect the user to `/expenses/new?categoryId={id}` with the category pre-selected.
- **Quick-Add Placeholder:** The final item in the category grid will be a "New Category" or "Add Quick Expense" placeholder to maintain the scannable layout.

## UI/UX Design (Product Guidelines)
- **Atmosphere:** Data-driven minimalism (Slate 50 background).
- **Hierarchy:** "Remaining" amount is the primary focus of every card.
- **Typography:** Monospace fonts for all numeric amounts to ensure clarity.
- **Geometry:** 24px border radius for all cards.

## Shared Logic (repo/shared)
- Centralize logic for determining budget "health" (percentage remaining and corresponding status/color) to ensure consistency between Web and Mobile apps.

## Out of Scope
- Implementation of the mobile-specific "Modal Overlay" for expenses (deferred to a later track).
- Complex charts or data-heavy tables on the main dashboard.
