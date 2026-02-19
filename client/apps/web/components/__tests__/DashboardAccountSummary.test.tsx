import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardAccountSummary } from '../DashboardAccountSummary';
import { Account } from '@repo/shared';

describe('DashboardAccountSummary', () => {
  const mockAccounts: Account[] = [
    { id: '1', name: 'Wallet', type: 'cash', display_name: 'Cash Wallet', household_id: 'h1', created_at: '', updated_at: '' },
    { id: '2', name: 'Chase', type: 'bank', display_name: 'Chase Bank', household_id: 'h1', created_at: '', updated_at: '' },
  ];

  it('renders account names', () => {
    render(<DashboardAccountSummary accounts={mockAccounts} />);
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Chase')).toBeInTheDocument();
  });

  it('displays a premium title', () => {
    render(<DashboardAccountSummary accounts={mockAccounts} />);
    expect(screen.getByText(/TUS CUENTAS/i)).toBeInTheDocument();
  });
});
