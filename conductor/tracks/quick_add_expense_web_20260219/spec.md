# Specification: Quick-Add Expense Screen (Web PWA)

## Overview
Implement a mobile-optimized "Quick-Add" expense screen for the Keda Web PWA. This screen is designed for rapid entry of expenses while on the go. To minimize friction, the screen assumes the user is adding an expense to a specific budget category, with the `category_id` provided via the URL.

## Functional Requirements
- **Context-Aware Category:** The screen must extract the `category_id` from the URL parameters. The category selection will not be displayed to the user.
- **Platform-Specific Amount Input:**
    - **Mobile:** A large, custom numeric keypad for quick entry. Keypad must include buttons for `00` and `000`.
    - **Desktop:** A standard numeric input field.
- **Real-Time Formatting:** Automatically add thousand separators as the user types (both mobile and desktop).
- **Dynamic Font Size:** The amount display must always be fully visible; the font size should decrease dynamically if the number exceeds the container width.
- **Budget Impact Visibility:** Display the category's current remaining balance and the projected balance (remaining - entered amount) in real-time above the amount input.
- **Account Selection:** Default to the first available account. The form is valid as soon as an amount > 0 is entered.
- **Notes with Autocomplete:** A text field for adding notes, featuring autocomplete suggestions based on historical expenses in the same category.
- **Optional Date:** A date picker defaulting to the current date.
- **Persistence:** Save the expense via the Backend API.

## UI/UX Requirements
- **Mobile UI Layout:**
    - **Fixed Action:** The "Save" button must be fixed at the bottom of the viewport.
    - **Scroll Indicators:** Visual indication (e.g., gradient or hint) that more fields (Note, Date, Account) are available by scrolling.
- **Mobile-First Design:** Optimized for one-handed "thumb" use on mobile devices.
- **Immediate Feedback:** Clear visual confirmation upon successful submission or error.

## Acceptance Criteria
- [ ] Navigating to `/categories/:id/add-expense` loads the screen.
- [ ] Custom keypad appears on mobile; standard input on desktop.
- [ ] Keypad includes `00` and `000`.
- [ ] Thousand separators appear correctly during entry.
- [ ] Amount font size shrinks to fit the screen width for large numbers.
- [ ] Remaining and projected balances update as the amount is typed.
- [ ] Notes field provides autocomplete suggestions from the same category.
- [ ] Save button is fixed at the bottom on mobile.
- [ ] Submitting a valid form sends correct data to the backend.

## Out of Scope
- Receipt scanning or OCR functionality.
- Changing the category from within this screen.
