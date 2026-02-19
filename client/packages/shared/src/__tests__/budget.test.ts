import { describe, it, expect } from 'vitest';
import { getBudgetStatus, BudgetStatus } from '../budget';

describe('getBudgetStatus', () => {
  it('returns Success when remaining budget is > 30%', () => {
    // 100 budget, 50 spent = 50% remaining (> 30%)
    expect(getBudgetStatus(100, 50)).toBe(BudgetStatus.Success);
    // 100 budget, 69 spent = 31% remaining (> 30%)
    expect(getBudgetStatus(100, 69)).toBe(BudgetStatus.Success);
  });

  it('returns Warning when remaining budget is between 10% and 30%', () => {
    // 100 budget, 70 spent = 30% remaining
    expect(getBudgetStatus(100, 70)).toBe(BudgetStatus.Warning);
    // 100 budget, 85 spent = 15% remaining
    expect(getBudgetStatus(100, 85)).toBe(BudgetStatus.Warning);
    // 100 budget, 90 spent = 10% remaining
    expect(getBudgetStatus(100, 90)).toBe(BudgetStatus.Warning);
  });

  it('returns Danger when remaining budget is < 10%', () => {
    // 100 budget, 91 spent = 9% remaining (< 10%)
    expect(getBudgetStatus(100, 91)).toBe(BudgetStatus.Danger);
    // 100 budget, 100 spent = 0% remaining (< 10%)
    expect(getBudgetStatus(100, 100)).toBe(BudgetStatus.Danger);
    // 100 budget, 110 spent = -10% remaining (< 10%)
    expect(getBudgetStatus(100, 110)).toBe(BudgetStatus.Danger);
  });

  it('handles zero budget by returning Danger if any spent, or Success if zero spent', () => {
    expect(getBudgetStatus(0, 10)).toBe(BudgetStatus.Danger);
    expect(getBudgetStatus(0, 0)).toBe(BudgetStatus.Success);
  });
});
