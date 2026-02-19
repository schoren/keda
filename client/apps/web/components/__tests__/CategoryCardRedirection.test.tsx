import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryCard } from "../CategoryCard";

describe("CategoryCard Redirection", () => {
  const mockCategory = {
    id: "cat-123",
    name: "Comida",
    budget: 1000,
    spent: 400,
    icon: "Utensils",
  };

  it("links to the new expense form with the correct categoryId", () => {
    render(<CategoryCard category={mockCategory} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/expenses/new?categoryId=cat-123");
  });
});
