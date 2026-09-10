import React, { useState, useEffect } from 'react';
import { useJiraStore } from '../store/useJiraStore';
import type { IssueStatus, Priority } from '../types/jira';
import { COLUMNS } from '../types/jira';
import { X, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

const ASSIGNEES = [
  'Karthick N',
  'Sarah Connor',
  'Alex Rivera',
  'Elena Rostova',
  'Marcus Vance',
  'Unassigned',
];

export const IssueModal: React.FC = () => {
  const {
    isModalOpen,
    closeModal,
    selectedIssue,
    modalInitialStatus,
    addIssue,
    updateIssue,
    deleteIssue,
  } = useJiraStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignee, setAssignee] = useState('Unassigned');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!selectedIssue;

  useEffect(() => {
    if (selectedIssue) {
      setTitle(selectedIssue.title);
      setDescription(selectedIssue.description || '');
      setStatus(selectedIssue.status);
      setPriority(selectedIssue.priority);
      setAssignee(selectedIssue.assignee || 'Unassigned');
    } else {
      setTitle('');
      setDescription('');
      setStatus(modalInitialStatus || 'todo');
      setPriority('medium');
      setAssignee('Karthick N');
    }
    setShowConfirmDelete(false);
    setError('');
  }, [selectedIssue, modalInitialStatus, isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (isEditing && selectedIssue) {
      updateIssue(selectedIssue.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assignee,
      });
    } else {
      addIssue({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assignee,
      });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (selectedIssue) {
      deleteIssue(selectedIssue.id);
      closeModal();
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="modal-heading" className="modal-heading">
              {isEditing ? `Edit Issue: ${selectedIssue.id}` : 'Create New Issue'}
            </h2>
            {isEditing && selectedIssue && (
              <span className="modal-created-date">Created on {selectedIssue.createdAt}</span>
            )}
          </div>
          <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="form-error-banner">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="issue-title" className="form-label required">
              Summary / Title
            </label>
            <input
              id="issue-title"
              type="text"
              className="form-input"
              placeholder="e.g. Implement user login session refresh token"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="issue-status" className="form-label">
                Status / Column
              </label>
              <select
                id="issue-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="issue-priority" className="form-label">
                Priority
              </label>
              <select
                id="issue-priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="issue-assignee" className="form-label">
              Assignee
            </label>
            <select
              id="issue-assignee"
              className="form-select"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              {ASSIGNEES.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issue-description" className="form-label">
              Description
            </label>
            <textarea
              id="issue-description"
              className="form-textarea"
              rows={4}
              placeholder="Add detailed task context, acceptance criteria, or technical implementation notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            {isEditing && (
              <div className="delete-action-wrapper">
                {showConfirmDelete ? (
                  <div className="confirm-delete-box">
                    <span>Delete this issue permanently?</span>
                    <button
                      type="button"
                      className="btn-danger-confirm"
                      onClick={handleDelete}
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowConfirmDelete(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}

            <div className="modal-footer-actions">
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <CheckCircle size={16} />
                <span>{isEditing ? 'Save Changes' : 'Create Issue'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
