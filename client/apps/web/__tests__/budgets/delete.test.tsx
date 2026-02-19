import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
];

describe("BudgetsPage - Delete Functionality", () => {
  let apiMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    apiMock = {
      getCategories: vi.fn().mockResolvedValue(mockCategories),
      deleteCategory: vi.fn().mockResolvedValue({}),
    };
    (useApi as any).mockReturnValue(apiMock);
    (useAuth as any).mockReturnValue({
      user: { id: "u1", name: "Test User" },
      householdId: "h1",
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("opens delete confirmation modal and calls delete API", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetsPage />
      </QueryClientProvider>
    );

    // Wait for categories to load
    await waitFor(() => expect(screen.getByText("Food")).toBeInTheDocument());

    // Click delete button in the list
    const deleteBtn = screen.getByLabelText(/eliminar/i);
    fireEvent.click(deleteBtn);

    // Check if modal title appears (localized from es.json)
    await waitFor(() => {
      expect(screen.getByText(/eliminar presupuesto/i)).toBeInTheDocument();
    });

    // Click confirm delete in the modal (the only one with variant destructive style probably, but let's just use getAll and pick the modal one)
    const modalDeleteBtn = screen.getAllByRole("button", { name: /eliminar/i }).find(b => !b.hasAttribute('aria-label'));
    fireEvent.click(modalDeleteBtn!);

    await waitFor(() => {
      expect(apiMock.deleteCategory).toHaveBeenCalledWith("1");
    });
  });
});
