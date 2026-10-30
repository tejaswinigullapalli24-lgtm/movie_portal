# 🎬 Movie & Entertainment Management Portal (CinePortal)

> **College Capstone Project**  
> A full-stack cinema catalog and entertainment management application built with **React**, **React Router DOM**, **Custom Dark Cinema CSS**, and a **JSON Server REST Backend**.

---

## 📌 Project Overview

**CinePortal** is an interactive, responsive web portal designed for cinema enthusiasts and entertainment platform administrators. It provides an end-to-end management experience for movies, genre taxonomy, and audience critique reviews.

### ✨ Key Features

1. **Cinematic Home Page & Spotlight**:
   - Hero banner spotlighting featured movies with high-resolution cinematic backdrops.
   - Dynamic movie cards displaying poster, title, genre badge, release year, duration, and critic ratings.
2. **Multi-Parameter Search & Filter Engine**:
   - Live title search (case-insensitive full-text matching).
   - Dynamic genre dropdown filter populated directly from JSON Server.
   - Release year filter extracted dynamically from available catalog entries.
   - Dynamic sorting (Highest/Lowest Rating, Newest/Oldest Release, Alphabetical A-Z).
   - "Clear Filters" with active filter indicators and real-time result counters.
3. **Movie Details & Audience Critique Section**:
   - High-definition widescreen backdrop with movie metadata, duration, director, and interactive cast pills.
   - Dual-score display showing professional critic rating and community audience average.
   - Interactive 10-star rating selector and review submission form with client-side validation.
   - Real-time review feed with reviewer avatar badges and timestamps.
4. **Admin Dashboard & Analytics**:
   - Real-time KPI metric cards (Total Movies, Average Rating, Total Reviews, Active Genres).
   - Highest-rated movie spotlight showcase.
   - Movies grouped by genre with dynamic percentage distribution meters rendered using pure CSS.
   - Top 5 Highest-Rated Films leaderboard table.
5. **Full Movie CRUD Operations**:
   - **Create (POST)**: Comprehensive Add Movie form with live poster image preview.
   - **Read (GET)**: Movie list and detailed single-movie views.
   - **Update (PUT)**: Complete movie editor with pre-filled form values.
   - **Delete (DELETE)**: Safe deletion with accessible confirmation modal dialog.
6. **Genre Taxonomy Management**:
   - Complete CRUD operations on genres (`GET`, `POST`, `PUT`, `DELETE`).
   - Modal forms for creating and editing genres.
   - Cross-resource dependency check to display associated movie counts before deleting.
7. **Pure Custom CSS3 Design System**:
   - Handcrafted dark cinema theme utilizing CSS Variables, glassmorphic card surfaces, Netflix crimson and IMDb gold accents.
   - Zero reliance on bloated CSS UI frameworks.
   - Fully responsive on mobile, tablet, and widescreen desktop displays.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | React 19 (Functional Components, Hooks) |
| **Build Tool & Bundler** | Vite |
| **Routing** | React Router DOM v7 |
| **Backend REST API** | JSON Server / Node.js REST API |
| **Database** | `db.json` (Movies, Genres, Reviews) |
| **HTTP Client** | Native Fetch API (`src/services/api.js`) |
| **Styling** | Pure CSS3 (Custom Variables, Flexbox, CSS Grid) |

---

## 📂 Project Structure

```text
movie-entertainment-portal/
├── db.json                      # JSON Server Database (movies, genres, reviews)
├── server.js                    # REST API backend server (port 3000)
├── index.html                   # HTML5 Entry Point with cinema typography
├── package.json                 # Project dependencies & scripts
├── README.md                    # Installation and execution instructions
├── PROJECT_EXPLANATION.md       # Capstone architectural and conceptual report
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application router and layout wrapper
    ├── index.css                # Dark cinema CSS design system
    ├── assets/                  # Static assets and media
    ├── components/              # Reusable functional UI components
    │   ├── Navbar.jsx           # Responsive sticky header with brand and links
    │   ├── Footer.jsx           # Application footer
    │   ├── MovieCard.jsx        # Reusable movie card with poster & badges
    │   ├── HeroBanner.jsx       # Featured movie spotlight hero banner
    │   ├── FilterBar.jsx        # Search, genre, year, and sort controls
    │   ├── ReviewForm.jsx       # 10-star rating & critique submission form
    │   ├── ReviewList.jsx       # Audience review cards feed
    │   ├── StatCard.jsx         # Dashboard KPI metric cards
    │   ├── GenreModal.jsx       # Create/Edit genre modal form
    │   ├── ConfirmationModal.jsx# Delete confirmation modal dialog
    │   └── ToastNotification.jsx# Toast alert system (success, error, info)
    ├── pages/                   # Application route views
    │   ├── HomePage.jsx         # Cinema catalog with search & filters
    │   ├── MovieDetailsPage.jsx # Movie info, cast, and review system
    │   ├── MovieManagementPage.jsx # Admin movie table with CRUD actions
    │   ├── MovieFormPage.jsx    # Add (POST) & Edit (PUT) movie form
    │   ├── GenreManagementPage.jsx # Genre taxonomy management
    │   ├── DashboardPage.jsx    # Analytics & genre distribution metrics
    │   └── NotFoundPage.jsx     # 404 Error page
    └── services/
        └── api.js               # Centralized Fetch API service layer
```

---

## 🚀 Installation & Execution Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm** package manager

### 2. Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm install
# or
pnpm install
```

### 3. Start the JSON Server Backend
The backend REST API serves data from `db.json` on **port 3000**:
```bash
npm run server:node
# or using json-server CLI:
npm run server
```
*API will be available at:* `http://localhost:3000`  
*Endpoints:*
- Movies: `http://localhost:3000/movies`
- Genres: `http://localhost:3000/genres`
- Reviews: `http://localhost:3000/reviews`

### 4. Start the React Frontend Application
In a separate terminal window, launch the Vite development server:
```bash
npm run dev
# or
pnpm dev
```
*Application will launch at:* `http://localhost:5173`

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/movies` | Retrieve all movies (supports query filters) |
| `GET` | `/movies/:id` | Retrieve single movie by ID |
| `POST` | `/movies` | Create a new movie |
| `PUT` | `/movies/:id` | Update an existing movie |
| `DELETE` | `/movies/:id` | Delete a movie and cascade-delete its reviews |
| `GET` | `/genres` | Retrieve all genres |
| `POST` | `/genres` | Create a new genre |
| `PUT` | `/genres/:id` | Update an existing genre |
| `DELETE` | `/genres/:id` | Delete a genre |
| `GET` | `/reviews` | Retrieve all reviews |
| `GET` | `/reviews?movieId=:id` | Retrieve reviews for a specific film |
| `POST` | `/reviews` | Submit a new movie review and star rating |
| `DELETE` | `/reviews/:id` | Remove a review |

---

## 👥 Authors & Academic Submission
Developed as an advanced College Capstone project adhering to clean code standards, modern React patterns, and RESTful architectural principles.
