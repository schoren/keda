# Specification: Quick-Add Expense Screen (Web PWA)

## Overview
Implement a mobile-optimized "Quick-Add" expense screen for the Keda Web PWA. This screen is designed for rapid entry of expenses while on the go. To minimize friction, the screen assumes the user is adding an expense to a specific budget category, with the `category_id` provided via the URL.

## Functional Requirements
- **Context-Aware Category:** The screen must extract the `category_id` from the URL parameters. The category selection will not be displayed to the user as it is implicitly defined by the context.
- **Custom Numeric Keypad:** Provide a large, mobile-friendly custom numeric keypad for quick amount entry, avoiding the standard system keyboard for a more "app-like" experience.
- **Account Selection:** A dropdown or selection list for the user to choose which account (e.g., Checking, Cash, Credit Card) the expense should be deducted from.
- **Optional Note:** A text field for adding a brief description or note to the expense.
- **Optional Date:** A date picker defaulting to the current date, allowing the user to backdate expenses if necessary.
- **Validation:**
    - Amount must be greater than zero.
    - An account must be selected.
- **Persistence:** Save the expense via the Backend API.

## UI/UX Requirements
- **Mobile-First Design:** Optimized for one-handed "thumb" use.
- **Responsive Layout:** Ensure the keypad and form elements are well-spaced and accessible on various mobile screen sizes.
- **Immediate Feedback:** Clear visual confirmation upon successful submission or error.

## Acceptance Criteria
- [ ] Navigating to `/categories/:id/add-expense` loads the screen.
- [ ] The amount can be entered and edited using the custom keypad.
- [ ] A list of user accounts is fetched and selectable.
- [ ] Submitting a valid form sends a POST request to the backend with the correct `category_id`, `amount`, `account_id`, `note`, and `date`.
- [ ] The user is redirected back to the category detail view or dashboard upon success.
- [ ] Error messages are displayed if the API request fails or validation fails.

## Out of Scope
- Receipt scanning or OCR functionality.
- Changing the category from within this screen.
- Implementing recurring expense logic.
