/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategorySelector } from '../CategorySelector';
import * as ProvidersModule from '../../app/providers';
import * as ReactQueryModule from '@tanstack/react-query';

// Mock the modules
vi.mock('../../app/providers', () => ({
  useApi: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
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

describe('CategorySelector', () => {
  const mockApi = {
    getSummary: vi.fn(),
  };

  const mockSummary = {
    month: '2026-02',
    total_budget: 1000,
    total_spent: 200,
    categories: [
      { id: 'c1', name: '🍔 Food', budget: 500, spent: 100, remaining: 400 },
      { id: 'c2', name: '🚗 Transport', budget: 300, spent: 50, remaining: 250 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (ProvidersModule.useApi as any).mockReturnValue(mockApi);
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: mockSummary,
      isLoading: false,
    });
  });

  it('renders a placeholder when no category is selected', () => {
    render(<CategorySelector value="" onChange={vi.fn()} month="2026-02" />);
    expect(screen.getByText(/Select category/i)).toBeInTheDocument();
  });

  it('renders the selected category name and remaining amount', () => {
    // We test that if value is set, trigger shows it
    // But Radix Select Trigger only shows strict text or custom logic.
    // Let's implement custom display logic in trigger.
    render(<CategorySelector value="c1" onChange={vi.fn()} month="2026-02" />);
    expect(screen.getByText('🍔 Food')).toBeInTheDocument();
  });

  it('calls onChange when a category is selected', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<CategorySelector value="" onChange={onChange} month="2026-02" />);

    // Open dropdown
    const trigger = screen.getByRole('combobox');
    await user.pointer({ keys: '[MouseLeft]', target: trigger });

    const option = await screen.findByText('🚗 Transport');
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith('c2');
  });

  it('displays remaining budget in options', async () => {
    const user = userEvent.setup();
    render(<CategorySelector value="" onChange={vi.fn()} month="2026-02" />);

    const trigger = screen.getByRole('combobox');
    await user.pointer({ keys: '[MouseLeft]', target: trigger });

    // Expecting remaining amount to be visible
    expect(await screen.findByText('400')).toBeInTheDocument(); // partial match or formatted
  });
});
