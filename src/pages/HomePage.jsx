/**
 * Home Page Component
 * Main landing page featuring Hero spotlight, dynamic multi-parameter filtering,
 * and responsive grid of MovieCard components.
 */

import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../services/api';
import MovieCard from '../components/MovieCard';
import HeroBanner from '../components/HeroBanner';
import FilterBar from '../components/FilterBar';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');

  // Load initial data from JSON Server
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setLoading(true);
        setError(null);
        const [moviesData, genresData] = await Promise.all([
          api.getAllMovies(),
          api.getAllGenres(),
        ]);

        if (isMounted) {
          setMovies(moviesData || []);
          setGenres(genresData || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to connect to JSON Server');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute distinct release years available in database
  const distinctYears = useMemo(() => {
    const yearsSet = new Set(movies.map((m) => m.releaseYear).filter(Boolean));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [movies]);

  // Featured movie for the Hero Banner
  const featuredMovie = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    return movies.find((m) => m.featured) || movies[0];
  }, [movies]);

  // Filter and sort movies client-side
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        // Search by title (case-insensitive)
        const matchesTitle = !searchTitle.trim() ||
          movie.title.toLowerCase().includes(searchTitle.trim().toLowerCase());

        // Filter by genre
        const matchesGenre = selectedGenre === 'All' ||
          (movie.genre && movie.genre.toLowerCase() === selectedGenre.toLowerCase());

        // Filter by release year
        const matchesYear = selectedYear === 'All' ||
          String(movie.releaseYear) === String(selectedYear);

        return matchesTitle && matchesGenre && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'rating-asc') return (a.rating || 0) - (b.rating || 0);
        if (sortBy === 'year-desc') return (b.releaseYear || 0) - (a.releaseYear || 0);
        if (sortBy === 'year-asc') return (a.releaseYear || 0) - (b.releaseYear || 0);
        if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
  }, [movies, searchTitle, selectedGenre, selectedYear, sortBy]);

  const hasActiveFilters = searchTitle.trim() !== '' || selectedGenre !== 'All' || selectedYear !== 'All';

  const handleClearFilters = () => {
    setSearchTitle('');
    setSelectedGenre('All');
    setSelectedYear('All');
    setSortBy('rating-desc');
  };

  return (
    <div className="container">
      {/* Featured Hero Banner */}
      {!loading && !error && featuredMovie && (
        <HeroBanner movie={featuredMovie} />
      )}

      {/* Filter and Search Controls */}
      <FilterBar
        searchTitle={searchTitle}
        onSearchChange={setSearchTitle}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        sortBy={sortBy}
        onSortChange={setSortBy}
        genres={genres}
        years={distinctYears}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalResults={filteredMovies.length}
      />

      {/* Loading State */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Connecting to JSON Server and loading movie database...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="empty-state" style={{ borderColor: '#ef4444' }}>
          <div className="empty-state-icon">⚠️</div>
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Failed to load movies</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMovies.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Movies Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            No movies match your selected criteria. Try adjusting your search query or filters.
          </p>
          {hasActiveFilters && (
            <button type="button" className="btn btn-primary" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Movie Grid */}
      {!loading && !error && filteredMovies.length > 0 && (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
