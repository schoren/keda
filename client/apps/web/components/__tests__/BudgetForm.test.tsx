import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
  let apiMock: any;
  const onSuccess = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    apiMock = {
      createCategory: vi.fn().mockResolvedValue({ id: "new-cat" }),
      updateCategory: vi.fn().mockResolvedValue({ id: "updated-cat" }),
    };
    (useApi as any).mockReturnValue(apiMock);
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
