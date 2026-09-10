import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsModal } from '../SettingsModal';

describe('SettingsModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <SettingsModal
        isOpen={false}
        onClose={vi.fn()}
        currentTheme="dark"
        onThemeChange={vi.fn()}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders user details when open', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        currentTheme="dark"
        onThemeChange={vi.fn()}
      />
    );
    expect(screen.getByText('Karthick Natarajan')).toBeInTheDocument();
    expect(screen.getByText(/Lead Engineer/i)).toBeInTheDocument();
    expect(screen.getByText('karthick.natarajan@jira-clone.local')).toBeInTheDocument();
  });

  it('triggers onThemeChange when choosing a different theme radio', () => {
    const handleThemeChange = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        currentTheme="dark"
        onThemeChange={handleThemeChange}
      />
    );
    const lightRadio = screen.getByRole('radio', { name: /Light Theme/i });
    fireEvent.click(lightRadio);
    expect(handleThemeChange).toHaveBeenCalledWith('light');
  });

  it('saves preferences to localStorage on save click', () => {
    const handleClose = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={handleClose}
        currentTheme="dark"
        onThemeChange={vi.fn()}
      />
    );
    const saveBtn = screen.getByText(/Save Preferences/i);
    fireEvent.click(saveBtn);

    const stored = localStorage.getItem('jira-settings-preferences');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.notificationsEnabled).toBe(true);
    expect(parsed.compactCards).toBe(false);
  });

  it('calls onClose when Escape is pressed', () => {
    const handleClose = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        onClose={handleClose}
        currentTheme="dark"
        onThemeChange={vi.fn()}
      />
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
