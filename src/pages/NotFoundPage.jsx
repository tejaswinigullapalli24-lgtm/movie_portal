/**
 * 404 Not Found Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className="empty-state" style={{ margin: '5rem auto', maxWidth: '600px' }}>
        <div className="empty-state-icon">🎬 404</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>
          Page Off-Script
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          The scene or route you are looking for has been cut from the final theatrical release.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Cinema Home
        </Link>
      </div>
    </div>
  );
}
