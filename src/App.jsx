/**
 * Main Application Component
 * Configures React Router DOM routes, global Toast Provider, and base layout structure.
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ToastNotification';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import MovieManagementPage from './pages/MovieManagementPage';
import MovieFormPage from './pages/MovieFormPage';
import GenreManagementPage from './pages/GenreManagementPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* 1. Home Page - Catalog, Search & Filters */}
            <Route path="/" element={<HomePage />} />

            {/* 2. Movie Details & Reviews */}
            <Route path="/movies/:id" element={<MovieDetailsPage />} />

            {/* 3. Movie Management & Forms */}
            <Route path="/manage-movies" element={<MovieManagementPage />} />
            <Route path="/movies/new" element={<MovieFormPage />} />
            <Route path="/movies/edit/:id" element={<MovieFormPage />} />

            {/* 4. Genre Taxonomy Management */}
            <Route path="/manage-genres" element={<GenreManagementPage />} />

            {/* 5. Dynamic Analytics Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ToastProvider>
  );
}
