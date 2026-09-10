import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HelpModal } from '../HelpModal';

describe('HelpModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(<HelpModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal dialog content when isOpen is true', () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Help Centre & Board Guidance/i)).toBeInTheDocument();
    expect(screen.getByText(/Keyboard Navigation & Shortcuts/i)).toBeInTheDocument();
    expect(screen.getByText(/Sprint Board Columns & Lifecycle/i)).toBeInTheDocument();
  });

  it('calls onClose when clicking close button', () => {
    const handleClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={handleClose} />);
    const closeBtn = screen.getByLabelText(/Close help modal/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop', () => {
    const handleClose = vi.fn();
    const { container } = render(<HelpModal isOpen={true} onClose={handleClose} />);
    const backdrop = container.querySelector('.modal-backdrop');
    expect(backdrop).not.toBeNull();
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the primary action button', () => {
    const handleClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={handleClose} />);
    const gotItBtn = screen.getByText(/Got it, thanks!/i);
    fireEvent.click(gotItBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
