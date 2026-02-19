export enum BudgetStatus {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

/**
 * Calculates the budget status based on budget and spent amounts.
 * Success: > 30% remaining
 * Warning: 10% - 30% remaining
 * Danger: < 10% remaining
 */
export function getBudgetStatus(budget: number, spent: number): BudgetStatus {
  if (budget <= 0) {
    return spent > 0 ? BudgetStatus.Danger : BudgetStatus.Success;
  }

  const remainingPercent = (budget - spent) / budget;

  if (remainingPercent > 0.3) {
    return BudgetStatus.Success;
  }

  if (remainingPercent >= 0.1) {
    return BudgetStatus.Warning;
  }

  return BudgetStatus.Danger;
}
