/**
 * Movie Details Page Component
 * Displays complete movie information, cast list, runtime, backdrop banner,
 * dynamic audience reviews, interactive review form, and action options.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../components/ToastNotification';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load movie and reviews from JSON Server
  useEffect(() => {
    let isMounted = true;

    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError(null);

        const [movieData, reviewsData] = await Promise.all([
          api.getMovieById(id),
          api.getReviewsByMovieId(id),
        ]);

        if (isMounted) {
          setMovie(movieData);
          setReviews(reviewsData || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Movie not found or server error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle Review Submission (POST)
  const handleReviewSubmit = async (reviewPayload) => {
    try {
      setSubmittingReview(true);
      const createdReview = await api.createReview(reviewPayload);
      
      // Update local state with new review
      setReviews((prev) => [createdReview, ...prev]);

      addToast('Review submitted successfully!', 'success');
      return true;
    } catch (err) {
      addToast(`Failed to submit review: ${err.message}`, 'error');
      return false;
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle Review Deletion (DELETE)
  const handleDeleteReview = async (reviewId) => {
    try {
      await api.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      addToast('Review removed', 'info');
    } catch (err) {
      addToast(`Failed to remove review: ${err.message}`, 'error');
    }
  };

  // Handle Movie Deletion (DELETE)
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.deleteMovie(id);
      addToast(`Movie "${movie.title}" deleted successfully`, 'success');
      setDeleteModalOpen(false);
      navigate('/');
    } catch (err) {
      addToast(`Failed to delete movie: ${err.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading cinematic details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container">
        <div className="empty-state" style={{ borderColor: '#ef4444' }}>
          <div className="empty-state-icon">❌</div>
          <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Movie Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'The requested movie record could not be found in the database.'}
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Calculate dynamic average community rating if reviews exist
  const averageCommunityRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="container">
      {/* Back button & actions bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0' }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/movies/edit/${movie.id}`} className="btn btn-secondary btn-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Movie
          </Link>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setDeleteModalOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Cinematic Details Header */}
      <div className="movie-details-header">
        <div
          className="movie-details-backdrop"
          style={{ backgroundImage: `url("${movie.backdrop || movie.poster}")` }}
        />
        <div className="movie-details-overlay" />

        <div className="movie-details-content">
          <img
            src={movie.poster}
            alt={movie.title}
            className="details-poster"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-genre">{movie.genre}</span>
              {movie.featured && <span className="badge badge-featured">Featured</span>}
            </div>

            <h1 className="details-title">{movie.title}</h1>

            <div className="details-meta-row">
              <span className="badge badge-year">{movie.releaseYear}</span>
              <span className="badge badge-rating">★ {Number(movie.rating).toFixed(1)} / 10 Critic</span>
              {averageCommunityRating && (
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ★ {averageCommunityRating} Audience ({reviews.length})
                </span>
              )}
              <span style={{ color: 'var(--text-muted)' }}>⏱ {movie.duration || 'N/A'}</span>
              <span style={{ color: 'var(--text-muted)' }}>🎬 Dir. {movie.director}</span>
            </div>

            <p className="details-synopsis">{movie.synopsis}</p>

            {/* Cast List */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                  Starring Cast
                </h4>
                <div className="cast-pills">
                  {movie.cast.map((actor, idx) => (
                    <span key={idx} className="cast-pill">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Ratings and Reviews Section */}
      <section className="reviews-section">
        {/* Review Submission Form */}
        <ReviewForm
          movieId={movie.id}
          onSubmitReview={handleReviewSubmit}
          submitting={submittingReview}
        />

        {/* Existing Reviews List */}
        <ReviewList
          reviews={reviews}
          onDeleteReview={handleDeleteReview}
        />
      </section>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Movie"
        message={`Are you sure you want to permanently remove "${movie.title}" (${movie.releaseYear}) from the database? This will also remove associated reviews.`}
        confirmText="Confirm Delete"
        confirmBtnClass="btn-danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={deleting}
      />
    </div>
  );
}
