import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DynamicAmountDisplay } from '../DynamicAmountDisplay';

describe('DynamicAmountDisplay', () => {
  it('formats amount with thousand separators', () => {
    render(<DynamicAmountDisplay value="1234567.89" />);
    expect(screen.getByText(/1,234,567\.89/)).toBeInTheDocument();
  });

  it('formats whole numbers with thousand separators', () => {
    render(<DynamicAmountDisplay value="1000" />);
    expect(screen.getByText(/1,000/)).toBeInTheDocument();
  });

  it('handles empty value', () => {
    render(<DynamicAmountDisplay value="" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles zero value', () => {
    render(<DynamicAmountDisplay value="0" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
