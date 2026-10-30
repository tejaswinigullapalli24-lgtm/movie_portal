/**
 * Reusable MovieCard Component
 * Displays poster image with fallback, title, genre badge, release year, rating star, and action link.
 * 
 * Props:
 * - movie: object containing { id, title, director, genre, releaseYear, rating, poster, duration }
 * - onDelete: optional callback when delete is clicked
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie, onDelete }) {
  if (!movie) return null;

  // Fallback image in case poster fails to load
  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackPoster;
  };

  return (
    <article className="movie-card">
      <div className="movie-poster-wrapper">
        <img
          src={movie.poster || fallbackPoster}
          alt={movie.title}
          className="movie-poster-img"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="movie-poster-overlay">
          <div className="poster-top-badges">
            <span className="badge badge-genre">{movie.genre || 'Cinema'}</span>
            {movie.featured && <span className="badge badge-featured">Featured</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-year">{movie.releaseYear}</span>
            <span className="badge badge-rating">
              ★ {Number(movie.rating || 0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="movie-card-body">
        <h3 className="movie-card-title" title={movie.title}>
          <Link to={`/movies/${movie.id}`}>
            {movie.title}
          </Link>
        </h3>
        <p className="movie-card-director">
          Dir: {movie.director || 'Unknown Director'}
        </p>

        <div className="movie-card-footer">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {movie.duration || 'N/A'}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link to={`/movies/${movie.id}`} className="btn btn-outline btn-sm" title="View Details">
              Details
            </Link>
            {onDelete && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(movie)}
                title="Delete Movie"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
