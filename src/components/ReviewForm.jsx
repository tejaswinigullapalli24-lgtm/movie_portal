/**
 * Reusable ReviewForm Component
 * Allows users to rate a movie (1-10) and write a detailed review.
 * Includes complete client-side validation.
 */

import React, { useState } from 'react';

export default function ReviewForm({ movieId, onSubmitReview, submitting = false }) {
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(10);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!reviewerName.trim()) {
      newErrors.reviewerName = 'Please provide your name or cinema handle';
    } else if (reviewerName.trim().length < 2) {
      newErrors.reviewerName = 'Name must be at least 2 characters long';
    }

    if (!rating || rating < 1 || rating > 10) {
      newErrors.rating = 'Rating must be between 1 and 10';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write a review comment';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const reviewPayload = {
      movieId: String(movieId),
      reviewerName: reviewerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const success = await onSubmitReview(reviewPayload);
    if (success) {
      setReviewerName('');
      setRating(10);
      setComment('');
      setErrors({});
    }
  };

  return (
    <div className="review-form-card">
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Leave a Review & Rating
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Share your thoughts and rate this film out of 10 stars for the community.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Reviewer Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="reviewerName">Your Name</label>
          <input
            id="reviewerName"
            type="text"
            className={`form-control ${errors.reviewerName ? 'is-invalid' : ''}`}
            placeholder="e.g. CinemaCritic_99"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            disabled={submitting}
          />
          {errors.reviewerName && <div className="error-feedback">{errors.reviewerName}</div>}
        </div>

        {/* Rating Selector (1-10) */}
        <div className="form-group">
          <label className="form-label">
            Your Rating: <strong style={{ color: 'var(--accent-gold)' }}>★ {hoverRating || rating} / 10</strong>
          </label>
          <div className="star-rating-selector" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starVal) => {
              const isFilled = (hoverRating || rating) >= starVal;
              return (
                <button
                  type="button"
                  key={starVal}
                  className={`star-btn ${isFilled ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onClick={() => setRating(starVal)}
                  aria-label={`Rate ${starVal} out of 10`}
                  title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              );
            })}
          </div>
          {errors.rating && <div className="error-feedback">{errors.rating}</div>}
        </div>

        {/* Review Comment */}
        <div className="form-group">
          <label className="form-label" htmlFor="reviewComment">Review</label>
          <textarea
            id="reviewComment"
            rows="4"
            className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
            placeholder="What made this movie memorable? Acting, direction, cinematography, pacing..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
          />
          {errors.comment && <div className="error-feedback">{errors.comment}</div>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'Submitting Review...' : 'Post Review'}
        </button>
      </form>
    </div>
  );
}
