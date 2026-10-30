/**
 * Reusable ReviewList Component
 * Displays user reviews with reviewer name, formatted date, rating stars, and comment.
 */

import React from 'react';

export default function ReviewList({ reviews = [], onDeleteReview }) {
  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💬</div>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>No reviews yet</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Be the first cinema fan to share your critique and rating!
        </p>
      </div>
    );
  }

  return (
    <div className="review-list-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Community Reviews ({reviews.length})
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Verified Audience
        </span>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-card-header">
            <div className="reviewer-name">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-red)' }}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{review.reviewerName}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-rating">
                ★ {review.rating} / 10
              </span>
              <span className="review-date">{formatDate(review.createdAt)}</span>
              {onDeleteReview && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.4rem', border: 'none', color: '#ef4444' }}
                  onClick={() => onDeleteReview(review.id)}
                  title="Remove Review"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
