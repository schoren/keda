# Design System: Keda (Derived from getkeda)

## 1. Visual Theme & Atmosphere
**Atmosphere:** Data-driven minimalism with a focus on "Zero Friction."
The design philosophy centers on the slogan "What matters is what's left." The visual concept treats the budget as "energy" that depletes, emphasizing the remaining balance over spent amounts. The interface is clean, modern, and designed to reduce financial stress through plenty of whitespace and clear scannable hierarchy.

## 2. Color Palette & Roles
*   **Primary (Success) (#22C55E):** Used for healthy budget indicators and positive numbers.
*   **Secondary (Warning) (#FACC15):** Used for low budget warnings (typically when < 30% remains).
*   **Danger (Over) (#EF4444):** Used for over-budget indicators and negative numbers.
*   **Background (App) (#F8FAFC):** Main application background (Slate 50).
*   **Surface (Cards) (#FFFFFF):** Used for card backgrounds and modal surfaces.
*   **Text (Main) (#0F172A):** Primary text color for high readability (Slate 900).
*   **Text (Muted) (#64748B):** Secondary text for labels and less critical information (Slate 500).

## 3. Typography Rules
*   **Interface (Sans-Serif):** 'Inter' or 'Roboto' for UI elements and readability.
*   **Amounts & Numbers (Monospace):** 'JetBrains Mono' or 'Roboto Mono' to ensure numeric alignment and focus.
*   **Weights:**
    *   **Regular (400):** Body text.
    *   **Medium (500):** Subheaders and interface labels.
    *   **Semi-bold (600) / Bold (700):** Headlines and key emphasis points (like "Remaining" amounts).

## 4. Component Stylings
*   **Category Card:**
    *   **Shape:** Generously rounded corners (24px).
    *   **Elevation:** Soft diffused shadow (`0 4px 6px -1px rgba(0, 0, 0, 0.05)`).
    *   **Feedback:** 4px high progress bar at the bottom with dynamic color coding based on budget health.
*   **Expense Input:**
    *   **Interactive:** Immediate numeric keypad focus.
    *   **Real-time Preview:** Real-time calculation showing projected "Remaining" balance as the user types.
*   **Buttons:**
    *   Follow Shadcn UI standards while adhering to the primary/secondary/danger color roles.
*   **Iconography:**
    *   **Style:** Lucide Icons / Heroicons (Outline style).
    *   **Weight:** 2px stroke weight for clarity.

## 5. Layout Principles
*   **Priority:** The "Remaining" amount is always the largest visual element on any page or card.
*   **Navigation:** Direct action paths (e.g., tapping a category triggers entry immediately).
*   **Language:** Use non-accounting, user-friendly terms like "Left" or "Remaining" instead of "Available Balance."
