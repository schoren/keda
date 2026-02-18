import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecommendationsBanner } from '../RecommendationsBanner';
import * as ProvidersModule from '../../app/providers';
import * as ReactQueryModule from '@tanstack/react-query';

// Mock the modules
vi.mock('../../app/providers', () => ({
  useApi: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

describe('RecommendationsBanner', () => {
  const mockApi = {
    getRecommendations: vi.fn(),
    applyRecommendations: vi.fn(),
  };

  const mockRecommendations = [
    { categoryName: 'Comida', action: 'Increase budget', categoryId: 'cat1', amount: 50, isSelected: true },
    { categoryName: 'Transporte', action: 'Reduce spending', categoryId: 'cat2', amount: 20, isSelected: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (ProvidersModule.useApi as any).mockReturnValue(mockApi);
    (ReactQueryModule.useMutation as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it('renders nothing when loading', () => {
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { container } = render(<RecommendationsBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when there are no recommendations', () => {
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { container } = render(<RecommendationsBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the banner when recommendations exist', () => {
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: mockRecommendations,
      isLoading: false,
    });

    render(<RecommendationsBanner />);

    expect(screen.getByText('Recomendaciones de Presupuesto')).toBeInTheDocument();
    expect(screen.getByText(/Increase budget/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('calls applyRecommendations when apply button is clicked', async () => {
    const user = userEvent.setup();
    const mockMutate = vi.fn();
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: mockRecommendations,
      isLoading: false,
    });
    (ReactQueryModule.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<RecommendationsBanner />);

    await user.click(screen.getByRole('button', { name: /aplicar todo/i }));

    expect(mockMutate).toHaveBeenCalledWith(mockRecommendations);
  });

  it('hides the banner when dismissed', async () => {
    const user = userEvent.setup();
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: mockRecommendations,
      isLoading: false,
    });

    render(<RecommendationsBanner />);

    expect(screen.getByText('Recomendaciones de Presupuesto')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /descartar/i }));

    // Should disappear (implementation detail: usually via local state)
    await waitFor(() => {
      expect(screen.queryByText('Recomendaciones de Presupuesto')).not.toBeInTheDocument();
    });
  });
});
