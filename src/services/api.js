/**
 * Movie & Entertainment Management Portal
 * Centralized API Service Layer
 * 
 * All HTTP communication with JSON Server (http://localhost:3000)
 * is encapsulated here using the native Fetch API.
 */

const BASE_URL = 'http://localhost:3000';

/**
 * Generic fetch wrapper with error handling and JSON serialization
 * @param {string} endpoint - API endpoint (e.g., '/movies')
 * @param {object} [options={}] - Fetch configuration options
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // If HTTP status is not 2xx, throw descriptive error
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status} (${response.statusText})`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (_) {
        // Fallback to default message if body is not JSON
      }
      throw new Error(errorMessage);
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
}

/* ==========================================================================
   MOVIE API OPERATIONS (GET ALL, GET BY ID, POST, PUT, DELETE)
   ========================================================================== */

/**
 * Fetch all movies, optionally filtered by query parameters
 * @param {object} [filters={}] - Optional filters: { genre, q, releaseYear }
 * @returns {Promise<Array>} List of movie objects
 */
export async function getAllMovies(filters = {}) {
  const params = new URLSearchParams();
  if (filters.genre && filters.genre !== 'All') {
    params.append('genre', filters.genre);
  }
  if (filters.q && filters.q.trim()) {
    params.append('q', filters.q.trim());
  }
  if (filters.releaseYear && filters.releaseYear !== 'All') {
    params.append('releaseYear', filters.releaseYear);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return await request(`/movies${queryString}`);
}

/**
 * Fetch a single movie by unique identifier
 * @param {string|number} id - Movie ID
 * @returns {Promise<object>} Movie details
 */
export async function getMovieById(id) {
  if (!id) throw new Error('Movie ID is required');
  return await request(`/movies/${id}`);
}

/**
 * Create a new movie record in JSON Server
 * @param {object} movieData - Movie payload
 * @returns {Promise<object>} Created movie with assigned ID
 */
export async function createMovie(movieData) {
  return await request('/movies', {
    method: 'POST',
    body: JSON.stringify(movieData),
  });
}

/**
 * Update an existing movie record completely (PUT)
 * @param {string|number} id - Movie ID
 * @param {object} movieData - Updated movie payload
 * @returns {Promise<object>} Updated movie object
 */
export async function updateMovie(id, movieData) {
  if (!id) throw new Error('Movie ID is required for update');
  return await request(`/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movieData),
  });
}

/**
 * Delete a movie record from JSON Server
 * @param {string|number} id - Movie ID
 * @returns {Promise<object>} Deleted movie object confirmation
 */
export async function deleteMovie(id) {
  if (!id) throw new Error('Movie ID is required for deletion');
  return await request(`/movies/${id}`, {
    method: 'DELETE',
  });
}

/* ==========================================================================
   GENRE API OPERATIONS (GET, POST, PUT, DELETE)
   ========================================================================== */

/**
 * Fetch all genres
 * @returns {Promise<Array>} List of genre objects
 */
export async function getAllGenres() {
  return await request('/genres');
}

/**
 * Fetch a single genre by ID
 * @param {string|number} id - Genre ID
 * @returns {Promise<object>} Genre details
 */
export async function getGenreById(id) {
  if (!id) throw new Error('Genre ID is required');
  return await request(`/genres/${id}`);
}

/**
 * Create a new genre
 * @param {object} genreData - { name, description }
 * @returns {Promise<object>} Created genre
 */
export async function createGenre(genreData) {
  return await request('/genres', {
    method: 'POST',
    body: JSON.stringify(genreData),
  });
}

/**
 * Update a genre record (PUT)
 * @param {string|number} id - Genre ID
 * @param {object} genreData - Updated genre payload
 * @returns {Promise<object>} Updated genre
 */
export async function updateGenre(id, genreData) {
  if (!id) throw new Error('Genre ID is required for update');
  return await request(`/genres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(genreData),
  });
}

/**
 * Delete a genre record
 * @param {string|number} id - Genre ID
 * @returns {Promise<object>}
 */
export async function deleteGenre(id) {
  if (!id) throw new Error('Genre ID is required for deletion');
  return await request(`/genres/${id}`, {
    method: 'DELETE',
  });
}

/* ==========================================================================
   REVIEW API OPERATIONS (GET BY MOVIE, POST, DELETE)
   ========================================================================== */

/**
 * Fetch all reviews in the system
 * @returns {Promise<Array>} List of all reviews
 */
export async function getAllReviews() {
  return await request('/reviews');
}

/**
 * Fetch all reviews associated with a specific movie
 * @param {string|number} movieId - Movie ID
 * @returns {Promise<Array>} Reviews for the given movie
 */
export async function getReviewsByMovieId(movieId) {
  if (!movieId) throw new Error('Movie ID is required to fetch reviews');
  return await request(`/reviews?movieId=${movieId}`);
}

/**
 * Submit a new movie review and rating
 * @param {object} reviewData - { movieId, reviewerName, rating, comment }
 * @returns {Promise<object>} Created review object
 */
export async function createReview(reviewData) {
  return await request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

/**
 * Delete a user review by ID
 * @param {string|number} id - Review ID
 * @returns {Promise<object>}
 */
export async function deleteReview(id) {
  if (!id) throw new Error('Review ID is required');
  return await request(`/reviews/${id}`, {
    method: 'DELETE',
  });
}
