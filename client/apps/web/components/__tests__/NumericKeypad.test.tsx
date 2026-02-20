import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { NumericKeypad } from '../NumericKeypad';

describe('NumericKeypad', () => {
  it('renders standard input on desktop', async () => {
    // matchMedia.matches is false by default in our mock
    render(<NumericKeypad value="10" onChange={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    });
  });

  it('renders NumPad on mobile', async () => {
    vi.stubGlobal('innerWidth', 375);
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<NumericKeypad value="10" onChange={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('00')).toBeInTheDocument();
    });
  });
});
