/**
 * Admin Dashboard Page Component
 * Dynamically computes analytics from JSON Server:
 * - Total number of movies
 * - Average movie rating
 * - Highest-rated movie highlight
 * - Total community reviews
 * - Movies grouped by genre with dynamic percentage breakdown
 * - Top-rated movies leaderboard table
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import StatCard from '../components/StatCard';

export default function DashboardPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all resources dynamically from JSON Server
  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [moviesData, genresData, reviewsData] = await Promise.all([
          api.getAllMovies(),
          api.getAllGenres(),
          api.getAllReviews(),
        ]);

        if (isMounted) {
          setMovies(moviesData || []);
          setGenres(genresData || []);
          setReviews(reviewsData || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch dashboard metrics');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Statistics dynamically
  const stats = useMemo(() => {
    const totalMovies = movies.length;

    // Average movie rating
    const avgRating = totalMovies > 0
      ? (movies.reduce((sum, m) => sum + Number(m.rating || 0), 0) / totalMovies).toFixed(2)
      : '0.0';

    // Highest rated movie
    let highestRatedMovie = null;
    if (totalMovies > 0) {
      highestRatedMovie = [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    }

    // Movies grouped by genre
    const genreDistribution = genres.map((genre) => {
      const count = movies.filter(
        (m) => m.genre && m.genre.toLowerCase() === genre.name.toLowerCase()
      ).length;
      const percentage = totalMovies > 0 ? ((count / totalMovies) * 100).toFixed(1) : 0;
      return {
        ...genre,
        count,
        percentage,
      };
    }).sort((a, b) => b.count - a.count);

    // Top 5 Highest Rated Movies
    const topMovies = [...movies]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return {
      totalMovies,
      avgRating,
      highestRatedMovie,
      genreDistribution,
      topMovies,
      totalReviews: reviews.length,
      totalGenres: genres.length,
    };
  }, [movies, genres, reviews]);

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Calculating live database statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="empty-state" style={{ borderColor: '#ef4444' }}>
          <div className="empty-state-icon">⚠️</div>
          <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Dashboard Error</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Live metrics aggregated dynamically from JSON Server database
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/movies/new" className="btn btn-primary btn-sm">
            + New Movie
          </Link>
          <Link to="/manage-genres" className="btn btn-secondary btn-sm">
            Manage Genres
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="stats-grid">
        {/* Total Movies */}
        <StatCard
          title="Total Movies"
          value={stats.totalMovies}
          subtitle={`Across ${stats.totalGenres} genres`}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
            </svg>
          }
          iconBg="rgba(229, 9, 20, 0.15)"
          iconColor="var(--accent-red)"
        />

        {/* Average Rating */}
        <StatCard
          title="Average Rating"
          value={`★ ${stats.avgRating}`}
          subtitle="Overall critic score out of 10"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          }
          iconBg="rgba(245, 197, 24, 0.15)"
          iconColor="var(--accent-gold)"
        />

        {/* Total Reviews */}
        <StatCard
          title="Community Reviews"
          value={stats.totalReviews}
          subtitle="Audience critiques submitted"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          }
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="var(--accent-green)"
        />

        {/* Total Genres */}
        <StatCard
          title="Active Genres"
          value={stats.totalGenres}
          subtitle="Catalog classification tags"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
            </svg>
          }
          iconBg="rgba(59, 130, 246, 0.15)"
          iconColor="var(--accent-blue)"
        />
      </div>

      {/* Highest-Rated Movie Spotlight */}
      {stats.highestRatedMovie && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <img
            src={stats.highestRatedMovie.poster}
            alt={stats.highestRatedMovie.title}
            style={{ width: '80px', height: '115px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <span className="badge badge-featured" style={{ marginBottom: '0.35rem' }}>
              Highest Rated Film in Portal
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              <Link to={`/movies/${stats.highestRatedMovie.id}`}>
                {stats.highestRatedMovie.title} ({stats.highestRatedMovie.releaseYear})
              </Link>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Directed by {stats.highestRatedMovie.director} • Genre: {stats.highestRatedMovie.genre}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
              ★ {Number(stats.highestRatedMovie.rating).toFixed(1)}
            </div>
            <Link to={`/movies/${stats.highestRatedMovie.id}`} className="btn btn-outline btn-sm">
              View Movie
            </Link>
          </div>
        </div>
      )}

      {/* Grouped by Genre & Top Movies Grid */}
      <div className="dashboard-sections-grid">
        {/* Movies Grouped by Genre */}
        <div className="dashboard-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Movies Grouped by Genre</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Distribution</span>
          </div>

          <div>
            {stats.genreDistribution.map((item) => (
              <div key={item.id} className="genre-bar-item">
                <div className="genre-bar-header">
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {item.count} movie{item.count === 1 ? '' : 's'} ({item.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Leaderboard */}
        <div className="dashboard-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Top 5 Highest-Rated Films</h3>
            <Link to="/manage-movies" style={{ fontSize: '0.8rem', color: 'var(--accent-red)' }}>
              View All →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="cinema-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Movie</th>
                  <th>Genre</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stats.topMovies.map((m, idx) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <Link to={`/movies/${m.id}`} style={{ fontWeight: 600 }}>
                        {m.title}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {m.releaseYear} • {m.director}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-genre">{m.genre}</span>
                    </td>
                    <td>
                      <span className="badge badge-rating">★ {Number(m.rating).toFixed(1)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
