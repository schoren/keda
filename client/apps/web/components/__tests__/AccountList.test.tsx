/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountList } from '../AccountList';
import * as ProvidersModule from '../../app/providers';
import * as ReactQueryModule from '@tanstack/react-query';
import { Account } from '@repo/shared';

// Mock the modules
vi.mock('../../app/providers', () => ({
  useApi: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

// Mock window.confirm
window.confirm = vi.fn(() => true);

describe('AccountList', () => {
  const mockApi = {
    getAccounts: vi.fn(),
    deleteAccount: vi.fn(),
  };

  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  const mockAccounts: Account[] = [
    { id: '1', name: 'Wallet', type: 'cash', display_name: 'Cash Wallet', household_id: 'h1', created_at: '', updated_at: '' },
    { id: '2', name: 'Chase', type: 'bank', display_name: 'Chase Bank', household_id: 'h1', created_at: '', updated_at: '' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (ProvidersModule.useApi as any).mockReturnValue(mockApi);
    (ReactQueryModule.useQueryClient as any).mockReturnValue(mockQueryClient);
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: mockAccounts,
      isLoading: false,
    });
    (ReactQueryModule.useMutation as any).mockReturnValue({
      mutate: vi.fn(),
    });
  });

  it('renders correctly with accounts', () => {
    render(<AccountList />);
    expect(screen.getByText('Cash Wallet')).toBeInTheDocument();
    expect(screen.getByText('Chase Bank')).toBeInTheDocument();
  });

  it('shows empty state when no accounts', () => {
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<AccountList />);
    expect(screen.getByText(/NO TIENES CUENTAS REGISTRADAS/i)).toBeInTheDocument();
  });

  it('calls deleteAccount when delete is clicked and confirmed', async () => {
    const mutate = vi.fn();
    (ReactQueryModule.useMutation as any).mockReturnValue({
      mutate,
    });

    const user = userEvent.setup();
    render(<AccountList />);

    // Second account is 'Chase Bank' (index 1)
    // Account items now have buttons directly in them
    // Each item has 2 buttons: Edit and Delete
    // Total buttons = 2 accounts * 2 buttons = 4 buttons
    const deleteButtons = screen.getAllByRole('button');
    // Button index 0: Edit(Acc1), 1: Delete(Acc1), 2: Edit(Acc2), 3: Delete(Acc2)
    // But Cash account (Acc1) has disabled buttons.
    
    await user.click(deleteButtons[3]!); // Delete button for Acc2

    expect(window.confirm).toHaveBeenCalled();
    expect(mutate).toHaveBeenCalledWith('2');
  });
});
