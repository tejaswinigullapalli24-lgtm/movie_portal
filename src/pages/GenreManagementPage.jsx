/**
 * Genre Management Page Component
 * Complete CRUD interface for movie genres (GET, POST, PUT, DELETE).
 * Enforces validation, modal dialogs, and checks movie count before deletion.
 */

import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import GenreModal from '../components/GenreModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../components/ToastNotification';

export default function GenreManagementPage() {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [genreToEdit, setGenreToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useToast();

  const loadGenresAndMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const [genresData, moviesData] = await Promise.all([
        api.getAllGenres(),
        api.getAllMovies(),
      ]);
      setGenres(genresData || []);
      setMovies(moviesData || []);
    } catch (err) {
      setError(err.message || 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenresAndMovies();
  }, []);

  // Compute movie count for each genre
  const getMovieCountForGenre = (genreName) => {
    if (!genreName || !movies) return 0;
    return movies.filter((m) => m.genre && m.genre.toLowerCase() === genreName.toLowerCase()).length;
  };

  // Open Create Genre Modal
  const handleOpenCreateModal = () => {
    setGenreToEdit(null);
    setGenreModalOpen(true);
  };

  // Open Edit Genre Modal
  const handleOpenEditModal = (genre) => {
    setGenreToEdit(genre);
    setGenreModalOpen(true);
  };

  // Save Genre (POST or PUT)
  const handleSaveGenre = async (genreData) => {
    try {
      setIsSaving(true);
      if (genreData.id) {
        // PUT
        const updated = await api.updateGenre(genreData.id, {
          name: genreData.name,
          description: genreData.description,
        });
        setGenres((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        addToast(`Genre "${updated.name}" updated successfully!`, 'success');
      } else {
        // POST
        const created = await api.createGenre({
          name: genreData.name,
          description: genreData.description,
        });
        setGenres((prev) => [...prev, created]);
        addToast(`Genre "${created.name}" created successfully!`, 'success');
      }
      setGenreModalOpen(false);
    } catch (err) {
      addToast(`Error saving genre: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Genre (DELETE)
  const handleConfirmDelete = async () => {
    if (!genreToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteGenre(genreToDelete.id);
      setGenres((prev) => prev.filter((g) => g.id !== genreToDelete.id));
      addToast(`Genre "${genreToDelete.name}" deleted successfully!`, 'success');
      setGenreToDelete(null);
    } catch (err) {
      addToast(`Failed to delete genre: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Genre Taxonomy Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Configure cinema category classifications and thematic definitions
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Genre
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading genre taxonomy from JSON Server...</p>
        </div>
      )}

      {error && !loading && (
        <div className="empty-state" style={{ borderColor: '#ef4444' }}>
          <div className="empty-state-icon">⚠️</div>
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Failed to Load Genres</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={loadGenresAndMovies}>
            Retry
          </button>
        </div>
      )}

      {/* Genres Grid */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {genres.map((genre) => {
            const movieCount = getMovieCountForGenre(genre.name);
            return (
              <div
                key={genre.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {genre.name}
                    </h3>
                    <span className="badge badge-genre">
                      {movieCount} Movie{movieCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {genre.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEditModal(genre)}
                  >
                    Edit (PUT)
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setGenreToDelete(genre)}
                  >
                    Delete (DELETE)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Genre Modal */}
      <GenreModal
        isOpen={genreModalOpen}
        genreToEdit={genreToEdit}
        onSave={handleSaveGenre}
        onClose={() => setGenreModalOpen(false)}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(genreToDelete)}
        title="Delete Genre"
        message={
          genreToDelete
            ? `Are you sure you want to delete the genre "${genreToDelete.name}"? ${
                getMovieCountForGenre(genreToDelete.name) > 0
                  ? `Notice: There are currently ${getMovieCountForGenre(genreToDelete.name)} movie(s) classified under this genre.`
                  : ''
              }`
            : ''
        }
        confirmText="Confirm Delete"
        confirmBtnClass="btn-danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setGenreToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
