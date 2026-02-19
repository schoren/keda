import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { BudgetForm } from "../BudgetForm";
import { useApi } from "@/app/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the providers
vi.mock("@/app/providers", () => ({
  useApi: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe("BudgetForm", () => {
  let apiMock: Record<string, Mock>;
  const onSuccess = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    apiMock = {
      createCategory: vi.fn().mockResolvedValue({ id: "new-cat" }),
      updateCategory: vi.fn().mockResolvedValue({ id: "updated-cat" }),
    };
    (useApi as unknown as Mock).mockReturnValue(apiMock);
  });

  it("submits the form with new category data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetForm onSuccess={onSuccess} onCancel={onCancel} />
      </QueryClientProvider>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText(/nombre de la categoría/i), { target: { value: "Groceries" } });
    fireEvent.change(screen.getByLabelText(/presupuesto mensual/i), { target: { value: "500" } });
    
    // Check if it's sending the numeric value
    fireEvent.submit(screen.getByRole("form", { name: /budget-form/i }));

    await waitFor(() => {
      expect(apiMock.createCategory).toHaveBeenCalledWith(expect.objectContaining({
        name: "Groceries",
        monthly_budget: 500,
      }));
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("handles thousand separators in the budget input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetForm onSuccess={onSuccess} onCancel={onCancel} />
      </QueryClientProvider>
    );

    const budgetInput = screen.getByLabelText(/presupuesto mensual/i);
    
    // Type a value that would naturally get thousand separators (e.g., 1000 -> 1.000 in 'es' locale)
    // The component formats as you type/change
    fireEvent.change(budgetInput, { target: { value: "1234" } });
    
    // In 'es' locale (default in the component if i18n.language is not set or 'es'), 
    // it should format to "1.234"
    expect(budgetInput).toHaveValue("1.234");

    fireEvent.submit(screen.getByRole("form", { name: /budget-form/i }));

    await waitFor(() => {
      expect(apiMock.createCategory).toHaveBeenCalledWith(expect.objectContaining({
        monthly_budget: 1234,
      }));
    });
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BudgetForm onSuccess={onSuccess} onCancel={onCancel} />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
