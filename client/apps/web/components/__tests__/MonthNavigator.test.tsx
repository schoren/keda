import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonthNavigator } from '../MonthNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useApi
vi.mock('@/app/providers', () => ({
  useApi: vi.fn(() => ({
    getRecommendations: vi.fn().mockResolvedValue([]),
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('MonthNavigator', () => {
  const defaultMonth = '2026-02';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('displays the current month and year', () => {
    const onMonthChange = vi.fn();
    renderWithProviders(<MonthNavigator month={defaultMonth} onMonthChange={onMonthChange} />);

    expect(screen.getByText(/febrero 2026/i)).toBeInTheDocument();
  });

  it('navigates to the previous month when left arrow is clicked', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    renderWithProviders(<MonthNavigator month={defaultMonth} onMonthChange={onMonthChange} />);

    await user.click(screen.getByRole('button', { name: /mes anterior/i }));

    expect(onMonthChange).toHaveBeenCalledWith('2026-01');
  });

  it('navigates to the next month when right arrow is clicked', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    // Use a past month so the next button is enabled
    renderWithProviders(<MonthNavigator month="2025-01" onMonthChange={onMonthChange} />);

    await user.click(screen.getByRole('button', { name: /mes siguiente/i }));

    expect(onMonthChange).toHaveBeenCalledWith('2025-02');
  });

  it('disables the next button when viewing the current month', () => {
    const onMonthChange = vi.fn();
    const currentMonth = new Date().toISOString().slice(0, 7);
    renderWithProviders(<MonthNavigator month={currentMonth} onMonthChange={onMonthChange} />);

    const nextButton = screen.getByRole('button', { name: /mes siguiente/i });
    expect(nextButton).toBeDisabled();
  });

  it('handles year boundary when navigating backward from January', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    renderWithProviders(<MonthNavigator month="2026-01" onMonthChange={onMonthChange} />);

    await user.click(screen.getByRole('button', { name: /mes anterior/i }));

    expect(onMonthChange).toHaveBeenCalledWith('2025-12');
  });

  it('handles year boundary when navigating forward from December', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    renderWithProviders(<MonthNavigator month="2025-12" onMonthChange={onMonthChange} />);

    await user.click(screen.getByRole('button', { name: /mes siguiente/i }));

    expect(onMonthChange).toHaveBeenCalledWith('2026-01');
  });
});
