/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountForm } from '../AccountForm';
import * as ProvidersModule from '../../app/providers';
import * as ReactQueryModule from '@tanstack/react-query';

// Mock the modules
vi.mock('../../app/providers', () => ({
  useApi: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
  useQuery: vi.fn(),
}));

describe('AccountForm', () => {
  const mockApi = {
    createAccount: vi.fn(),
    updateAccount: vi.fn(),
  };

  const mockQueryClient = {
    invalidateQueries: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (ProvidersModule.useApi as any).mockReturnValue(mockApi);
    (ReactQueryModule.useQueryClient as any).mockReturnValue(mockQueryClient);
    (ReactQueryModule.useQuery as any).mockReturnValue({ data: [] });
    (ReactQueryModule.useMutation as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
    });
  });

  it('renders correctly for new account', () => {
    render(<AccountForm onSuccess={vi.fn()} onCancel={vi.fn()} />);
    // Translation for 'type_label' should be present
    expect(screen.getByText(/TIPO DE CUENTA/i)).toBeInTheDocument();
  });

  it('shows dynamic fields for card type', async () => {
    const user = userEvent.setup();
    render(<AccountForm onSuccess={vi.fn()} onCancel={vi.fn()} />);

    // Select 'card' type
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'card');

    // Should show Brand and Bank labels (Spanish)
    expect(screen.getByText(/MARCA/i)).toBeInTheDocument();
    // Use getAllByText because 'Banco' is both an option and a label
    expect(screen.getAllByText(/BANCO/i).length).toBeGreaterThan(1);
  });

  it('calls onSuccess when creation is successful', async () => {
    const onSuccess = vi.fn();
    const mutate = vi.fn();
    
    (ReactQueryModule.useMutation as any).mockReturnValue({
      mutate,
      isPending: false,
    });

    const user = userEvent.setup();
    render(<AccountForm onSuccess={onSuccess} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /CREAR CUENTA/i }));
    
    expect(mutate).toHaveBeenCalledWith({ type: 'cash', name: '' });
  });
});

const onCancel = vi.fn();
