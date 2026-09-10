import React, { useEffect } from 'react';
import { X, Keyboard, HelpCircle, Columns3, CheckCircle2, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container help-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-heading"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-title-with-icon">
              <HelpCircle size={20} className="modal-heading-icon" />
              <h2 id="help-modal-heading" className="modal-heading">
                Help Centre & Board Guidance
              </h2>
            </div>
            <span className="modal-created-date">Jira Kanban Quick Reference & Workflow Shortcuts</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close help modal">
            <X size={18} />
          </button>
        </div>

        <div className="help-modal-body">
          {/* Section 1: Keyboard Shortcuts */}
          <section className="help-section">
            <div className="help-section-header">
              <Keyboard size={16} className="help-section-icon" />
              <h3 className="help-section-title">Keyboard Navigation & Shortcuts</h3>
            </div>
            <div className="help-shortcuts-grid">
              <div className="shortcut-card">
                <span className="shortcut-label">Close any modal or popover</span>
                <kbd className="shortcut-kbd">Escape</kbd>
              </div>
              <div className="shortcut-card">
                <span className="shortcut-label">Open / toggle Profile Dropdown</span>
                <div className="shortcut-kbd-group">
                  <kbd className="shortcut-kbd">Enter</kbd>
                  <span className="kbd-separator">or</span>
                  <kbd className="shortcut-kbd">Space</kbd>
                </div>
              </div>
              <div className="shortcut-card">
                <span className="shortcut-label">Navigate menu items</span>
                <div className="shortcut-kbd-group">
                  <kbd className="shortcut-kbd">&uarr;</kbd>
                  <kbd className="shortcut-kbd">&darr;</kbd>
                </div>
              </div>
              <div className="shortcut-card">
                <span className="shortcut-label">Open Issue for editing</span>
                <span className="shortcut-detail">Click on card or press <kbd className="shortcut-kbd">Enter</kbd> when focused</span>
              </div>
            </div>
          </section>

          {/* Section 2: Kanban Columns Workflow */}
          <section className="help-section">
            <div className="help-section-header">
              <Columns3 size={16} className="help-section-icon" />
              <h3 className="help-section-title">Sprint Board Columns & Lifecycle</h3>
            </div>
            <div className="workflow-steps-list">
              <div className="workflow-step-item">
                <span className="workflow-step-badge backlog">Backlog</span>
                <p className="workflow-step-desc">Unscheduled requirements, user stories, and feature requests awaiting prioritization.</p>
              </div>
              <div className="workflow-step-item">
                <span className="workflow-step-badge todo">To Do</span>
                <p className="workflow-step-desc">Prioritized tasks vetted and ready for sprint commitment and implementation.</p>
              </div>
              <div className="workflow-step-item">
                <span className="workflow-step-badge in-progress">In Progress</span>
                <p className="workflow-step-desc">Work actively being developed by the assigned engineer.</p>
              </div>
              <div className="workflow-step-item">
                <span className="workflow-step-badge in-review">In Review</span>
                <p className="workflow-step-desc">Code complete, pull request open, and undergoing peer review or QA verification.</p>
              </div>
              <div className="workflow-step-item">
                <span className="workflow-step-badge done">Done</span>
                <p className="workflow-step-desc">All acceptance criteria satisfied, merged, and shipped to production.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Key Features */}
          <section className="help-section">
            <div className="help-section-header">
              <Sparkles size={16} className="help-section-icon" />
              <h3 className="help-section-title">Tips & Interaction Gestures</h3>
            </div>
            <ul className="help-tips-list">
              <li>
                <CheckCircle2 size={15} className="tip-check-icon" />
                <span><strong>Drag and Drop:</strong> Drag cards between any columns to transition their status instantly.</span>
              </li>
              <li>
                <CheckCircle2 size={15} className="tip-check-icon" />
                <span><strong>Instant Theming:</strong> Toggle between Dark and Light mode via the top-right profile dropdown.</span>
              </li>
              <li>
                <CheckCircle2 size={15} className="tip-check-icon" />
                <span><strong>Smart Filtering:</strong> Combine free-text search with priority filters to isolate critical path issues.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
