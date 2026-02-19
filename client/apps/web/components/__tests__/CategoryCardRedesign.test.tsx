import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryCard } from "../CategoryCard";

describe("CategoryCard Redesign", () => {
  const mockCategory = {
    id: "1",
    name: "Comida",
    budget: 1000,
    spent: 400, // 60% remaining
    icon: "Utensils",
  };

  it("renders remaining amount as the primary numeric element", () => {
    render(<CategoryCard category={mockCategory} />);
    // In redesign, we want the remaining amount to be prominent.
    // We'll check for the $600 text.
    const remainingAmount = screen.getByText("$600");
    expect(remainingAmount).toBeDefined();
    // It should have the font-mono class for clarity
    expect(remainingAmount.className).toContain("font-mono");
  });

  it("shows Success color (emerald) when > 30% remains", () => {
    const { container } = render(<CategoryCard category={mockCategory} />);
    // 60% remaining -> success
    const progressBar = container.querySelector(".bg-emerald-500");
    expect(progressBar).not.toBeNull();
  });

  it("shows Warning color (amber) when 10-30% remains", () => {
    const warningCategory = {
      ...mockCategory,
      spent: 800, // 20% remaining
    };
    const { container } = render(<CategoryCard category={warningCategory} />);
    const progressBar = container.querySelector(".bg-amber-500");
    expect(progressBar).not.toBeNull();
  });

  it("shows Danger color (red) when < 10% remains", () => {
    const dangerCategory = {
      ...mockCategory,
      spent: 950, // 5% remaining
    };
    const { container } = render(<CategoryCard category={dangerCategory} />);
    const progressBar = container.querySelector(".bg-red-500");
    expect(progressBar).not.toBeNull();
  });

  it("shows Danger color (red) when over budget", () => {
    const overBudgetCategory = {
      ...mockCategory,
      spent: 1100, // -10% remaining
    };
    const { container } = render(<CategoryCard category={overBudgetCategory} />);
    const progressBar = container.querySelector(".bg-red-500");
    expect(progressBar).not.toBeNull();
  });
});
