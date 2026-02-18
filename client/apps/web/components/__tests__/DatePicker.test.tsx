import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from '../DatePicker';
import { format } from 'date-fns';

describe('DatePicker', () => {
  it('renders input with formatted date', () => {
    const today = new Date('2026-02-18T12:00:00');
    render(<DatePicker value={today} onChange={vi.fn()} />);

    const input = screen.getByLabelText(/date/i) as HTMLInputElement; // Assuming aria-label
    // or type="date"
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('2026-02-18');
  });

  it('calls onChange with new Date when input changes', () => {
    const onChange = vi.fn();
    const today = new Date('2026-02-18');
    render(<DatePicker value={today} onChange={onChange} />);

    const input = screen.getByLabelText(/date/i);
    fireEvent.change(input, { target: { value: '2026-02-20' } });

    expect(onChange).toHaveBeenCalled();
    const callArg = onChange.mock.calls[0][0];
    expect(callArg).toBeInstanceOf(Date);
    expect(format(callArg, 'yyyy-MM-dd')).toBe('2026-02-20');
  });
});
