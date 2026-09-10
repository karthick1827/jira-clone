import React, { useEffect, useState } from 'react';
import { X, Settings, User, Bell, Layout, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [compactCards, setCompactCards] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jira-settings-preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.notificationsEnabled === 'boolean') setNotificationsEnabled(parsed.notificationsEnabled);
        if (typeof parsed.compactCards === 'boolean') setCompactCards(parsed.compactCards);
      }
    } catch {
      // ignore storage error
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem(
        'jira-settings-preferences',
        JSON.stringify({
          notificationsEnabled,
          compactCards,
        })
      );
    } catch {
      // ignore storage error
    }
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container settings-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-heading"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-title-with-icon">
              <Settings size={20} className="modal-heading-icon" />
              <h2 id="settings-modal-heading" className="modal-heading">
                Profile & User Settings
              </h2>
            </div>
            <span className="modal-created-date">Configure workspace display and user account preferences</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close settings modal">
            <X size={18} />
          </button>
        </div>

        <div className="settings-modal-body">
          {/* User Account Overview */}
          <section className="settings-section">
            <div className="settings-section-header">
              <User size={16} className="settings-section-icon" />
              <h3 className="settings-section-title">Account Information</h3>
            </div>
            <div className="settings-account-card">
              <div className="settings-avatar-badge">KN</div>
              <div className="settings-account-details">
                <span className="settings-user-name">Karthick Natarajan</span>
                <span className="settings-user-role">Lead Engineer &bull; Frontend Core</span>
                <span className="settings-user-email">karthick.natarajan@jira-clone.local</span>
              </div>
            </div>
          </section>

          {/* Theme & Appearance */}
          <section className="settings-section">
            <div className="settings-section-header">
              <Layout size={16} className="settings-section-icon" />
              <h3 className="settings-section-title">Appearance & Theme</h3>
            </div>
            <div className="settings-radio-group">
              <label className={`theme-choice-card ${currentTheme === 'dark' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={currentTheme === 'dark'}
                  onChange={() => onThemeChange('dark')}
                />
                <div className="theme-choice-info">
                  <span className="theme-choice-title">Dark Theme</span>
                  <span className="theme-choice-subtitle">High contrast dark palette for reduced eye strain</span>
                </div>
              </label>
              <label className={`theme-choice-card ${currentTheme === 'light' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={currentTheme === 'light'}
                  onChange={() => onThemeChange('light')}
                />
                <div className="theme-choice-info">
                  <span className="theme-choice-title">Light Theme</span>
                  <span className="theme-choice-subtitle">Clean daylight aesthetic matching Jira Cloud defaults</span>
                </div>
              </label>
            </div>
          </section>

          {/* Preferences */}
          <section className="settings-section">
            <div className="settings-section-header">
              <Bell size={16} className="settings-section-icon" />
              <h3 className="settings-section-title">Workspace Preferences</h3>
            </div>
            <div className="settings-toggle-list">
              <label className="settings-toggle-item">
                <div className="toggle-text">
                  <span className="toggle-label">Desktop Notifications</span>
                  <span className="toggle-desc">Show alert banner when cards are moved to In Review</span>
                </div>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              </label>

              <label className="settings-toggle-item">
                <div className="toggle-text">
                  <span className="toggle-label">Compact Card Density</span>
                  <span className="toggle-desc">Reduce card margins and padding on larger displays</span>
                </div>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={compactCards}
                  onChange={(e) => setCompactCards(e.target.checked)}
                />
              </label>
            </div>
          </section>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {savedFeedback ? (
              <>
                <Check size={16} />
                <span>Saved!</span>
              </>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
