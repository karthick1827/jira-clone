import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProfileDropdown } from '../ProfileDropdown';

describe('ProfileDropdown Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders avatar trigger button with user initials KN', () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('KN');
  });

  it('toggles dropdown popover on click', () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });

    // Initially closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Open
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Karthick Natarajan')).toBeInTheDocument();
    expect(screen.getByText('karthick.natarajan@jira-clone.local')).toBeInTheDocument();

    // Close
    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('toggles theme, updates document attribute, and persists in localStorage', () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });
    fireEvent.click(trigger);

    const themeBtn = screen.getByRole('menuitem', { name: /Theme/i });
    expect(themeBtn).toBeInTheDocument();

    // Click theme button to toggle
    fireEvent.click(themeBtn);

    const currentTheme = document.documentElement.getAttribute('data-theme');
    expect(currentTheme).toBe('light');
    expect(localStorage.getItem('jira-theme-preference')).toBe('light');

    // Click theme button again to toggle back
    fireEvent.click(themeBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('jira-theme-preference')).toBe('dark');
  });

  it('opens Help Centre modal when Help Centre is clicked', () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });
    fireEvent.click(trigger);

    const helpItem = screen.getByRole('menuitem', { name: /Help Centre/i });
    fireEvent.click(helpItem);

    // Dropdown popover closes, Help modal opens
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByText(/Help Centre & Board Guidance/i)).toBeInTheDocument();
  });

  it('opens Profile Settings modal when Profile Settings is clicked', () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });
    fireEvent.click(trigger);

    const settingsItem = screen.getByRole('menuitem', { name: /Profile Settings/i });
    fireEvent.click(settingsItem);

    // Settings modal is visible
    expect(screen.getByText(/Profile & User Settings/i)).toBeInTheDocument();
  });

  it('displays confirmation modal on Sign Out and cleans storage on confirm', () => {
    // Mock window.location.reload
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: vi.fn() },
    });

    localStorage.setItem('jira-kanban-storage', 'test-state');
    localStorage.setItem('jira-session-token', 'test-token');

    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });
    fireEvent.click(trigger);

    const signoutItem = screen.getByRole('menuitem', { name: /Sign Out/i });
    fireEvent.click(signoutItem);

    // Sign out confirmation modal is visible
    expect(screen.getByText(/Confirm Sign Out/i)).toBeInTheDocument();

    const confirmBtn = screen.getByText(/Yes, Sign Out/i);
    fireEvent.click(confirmBtn);

    expect(localStorage.getItem('jira-kanban-storage')).toBeNull();
    expect(localStorage.getItem('jira-session-token')).toBeNull();
    expect(window.location.reload).toHaveBeenCalledTimes(1);

    // Restore original location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('dismisses dropdown when Escape key is pressed', () => {
    render(<ProfileDropdown />);
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('dismisses dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside Area</div>
        <ProfileDropdown />
      </div>
    );
    const trigger = screen.getByRole('button', { name: /User Profile & Navigation Menu/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
