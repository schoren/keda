# Specification: Budget Management CRUD (Client)

## Objective
Provide a dedicated user interface in the web application for managing expense categories and their associated monthly budgets. This is a core part of the "What's Left" budgeting philosophy.

## User Stories
- As a user, I want to see a list of all my budget categories and their monthly limits.
- As a user, I want to create new budget categories with a name, icon, and monthly amount.
- As a user, I want to edit existing budget categories to update their limits or change their name/icon.
- As a user, I want to delete categories I no longer use.

## Functional Requirements
- **Budget List:** Display all active categories with their monthly budget amount.
- **Create Budget:** Form to input category name, select an icon, and set a monthly budget.
- **Edit Budget:** Pre-populated form to update category details.
- **Delete Budget:** Confirmation modal before permanently removing a category.
- **Real-time Updates:** The UI should reflect changes immediately after a successful API call.

## UI/UX Design (Product Guidelines)
- **Clean & Modern:** Use Shadcn UI components for a consistent, professional look.
- **Friendly Tone:** Use encouraging labels (e.g., "Set your goal" instead of "Enter budget").
- **Accessibility:** Ensure all forms are accessible via keyboard and have proper ARIA labels.
- **Icon Selection:** Provide a grid of common icons (using Lucide-React) for users to choose from.

## Tech Stack & Architecture
- **Framework:** Next.js (App Router).
- **Styling:** Tailwind CSS + Shadcn UI.
- **State Management:** React hooks + Shared ApiClient.
- **Validation:** Zod for form validation.
- **Testing:** Vitest + React Testing Library (TDD approach).

## API Integration
- `GET /households/{id}/categories`: Fetch all categories.
- `POST /households/{id}/categories`: Create a new category.
- `PUT /households/{id}/categories/{catId}`: Update an existing category.
- `DELETE /households/{id}/categories/{catId}`: Delete a category.
