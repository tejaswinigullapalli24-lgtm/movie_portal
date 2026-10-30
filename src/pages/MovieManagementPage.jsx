/**
 * Movie Management Page Component
 * Complete administrative interface for viewing, filtering, editing, and deleting movies.
 * Enforces confirmation modal before executing DELETE requests.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../components/ToastNotification';

export default function MovieManagementPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');

  // Deletion state
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [moviesData, genresData] = await Promise.all([
        api.getAllMovies(),
        api.getAllGenres(),
      ]);
      setMovies(moviesData || []);
      setGenres(genresData || []);
    } catch (err) {
      setError(err.message || 'Failed to load movie catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = !searchTerm.trim() ||
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.director && movie.director.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGenre = genreFilter === 'All' ||
        (movie.genre && movie.genre.toLowerCase() === genreFilter.toLowerCase());

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchTerm, genreFilter]);

  // Handle Delete Confirmation (DELETE)
  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteMovie(movieToDelete.id);
      setMovies((prev) => prev.filter((m) => m.id !== movieToDelete.id));
      addToast(`Movie "${movieToDelete.title}" was successfully deleted`, 'success');
      setMovieToDelete(null);
    } catch (err) {
      addToast(`Failed to delete movie: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container">
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Movie Catalog Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage cinema listings, update metadata, and review catalog inventory
          </p>
        </div>

        <Link to="/movies/new" className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Movie
        </Link>
      </div>

      {/* Filter and Search controls */}
      <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="search-input"
          style={{ maxWidth: '320px', paddingLeft: '1rem' }}
          placeholder="Search by title or director..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          style={{ maxWidth: '200px' }}
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="All">All Genres</option>
          {genres.map((g) => (
            <option key={g.id || g.name} value={g.name}>{g.name}</option>
          ))}
        </select>

        <span style={{ marginLeft: 'auto', alignSelf: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {filteredMovies.length} of {movies.length} movies listed
        </span>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading movie catalog...</p>
        </div>
      )}

      {error && !loading && (
        <div className="empty-state" style={{ borderColor: '#ef4444' }}>
          <div className="empty-state-icon">⚠️</div>
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Database Error</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={loadData}>
            Try Again
          </button>
        </div>
      )}

      {/* Table view */}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="cinema-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Poster</th>
                <th>Title & Director</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Duration</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No movies found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        style={{ width: '42px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <Link to={`/movies/${movie.id}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {movie.title}
                      </Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Dir: {movie.director || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-genre">{movie.genre}</span>
                    </td>
                    <td>
                      <span className="badge badge-year">{movie.releaseYear}</span>
                    </td>
                    <td>
                      <span className="badge badge-rating">★ {Number(movie.rating).toFixed(1)}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {movie.duration || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link to={`/movies/${movie.id}`} className="btn btn-outline btn-sm" title="View Details">
                          View
                        </Link>
                        <Link to={`/movies/edit/${movie.id}`} className="btn btn-secondary btn-sm" title="Edit Movie">
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setMovieToDelete(movie)}
                          title="Delete Movie"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(movieToDelete)}
        title="Confirm Movie Deletion"
        message={
          movieToDelete
            ? `Are you sure you want to delete "${movieToDelete.title}" (${movieToDelete.releaseYear})? This will permanently erase the movie record and its associated audience reviews from JSON Server.`
            : ''
        }
        confirmText="Yes, Delete Movie"
        confirmBtnClass="btn-danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMovieToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
