/**
 * Reusable Footer Component
 * Clean cinema footer with project metadata, quick links, and stack badges.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>
              Cine<span style={{ color: 'var(--accent-red)' }}>Portal</span>
            </span>
            <span className="badge badge-year">Capstone Edition</span>
          </div>
          <p style={{ maxWidth: '420px', fontSize: '0.85rem' }}>
            A full-stack entertainment & cinema catalog management application built with React, 
            React Router DOM, custom CSS, and JSON Server.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Quick Links</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)' }}>Catalog</Link>
            <Link to="/manage-movies" style={{ color: 'var(--text-muted)' }}>Manage Movies</Link>
            <Link to="/manage-genres" style={{ color: 'var(--text-muted)' }}>Genres</Link>
            <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Admin Dashboard</Link>
          </div>
          <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} Movie & Entertainment Management Portal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
