# Specification: Accounts CRUD Implementation

## Overview
Implement the complete CRUD (Create, Read, Update, Delete) lifecycle for financial accounts in Keda. Accounts are used as the primary sources/targets for transactions and are categorized into specific types to support varied display logic.

## Functional Requirements

### 1. Account Types & Data Model
- **Types:** `cash`, `card`, `bank`, `other`.
- **Mandatory Cash Account:**
    - Each household has exactly one mandatory "Cash" account (auto-created).
    - This account cannot be deleted or renamed.
- **Dynamic Attributes:**
    - **`cash`:** Basic account, no extra fields.
    - **`card`:** Supports optional `Brand` (e.g., Visa) and `Bank` (e.g., Chase).
    - **`bank` & `other`:** Support a mandatory `Name` (e.g., Savings).
- **Core Attributes:**
    - `id` (UUID, internal)
    - `type` (Enum: `cash`, `card`, `bank`, `other`)
    - `name` (Optional for `card`, mandatory for `bank` and `other`)
    - `brand` (Optional for `card`)
    - `bank` (Optional for `card`, `bank`)
    - `household_id` (UUID, mandatory)
    - `deleted_at` (Timestamp, handled by backend soft delete)

### 2. Creation Form (`POST /households/:id/accounts`)
- **UI:** A dedicated form on the `/accounts` page.
- **Dynamic Fields:**
    - Always show `Type` selection.
    - If `card`: Show `Brand` and `Bank` inputs.
    - If `bank` or `other`: Show `Name` input.
- **Validation:** Type-specific mandatory fields (e.g., `Name` for `bank` or `other`).

### 3. Account List & Display (`GET /households/:id/accounts`)
- **Route:** `/accounts` page.
- **Display Logic (Handled by Backend):**
    - `cash` -> "Cash"
    - `card` (Brand: "Visa", Bank: "Chase") -> "Visa - Chase"
    - `card` (Brand: "Visa") -> "Visa"
    - `card` (Bank: "Chase") -> "Chase"
    - `card` (Basic) -> "Card"
    - `bank`/`other` (Name: "X") -> "X"

### 4. Update (`PATCH /households/:id/accounts/:account_id`)
- Allow editing all attributes except `id` and `household_id`.
- Editing is disabled for the mandatory `cash` account.

### 5. Deletion (`DELETE /households/:id/accounts/:account_id`)
- **Policy:** Soft Delete.
- Handled by the backend via GORM's `DeletedAt`.
- Mandatory `cash` account cannot be deleted.

## Non-Functional Requirements
- **Test-Driven Development (TDD):** The backend is already implemented and tested. Focus on frontend and shared logic.
- **Mobile First:** Ensure the account creation form and list view are touch-friendly.
- **Security:** Backend already validates `household_id` against the session.

## Acceptance Criteria
- [ ] Users can create an account with the correct type-specific details.
- [ ] Users can view a list of their accounts with correct display names.
- [ ] Users can soft-delete an account (it remains in the DB but is hidden).
- [ ] Users cannot delete or rename the mandatory "Cash" account.
- [ ] Account management is accessible via the `/accounts` route.

## Out of Scope
- Initial Balance setting.
- Hard deletion of accounts.
