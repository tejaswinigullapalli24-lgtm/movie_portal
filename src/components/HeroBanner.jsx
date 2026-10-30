/**
 * Reusable HeroBanner Component
 * Highlights a featured movie in a widescreen cinematic header.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  const backdropUrl = movie.backdrop || movie.poster || 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="hero-banner">
      <div 
        className="hero-backdrop" 
        style={{ backgroundImage: `url("${backdropUrl}")` }}
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-featured">Spotlight Cinema</span>
          <span className="badge badge-genre">{movie.genre}</span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          <span className="badge badge-year">{movie.releaseYear}</span>
          <span className="badge badge-rating">★ {Number(movie.rating).toFixed(1)} / 10</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{movie.duration}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>• Dir. {movie.director}</span>
        </div>

        <p className="hero-synopsis">{movie.synopsis}</p>

        <div className="hero-actions">
          <Link to={`/movies/${movie.id}`} className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Explore Movie Details
          </Link>
          <Link to={`/movies/edit/${movie.id}`} className="btn btn-secondary">
            Edit Information
          </Link>
        </div>
      </div>
    </div>
  );
}
