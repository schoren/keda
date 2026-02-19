/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from '../ExpenseForm';
import * as ProvidersModule from '../../app/providers';
import * as ReactQueryModule from '@tanstack/react-query';
import { format } from 'date-fns';

// Mock modules
vi.mock('../../app/providers', () => ({
  useApi: vi.fn(),
  formatMoney: (amount: number) => `$${amount}`,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
}));

// Mock ResizeObserver/Pointer for Radix UI (Account/Category lists)
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.metaKey = props.metaKey || false;
    this.shiftKey = props.shiftKey || false;
  }
}
window.PointerEvent = MockPointerEvent as any;


describe('ExpenseForm', () => {
  const mockApi = {
    createTransaction: vi.fn(),
    getAccounts: vi.fn(),
    getSummary: vi.fn(),
    getSuggestedNotes: vi.fn(),
  };

  const mockAccounts = [{ id: 'a1', name: 'Cash', type: 'cash' }];
  const mockSummary = {
    categories: [{ id: 'c1', name: 'Food', remaining: 100 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (ProvidersModule.useApi as any).mockReturnValue(mockApi);

    // Mock useQuery implementation based on queryKey
    (ReactQueryModule.useQuery as any).mockImplementation(({ queryKey }: { queryKey: any[] }) => {
      if (queryKey[0] === 'accounts') return { data: mockAccounts, isLoading: false };
      if (queryKey[0] === 'summary') return { data: mockSummary, isLoading: false };
      if (queryKey[0] === 'suggestedNotes') return { data: [], isLoading: false };
      return { data: undefined, isLoading: false };
    });

    // Mock useMutation
    (ReactQueryModule.useMutation as any).mockImplementation(({ mutationFn, onSuccess }: { mutationFn: any, onSuccess?: () => void }) => ({
      mutate: (variables: any) => {
        mutationFn(variables);
        onSuccess?.();
      },
      isPending: false,
    }));
  });

  it('renders numeric keys', () => { // Basic render test to ensure NumPad is present
    render(<ExpenseForm onSuccess={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('submits transaction with correct data', async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<ExpenseForm onSuccess={onSuccess} />);

    // Select Amount: 50
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));

    // Select Account
    const accountTrigger = screen.getByText('Select account').closest('button');
    if (!accountTrigger) throw new Error('Account trigger not found');
    await user.click(accountTrigger);
    await user.click(await screen.findByText('Cash'));

    // Select Category
    const categoryTrigger = screen.getByText('Select category').closest('button');
    if (!categoryTrigger) throw new Error('Category trigger not found');
    await user.click(categoryTrigger);
    await user.click(await screen.findByText('Food'));

    // Enter Note
    await user.type(screen.getByRole('textbox'), 'Lunch');

    // Submit
    await user.click(screen.getByText(/Guardar Gasto/i));

    expect(mockApi.createTransaction).toHaveBeenCalledWith(expect.objectContaining({
      amount: 50,
      account_id: 'a1',
      category_id: 'c1',
      note: 'Lunch',
      // date: expect.any(String) // or Date object depending on API
    }));
    expect(onSuccess).toHaveBeenCalled();
  });

  it('disables submit if amount is 0 or category/account missing', () => {
    render(<ExpenseForm onSuccess={vi.fn()} />);
    const submitBtn = screen.getByText(/Guardar Gasto/i).closest('button');
    expect(submitBtn).toBeDisabled();
  });
});
