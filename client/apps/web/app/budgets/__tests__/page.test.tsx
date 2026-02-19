import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BudgetsPage from "../page";
import { useApi } from "../../providers";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the providers and hooks
vi.mock("../../providers", () => ({
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
  let apiMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    apiMock = {
      getCategories: vi.fn().mockResolvedValue(mockCategories),
    };
    (useApi as any).mockReturnValue(apiMock);
    (useAuth as any).mockReturnValue({
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
});
