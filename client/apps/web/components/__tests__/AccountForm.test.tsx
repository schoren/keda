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

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock ScrollIntoView and PointerCapture for Radix UI
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
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    // There are multiple 'Tarjeta' texts (hidden option and visible trigger/item)
    const cardOptions = await screen.findAllByText(/TARJETA/i);
    await user.click(cardOptions[cardOptions.length - 1]!);

    // Should show Brand and Bank labels (Spanish)
    expect(screen.getAllByText(/MARCA/i).length).toBeGreaterThan(0);
    // Use getAllByText for BANCO too since it's also an option value text
    expect(screen.getAllByText(/BANCO/i).length).toBeGreaterThan(0);
  });

  it('calls mutate when creation is successful', async () => {
    const mutate = vi.fn();
    
    (ReactQueryModule.useMutation as any).mockReturnValue({
      mutate,
      isPending: false,
    });

    const user = userEvent.setup();
    const { container } = render(<AccountForm onSuccess={vi.fn()} onCancel={onCancel} />);

    // Trigger form submission directly
    const form = container.querySelector('form');
    if (form) {
      import('@testing-library/react').then(({ fireEvent }) => {
        fireEvent.submit(form);
      });
    } else {
      // Fallback to button click
      const submitButton = screen.getByRole('button', { name: /CREAR CUENTA/i });
      await user.click(submitButton);
    }
    
    // We might need to wait for the next tick
    await vi.waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({ type: 'cash', name: '' });
    });
  });
});

const onCancel = vi.fn();
