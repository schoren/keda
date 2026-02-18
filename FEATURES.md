# Keda Web Client — Feature List

Comprehensive list of features being migrated from the old Flutter client (`client-old`) to the new React web client (`client/apps/web`), with reusable logic in `client/packages/shared`.

---

## Authentication & Onboarding

| Feature | Description | Status |
|---|---|---|
| Google Sign-In | OAuth2 login via Google | ✅ Exists |
| Invite Code | Join household via invite code during login | ✅ Exists |
| Session Persistence | Token + user stored in localStorage | ✅ Exists |
| Auto-login | Restore session on app load | ✅ Exists |

---

## Dashboard (Home)

| Feature | Description | Status |
|---|---|---|
| Monthly Budget Summary | Total budget, spent, remaining with progress bar | ✅ Exists |
| Category Grid | Cards per category showing budget vs spent with progress | ✅ Exists |
| Month Navigation | Arrow buttons to navigate between months | 🔨 Building |
| Recommendations Banner | AI budget recommendations notification | 🔨 Building |
| Quick Add Expense | FAB / button to add new expense | ✅ Exists |

---

## New Expense Screen ⭐ (Redesign)

| Feature | Description | Status |
|---|---|---|
| Category Context | Shows selected category name, icon, and remaining budget | 🔨 Building |
| Amount Input (NumPad) | Hardcoded numpad (not wizard), large green amount display | 🔨 Building |
| Account Selector | Dropdown to pick source account (cash/card/bank) | 🔨 Building |
| Category Selector | Dropdown to pick/change category | 🔨 Building |
| Date Picker | Select expense date (defaults to today) | 🔨 Building |
| Note Input | Optional text input with suggested notes from API | 🔨 Building |
| Submit Expense | Creates transaction and redirects to dashboard | 🔨 Building |
| Responsive Layout | Mobile: numpad layout / Desktop: form layout | 🔨 Building |

---

## Transactions (Expenses List)

| Feature | Description | Status |
|---|---|---|
| Transaction List | Grouped by date with day headers | ✅ Exists |
| Daily Totals | Sum per day group | 🔨 Building |
| Category Names | Show category name (not truncated ID) | 🔨 Building |
| Edit Transaction | Click to edit amount/note/category/account | 🔨 Building |
| Delete Transaction | Delete with confirmation dialog | 🔨 Building |
| Month Filtering | Filter transactions by selected month | 🔨 Building |

---

## Categories & Budgets

| Feature | Description | Status |
|---|---|---|
| Category List | View all categories with budget info | ✅ Exists (in grid) |
| Create Category | Name + emoji/icon + monthly budget | 🔨 Building |
| Edit Category | Modify name, icon, budget | 🔨 Building |
| Delete Category | Remove category (with confirmation) | 🔨 Building |
| Category Detail | Budget overview + transaction history per category | 🔨 Building |

---

## Accounts

| Feature | Description | Status |
|---|---|---|
| Account List | View all payment accounts | ✅ Exists |
| Create Account | Name + type (cash/card/bank) + brand/bank | ✅ Exists |
| Edit Account | Modify account details | 🔨 Building |
| Delete Account | Remove account (with confirmation) | 🔨 Building |
| Account Types | Cash, Card (with brand), Bank (with bank name) | 🔨 Building |

---

## Family / Members

| Feature | Description | Status |
|---|---|---|
| Member List | Household members with avatar, name, status | 🔨 Building |
| Invite Member | Send invite via email | 🔨 Building |
| Copy Invite Code | Share invite link for pending members | 🔨 Building |
| Remove Member | Remove from household (with confirmation) | 🔨 Building |

---

## Settings

| Feature | Description | Status |
|---|---|---|
| User Profile | Avatar, name, email display | 🔨 Building |
| Language Selector | Spanish / English / System default | 🔨 Building |
| Server Info | API URL + server version | 🔨 Building |
| Logout | Sign out and clear session | 🔨 Building |

---

## Shared Package (`@repo/shared`)

| Feature | Description | Status |
|---|---|---|
| Entity Types | Household, User, Account, Category, Transaction, Invitation, Recommendation, MemberInfo | ✅ Done |
| API Client | Full CRUD for categories, accounts, transactions | ✅ Done |
| Recommendations API | Get + apply budget recommendations | ✅ Done |
| Members API | List, remove members; create invitations | ✅ Done |
| Suggested Notes API | Get note suggestions per category | ✅ Done |
| Server Version API | Get backend version | ✅ Done |
| formatMoney Utility | Locale-aware currency formatter | ✅ Done |
| Unit Tests | 27 tests covering all API methods | ✅ Done |

---

## Navigation

| Feature | Description | Status |
|---|---|---|
| Sidebar (Desktop) | Home, Transactions, Accounts + Familia, Settings | 🔨 Building |
| Bottom Nav (Mobile) | Inicio, Reportes, Familia, Ajustes | ✅ Exists |

---

## Legend

- ✅ **Exists** — Already implemented in the new client
- 🔨 **Building** — In progress or planned for this migration
