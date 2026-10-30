/**
 * Reusable StatCard Component
 * Displays single KPI metric on Admin Dashboard with custom icon and badge.
 */

import React from 'react';

export default function StatCard({ title, value, subtitle, icon, iconBg = 'rgba(229, 9, 20, 0.15)', iconColor = 'var(--accent-red)' }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>

      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-label">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
