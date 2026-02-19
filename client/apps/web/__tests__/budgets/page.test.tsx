import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import BudgetsPage from "@/app/budget-management/page";
import { useApi } from "@/app/providers";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the providers and hooks
vi.mock("@/app/providers", () => ({
  useApi: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockCategories = [
  { id: "1", name: "Food", monthly_budget: 500, icon: "Utensils", is_active: true, household_id: "h1", created_at: "", updated_at: "" },
  { id: "2", name: "Rent", monthly_budget: 1000, icon: "Home", is_active: true, household_id: "h1", created_at: "", updated_at: "" },
];

describe("BudgetsPage", () => {
  let apiMock: Record<string, Mock>;

  beforeEach(() => {
    vi.clearAllMocks();
    apiMock = {
      getCategories: vi.fn().mockResolvedValue(mockCategories),
    };
    (useApi as unknown as Mock).mockReturnValue(apiMock);
    (useAuth as unknown as Mock).mockReturnValue({
      user: { id: "u1", name: "Test User" },
      householdId: "h1",
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("renders the budgets page and shows the list of categories", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetsPage />
      </QueryClientProvider>
    );

    // Should show the title (from nav.budgets)
    expect(screen.getAllByText("Presupuestos").length).toBeGreaterThan(0);

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.getByText("Rent")).toBeInTheDocument();
    });

    // Check if budgets are displayed
    expect(screen.getByText("$500")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
  });

  it("opens the create budget modal when clicking add button", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetsPage />
      </QueryClientProvider>
    );

    const addButtons = screen.getAllByRole("button", { name: /agregar/i });
    if (addButtons[0]) {
      fireEvent.click(addButtons[0]);
    }

    await waitFor(() => {
      expect(screen.getAllByText("Crear Presupuesto").length).toBeGreaterThan(0);
    });
  });
});
