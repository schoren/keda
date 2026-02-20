import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumPad } from '../NumPad';

describe('NumPad', () => {
  it('renders numeric keys 0-9, dot, 00 and 000', () => {
    render(<NumPad value="" onChange={vi.fn()} />);
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(num => {
      expect(screen.getByText(num.toString())).toBeInTheDocument();
    });
    expect(screen.getByText('.')).toBeInTheDocument();
    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('000')).toBeInTheDocument();
  });

  it('calls onChange with concatenated double zero when clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NumPad value="1" onChange={onChange} />);

    await user.click(screen.getByText('00'));
    expect(onChange).toHaveBeenCalledWith('100');
  });

  it('calls onChange with concatenated triple zero when clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NumPad value="1" onChange={onChange} />);

    await user.click(screen.getByText('000'));
    expect(onChange).toHaveBeenCalledWith('1000');
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
