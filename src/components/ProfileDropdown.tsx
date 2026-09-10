import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Moon,
  Sun,
  Settings,
  LogOut,
  AlertTriangle,
  X,
} from 'lucide-react';
import { HelpModal } from './HelpModal';
import { SettingsModal } from './SettingsModal';

const USER_INFO = {
  name: 'Karthick Natarajan',
  initials: 'KN',
  role: 'Lead Engineer',
  email: 'karthick.natarajan@jira-clone.local',
};

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize theme from localStorage or document attribute
  useEffect(() => {
    const savedTheme = localStorage.getItem('jira-theme-preference') as 'light' | 'dark' | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const initialTheme = prefersLight ? 'light' : 'dark';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Update theme helper
  const handleThemeToggle = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('jira-theme-preference', nextTheme);
  }, [theme]);

  const handleThemeChange = useCallback((newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('jira-theme-preference', newTheme);
  }, []);

  // Click-outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Keyboard navigation within dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        return;
      }

      const totalItems = 4; // Help, Theme, Settings, Sign Out

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev < totalItems - 1 ? prev + 1 : 0;
          menuItemsRef.current[next]?.focus();
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : totalItems - 1;
          menuItemsRef.current[next]?.focus();
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setFocusedIndex(-1);
      } else {
        setFocusedIndex(0);
        setTimeout(() => menuItemsRef.current[0]?.focus(), 0);
      }
      return next;
    });
  };

  const handleSignOutConfirm = () => {
    localStorage.removeItem('jira-session-token');
    localStorage.removeItem('jira-kanban-storage');
    window.location.reload();
  };

  return (
    <div className="profile-dropdown-container" ref={containerRef}>
      {/* Avatar Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className="avatar-trigger"
        onClick={toggleDropdown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User Profile & Navigation Menu"
        id="user-profile-menu-trigger"
      >
        <span className="avatar-initials-badge">{USER_INFO.initials}</span>
        <ChevronDown size={14} className={`avatar-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {/* Floating Popover Surface */}
      {isOpen && (
        <div
          className="profile-menu-popover"
          role="menu"
          aria-labelledby="user-profile-menu-trigger"
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Profile Identity Card */}
          <div className="profile-user-card">
            <div className="profile-user-avatar-large">
              {USER_INFO.initials}
            </div>
            <div className="profile-user-info">
              <span className="profile-user-name">{USER_INFO.name}</span>
              <span className="profile-user-role">{USER_INFO.role}</span>
              <span className="profile-user-email">{USER_INFO.email}</span>
            </div>
          </div>

          <div className="profile-menu-divider" />

          {/* Action Menu List */}
          <div className="profile-menu-list">
            {/* Help Centre */}
            <button
              ref={(el) => { menuItemsRef.current[0] = el; }}
              type="button"
              role="menuitem"
              tabIndex={focusedIndex === 0 ? 0 : -1}
              className="profile-menu-item-btn"
              onClick={() => {
                setIsOpen(false);
                setIsHelpOpen(true);
              }}
            >
              <div className="profile-menu-item-left">
                <HelpCircle size={16} className="menu-item-icon" />
                <span>Help Centre</span>
              </div>
              <span className="menu-item-shortcut">Guides</span>
            </button>

            {/* Theme Switcher */}
            <button
              ref={(el) => { menuItemsRef.current[1] = el; }}
              type="button"
              role="menuitem"
              tabIndex={focusedIndex === 1 ? 0 : -1}
              className="profile-menu-item-btn"
              onClick={handleThemeToggle}
            >
              <div className="profile-menu-item-left">
                {theme === 'dark' ? (
                  <Sun size={16} className="menu-item-icon text-amber" />
                ) : (
                  <Moon size={16} className="menu-item-icon text-blue" />
                )}
                <span>Theme</span>
              </div>
              <span className="theme-pill">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>

            {/* Profile Settings */}
            <button
              ref={(el) => { menuItemsRef.current[2] = el; }}
              type="button"
              role="menuitem"
              tabIndex={focusedIndex === 2 ? 0 : -1}
              className="profile-menu-item-btn"
              onClick={() => {
                setIsOpen(false);
                setIsSettingsOpen(true);
              }}
            >
              <div className="profile-menu-item-left">
                <Settings size={16} className="menu-item-icon" />
                <span>Profile Settings</span>
              </div>
            </button>

            <div className="profile-menu-divider" />

            {/* Sign Out */}
            <button
              ref={(el) => { menuItemsRef.current[3] = el; }}
              type="button"
              role="menuitem"
              tabIndex={focusedIndex === 3 ? 0 : -1}
              className="profile-menu-item-btn destructive"
              onClick={() => {
                setIsOpen(false);
                setShowSignOutConfirm(true);
              }}
            >
              <div className="profile-menu-item-left">
                <LogOut size={16} className="menu-item-icon" />
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Decoupled Help Centre Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Decoupled Profile Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowSignOutConfirm(false)}>
          <div
            className="modal-container signout-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-modal-title"
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-title-with-icon">
                  <AlertTriangle size={20} className="modal-heading-icon text-danger" />
                  <h2 id="signout-modal-title" className="modal-heading">
                    Confirm Sign Out
                  </h2>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowSignOutConfirm(false)}
                aria-label="Close sign out confirmation"
              >
                <X size={18} />
              </button>
            </div>

            <div className="signout-modal-body">
              <p className="signout-warning-text">
                Signing out will flush your active local session tokens and reset board demo state to the initial dataset.
              </p>
              <p className="signout-confirmation-prompt">
                Are you sure you wish to sign out of <strong>{USER_INFO.name}</strong>?
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn-danger-confirm"
                onClick={handleSignOutConfirm}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
