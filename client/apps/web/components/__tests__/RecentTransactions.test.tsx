import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentTransactions } from '../RecentTransactions';
import { Transaction } from '@repo/shared';

describe('RecentTransactions', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 120.50,
      date: '2026-02-18T10:00:00Z',
      note: 'Almuerzo',
      category_id: 'c1',
      account_id: 'a1',
      user_id: 'u1',
      type: 'expense',
      household_id: 'h1',
      created_at: '',
      updated_at: ''
    },
    {
      id: '2',
      amount: 50.00,
      date: '2026-02-17T15:30:00Z',
      note: 'Supermercado',
      category_id: 'c2',
      account_id: 'a2',
      user_id: 'u1',
      type: 'expense',
      household_id: 'h1',
      created_at: '',
      updated_at: ''
    }
  ];

  it('renders the list of transactions', () => {
    render(<RecentTransactions transactions={mockTransactions} />);
    expect(screen.getByText('Almuerzo')).toBeInTheDocument();
    expect(screen.getByText('Supermercado')).toBeInTheDocument();
  });

  it('displays the amounts correctly formatted', () => {
    render(<RecentTransactions transactions={mockTransactions} />);
    expect(screen.getByText(/\$120/)).toBeInTheDocument();
    expect(screen.getByText(/\$50/)).toBeInTheDocument();
  });
});
