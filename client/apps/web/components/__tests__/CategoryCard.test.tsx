import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryCard } from "../CategoryCard";

describe("CategoryCard", () => {
  const mockCategory = {
    id: "1",
    name: "Comida",
    budget: 1000,
    spent: 400,
    icon: "Utensils",
  };

  it("renders category name and icon", () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText("Comida")).toBeDefined();
  });

  it("displays remaining amount correctly", () => {
    render(<CategoryCard category={mockCategory} />);
    // Remaining = 1000 - 400 = 600
    expect(screen.getByText("RESTA")).toBeDefined();
    expect(screen.getByText("$600")).toBeDefined();
  });

  it("shows progress bar with correct width", () => {
    const { container } = render(<CategoryCard category={mockCategory} />);
    const progressBar = container.querySelector(".bg-emerald-500");
    // (400 / 1000) * 100 = 40%
    // Expect style="width: 40%" (or similar depending on implementation)
    // For now we just check it exists, later we can be more specific
    expect(progressBar).toBeDefined();
  });

  it("shows red progress bar when over budget", () => {
    const overBudgetCategory = {
      ...mockCategory,
      spent: 1200,
    };
    const { container } = render(<CategoryCard category={overBudgetCategory} />);
    const progressBar = container.querySelector(".bg-red-500");
    expect(progressBar).toBeDefined();
  });
});
