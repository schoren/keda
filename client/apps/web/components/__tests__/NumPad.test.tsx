import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumPad } from '../NumPad';

describe('NumPad', () => {
  it('renders numeric keys 0-9 and dot', () => {
    render(<NumPad value="" onChange={vi.fn()} />);
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(num => {
      expect(screen.getByText(num.toString())).toBeInTheDocument();
    });
    expect(screen.getByText('.')).toBeInTheDocument();
  });

  it('calls onChange with concatenated value when number is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NumPad value="1" onChange={onChange} />);

    await user.click(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('prevents multiple dots', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NumPad value="1.5" onChange={onChange} />);

    await user.click(screen.getByText('.'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange with truncated value when backspace is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NumPad value="123" onChange={onChange} />);

    await user.click(screen.getByLabelText(/backspace/i));
    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('handles empty value on backspace', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NumPad value="5" onChange={onChange} />);

    await user.click(screen.getByLabelText(/backspace/i));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
