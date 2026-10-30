/**
 * Reusable GenreModal Component
 * Handles creating new genres (POST) and updating existing ones (PUT).
 */

import React, { useState, useEffect } from 'react';

export default function GenreModal({
  isOpen,
  genreToEdit = null,
  onSave,
  onClose,
  isSaving = false,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (genreToEdit) {
      setName(genreToEdit.name || '');
      setDescription(genreToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setErrors({});
  }, [genreToEdit, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Genre name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Genre name must be at least 2 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: genreToEdit ? genreToEdit.id : undefined,
      name: name.trim(),
      description: description.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget && !isSaving) onClose();
    }}>
      <div className="modal-dialog" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">
            {genreToEdit ? 'Edit Genre' : 'Add New Genre'}
          </h3>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ border: 'none', fontSize: '1.25rem', padding: '0.2rem 0.5rem' }}
            onClick={onClose}
            disabled={isSaving}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="genreName">Genre Name</label>
            <input
              id="genreName"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Cyberpunk, Psychological Thriller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
            />
            {errors.name && <div className="error-feedback">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="genreDesc">Description</label>
            <textarea
              id="genreDesc"
              rows="3"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              placeholder="Provide a brief thematic definition for this genre category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
            />
            {errors.description && <div className="error-feedback">{errors.description}</div>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : genreToEdit ? 'Update Genre' : 'Create Genre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
