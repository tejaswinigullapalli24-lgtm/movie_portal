/**
 * Reusable FilterBar Component
 * Provides live search by title, genre filtering, release year filtering,
 * rating/year sorting, and a reset button.
 */

import React from 'react';

export default function FilterBar({
  searchTitle,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedYear,
  onYearChange,
  sortBy,
  onSortChange,
  genres = [],
  years = [],
  onClearFilters,
  hasActiveFilters,
  totalResults = 0,
}) {
  return (
    <div className="filter-bar-card">
      <div className="filter-grid">
        {/* Search by Title */}
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search movies by title..."
            value={searchTitle}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter by Genre */}
        <div>
          <select
            className="filter-select"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            aria-label="Filter by Genre"
          >
            <option value="All">All Genres</option>
            {genres.map((g) => (
              <option key={g.id || g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Release Year */}
        <div>
          <select
            className="filter-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            aria-label="Filter by Release Year"
          >
            <option value="All">All Years</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort Movies"
          >
            <option value="rating-desc">Rating: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="year-desc">Year: Newest First</option>
            <option value="year-asc">Year: Oldest First</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            style={{ opacity: hasActiveFilters ? 1 : 0.45 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
            Clear
          </button>
        </div>
      </div>

      <div className="filter-meta">
        <span>
          Showing <strong>{totalResults}</strong> movie{totalResults === 1 ? '' : 's'}
        </span>
        {hasActiveFilters && (
          <span style={{ color: 'var(--accent-gold)' }}>
            ● Active filters applied
          </span>
        )}
      </div>
    </div>
  );
}
