import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteInput } from '../NoteInput';
import * as ProvidersModule from '../../app/providers';
import * as ReactQueryModule from '@tanstack/react-query';

// Mock modules
vi.mock('../../app/providers', () => ({
  useApi: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('NoteInput', () => {
  const mockApi = {
    getSuggestedNotes: vi.fn(),
  };

  const mockSuggestions = ['Lunch', 'Dinner', 'Coffee'];

  beforeEach(() => {
    vi.clearAllMocks();
    (ProvidersModule.useApi as any).mockReturnValue(mockApi);
    (ReactQueryModule.useQuery as any).mockReturnValue({
      data: mockSuggestions,
      isLoading: false,
    });
  });

  it('renders text input with current value', () => {
    render(<NoteInput value="My Note" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('My Note')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NoteInput value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'New Note');

    expect(onChange).toHaveBeenCalled();
    // note: user.type calls onChange multiple times, check last call or just called
  });

  it('renders suggestions when categoryId is provided', () => {
    render(<NoteInput value="" onChange={vi.fn()} categoryId="c1" />);
    mockSuggestions.forEach(note => {
      expect(screen.getByText(note)).toBeInTheDocument();
    });
  });

  it('calls onChange when suggestion is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NoteInput value="" onChange={onChange} categoryId="c1" />);

    await user.click(screen.getByText('Lunch'));
    expect(onChange).toHaveBeenCalledWith('Lunch');
  });

  it('does not fetch suggestions if categoryId is missing', () => {
    render(<NoteInput value="" onChange={vi.fn()} />);
    // The mock currently returns content regardless of query key, 
    // but implementing `enabled` check in component is good.
    // Testing implementation details of useQuery calls is possible via spy.
    expect(ReactQueryModule.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });
});
