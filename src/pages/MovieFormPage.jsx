/**
 * Movie Form Page Component
 * Handles both Add Movie (POST) and Edit Movie (PUT).
 * Includes complete input validation, live poster preview, and dynamic genre selection.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import { useToast } from '../components/ToastNotification';

export default function MovieFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [genres, setGenres] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  // Form input states
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    rating: 8.0,
    duration: '120 min',
    poster: '',
    backdrop: '',
    synopsis: '',
    cast: '',
    featured: false,
  });

  const [errors, setErrors] = useState({});

  // Load genres and pre-fill movie data if in edit mode
  useEffect(() => {
    let isMounted = true;

    async function initializeForm() {
      try {
        const genresData = await api.getAllGenres();
        if (isMounted) {
          setGenres(genresData || []);
          if (!formData.genre && genresData && genresData.length > 0) {
            setFormData((prev) => ({ ...prev, genre: genresData[0].name }));
          }
        }

        if (isEditMode) {
          const existingMovie = await api.getMovieById(id);
          if (isMounted && existingMovie) {
            setFormData({
              title: existingMovie.title || '',
              director: existingMovie.director || '',
              genre: existingMovie.genre || (genresData?.[0]?.name || ''),
              releaseYear: existingMovie.releaseYear || new Date().getFullYear(),
              rating: existingMovie.rating ?? 8.0,
              duration: existingMovie.duration || '',
              poster: existingMovie.poster || '',
              backdrop: existingMovie.backdrop || '',
              synopsis: existingMovie.synopsis || '',
              cast: Array.isArray(existingMovie.cast) ? existingMovie.cast.join(', ') : (existingMovie.cast || ''),
              featured: Boolean(existingMovie.featured),
            });
          }
        }
      } catch (err) {
        addToast(`Failed to load form data: ${err.message}`, 'error');
      } finally {
        if (isMounted) {
          setLoadingInitial(false);
        }
      }
    }

    initializeForm();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for field upon typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Client-side Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Movie title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (!formData.director.trim()) {
      newErrors.director = 'Director name is required';
    }

    if (!formData.genre) {
      newErrors.genre = 'Please select a movie genre';
    }

    const yearNum = Number(formData.releaseYear);
    const currentYear = new Date().getFullYear() + 5;
    if (!yearNum || isNaN(yearNum) || yearNum < 1888 || yearNum > currentYear) {
      newErrors.releaseYear = `Valid release year required (1888 - ${currentYear})`;
    }

    const ratingNum = Number(formData.rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      newErrors.rating = 'Rating must be between 0.0 and 10.0';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required (e.g. 142 min)';
    }

    if (!formData.poster.trim()) {
      newErrors.poster = 'Poster image URL is required';
    } else if (!/^https?:\/\/.+/i.test(formData.poster.trim())) {
      newErrors.poster = 'Please enter a valid HTTP/HTTPS URL';
    }

    if (!formData.synopsis.trim()) {
      newErrors.synopsis = 'Movie synopsis is required';
    } else if (formData.synopsis.trim().length < 15) {
      newErrors.synopsis = 'Synopsis must be at least 15 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler (POST or PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);

      // Parse comma-separated cast into array
      const castArray = formData.cast
        ? formData.cast.split(',').map((c) => c.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title.trim(),
        director: formData.director.trim(),
        genre: formData.genre,
        releaseYear: Number(formData.releaseYear),
        rating: Number(Number(formData.rating).toFixed(1)),
        duration: formData.duration.trim(),
        poster: formData.poster.trim(),
        backdrop: formData.backdrop.trim() || formData.poster.trim(),
        synopsis: formData.synopsis.trim(),
        cast: castArray,
        featured: Boolean(formData.featured),
      };

      if (isEditMode) {
        await api.updateMovie(id, payload);
        addToast(`Movie "${payload.title}" updated successfully!`, 'success');
        navigate(`/movies/${id}`);
      } else {
        const created = await api.createMovie(payload);
        addToast(`Movie "${payload.title}" created successfully!`, 'success');
        navigate(`/movies/${created.id}`);
      }
    } catch (err) {
      addToast(`Error saving movie: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading movie information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '2rem auto 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            {isEditMode ? 'Edit Movie Details' : 'Add New Movie to Catalog'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isEditMode ? 'Update movie attributes and publish changes to JSON Server' : 'Add a brand new cinema entry with full metadata'}
          </p>
        </div>

        <Link to="/manage-movies" className="btn btn-outline btn-sm">
          Cancel
        </Link>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Title & Director */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="title">Movie Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Interstellar"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <div className="error-feedback">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="director">Director *</label>
              <input
                id="director"
                name="director"
                type="text"
                className={`form-control ${errors.director ? 'is-invalid' : ''}`}
                placeholder="e.g. Christopher Nolan"
                value={formData.director}
                onChange={handleChange}
              />
              {errors.director && <div className="error-feedback">{errors.director}</div>}
            </div>
          </div>

          {/* Genre, Year, Rating, Duration */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="genre">Genre *</label>
              <select
                id="genre"
                name="genre"
                className={`form-control ${errors.genre ? 'is-invalid' : ''}`}
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="">Select Genre</option>
                {genres.map((g) => (
                  <option key={g.id || g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
              {errors.genre && <div className="error-feedback">{errors.genre}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="releaseYear">Release Year *</label>
              <input
                id="releaseYear"
                name="releaseYear"
                type="number"
                className={`form-control ${errors.releaseYear ? 'is-invalid' : ''}`}
                value={formData.releaseYear}
                onChange={handleChange}
              />
              {errors.releaseYear && <div className="error-feedback">{errors.releaseYear}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="rating">Critic Rating (0.0 - 10.0) *</label>
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
                value={formData.rating}
                onChange={handleChange}
              />
              {errors.rating && <div className="error-feedback">{errors.rating}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="duration">Runtime / Duration *</label>
              <input
                id="duration"
                name="duration"
                type="text"
                className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                placeholder="e.g. 148 min"
                value={formData.duration}
                onChange={handleChange}
              />
              {errors.duration && <div className="error-feedback">{errors.duration}</div>}
            </div>
          </div>

          {/* Poster URL with Live Preview */}
          <div className="form-group">
            <label className="form-label" htmlFor="poster">Poster Image URL *</label>
            <input
              id="poster"
              name="poster"
              type="url"
              className={`form-control ${errors.poster ? 'is-invalid' : ''}`}
              placeholder="https://images.unsplash.com/..."
              value={formData.poster}
              onChange={handleChange}
            />
            {errors.poster && <div className="error-feedback">{errors.poster}</div>}

            {formData.poster && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="poster-preview-box">
                  <img
                    src={formData.poster}
                    alt="Poster Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Live Poster Image Preview
                </span>
              </div>
            )}
          </div>

          {/* Backdrop Image URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="backdrop">Widescreen Backdrop Banner URL (Optional)</label>
            <input
              id="backdrop"
              name="backdrop"
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-... (optional landscape header)"
              value={formData.backdrop}
              onChange={handleChange}
            />
          </div>

          {/* Cast */}
          <div className="form-group">
            <label className="form-label" htmlFor="cast">Starring Cast (Comma Separated)</label>
            <input
              id="cast"
              name="cast"
              type="text"
              className="form-control"
              placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
              value={formData.cast}
              onChange={handleChange}
            />
          </div>

          {/* Synopsis */}
          <div className="form-group">
            <label className="form-label" htmlFor="synopsis">Movie Synopsis *</label>
            <textarea
              id="synopsis"
              name="synopsis"
              rows="4"
              className={`form-control ${errors.synopsis ? 'is-invalid' : ''}`}
              placeholder="Detailed plot summary..."
              value={formData.synopsis}
              onChange={handleChange}
            />
            {errors.synopsis && <div className="error-feedback">{errors.synopsis}</div>}
          </div>

          {/* Featured Spotlight Toggle */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
            <input
              id="featured"
              name="featured"
              type="checkbox"
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-red)', cursor: 'pointer' }}
              checked={formData.featured}
              onChange={handleChange}
            />
            <label htmlFor="featured" style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 }}>
              Feature this movie on the Home Page Hero Spotlight
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving Movie...' : isEditMode ? 'Update Movie (PUT)' : 'Create Movie (POST)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
