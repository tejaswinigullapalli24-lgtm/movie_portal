/**
 * Movie & Entertainment Management Portal - REST Backend Server
 * 
 * Complies with JSON Server API specifications on port 3000.
 * Supports:
 * - GET, POST, PUT, PATCH, DELETE for /movies, /genres, /reviews
 * - Query filters: ?movieId=..., ?genre=..., ?q=... (full-text search)
 * - Auto-persists updates to db.json
 * - CORS enabled for React Vite frontend (http://localhost:5173, etc.)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');
const PORT = process.env.PORT || 3000;

// Read database from db.json
export function readDatabase() {
  try {
    const rawData = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading db.json:', err.message);
    return { movies: [], genres: [], reviews: [] };
  }
}

// Persist database back to db.json
export function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err.message);
    return false;
  }
}

// Helper to set CORS headers
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Parse JSON request body
export function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (!body.trim()) {
          resolve({});
        } else {
          resolve(JSON.parse(body));
        }
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Generate unique ID
export function generateId() {
  return Date.now().toString();
}

/**
 * Main HTTP Request Handler
 */
export async function handleRequest(req, res) {
  setCorsHeaders(res);

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers?.host || 'localhost:3000'}`);
  const pathname = reqUrl.pathname.replace(/\/+$/, '') || '/';
  const query = Object.fromEntries(reqUrl.searchParams.entries());

  // Root health check route
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'Movie & Entertainment Management Portal API',
      status: 'online',
      port: PORT,
      resources: ['/movies', '/genres', '/reviews']
    }));
    return;
  }

  // Determine resource and potential ID (e.g., /movies, /movies/1)
  const segments = pathname.split('/').filter(Boolean);
  const resource = segments[0]; // 'movies', 'genres', 'reviews'
  const resourceId = segments[1]; // e.g. '1', '2'

  const validResources = ['movies', 'genres', 'reviews'];
  if (!validResources.includes(resource)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Resource '${resource}' not found` }));
    return;
  }

  const db = readDatabase();
  const collection = db[resource] || [];

  try {
    // 1. GET ALL or GET BY QUERY
    if (req.method === 'GET' && !resourceId) {
      let results = [...collection];

      // Exact filters (e.g. ?movieId=1, ?genre=Sci-Fi)
      for (const [key, val] of Object.entries(query)) {
        if (key === 'q') {
          // Full-text search
          const qLower = val.toLowerCase();
          results = results.filter(item => 
            JSON.stringify(item).toLowerCase().includes(qLower)
          );
        } else {
          results = results.filter(item => String(item[key]).toLowerCase() === String(val).toLowerCase());
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
      return;
    }

    // 2. GET BY ID
    if (req.method === 'GET' && resourceId) {
      const item = collection.find(i => String(i.id) === String(resourceId));
      if (!item) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Item with id '${resourceId}' not found in ${resource}` }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(item));
      return;
    }

    // 3. POST (CREATE)
    if (req.method === 'POST') {
      const payload = await parseRequestBody(req);
      const newItem = {
        ...payload,
        id: payload.id ? String(payload.id) : generateId()
      };

      // Add timestamps if not provided
      if (resource === 'reviews' && !newItem.createdAt) {
        newItem.createdAt = new Date().toISOString();
      }

      collection.push(newItem);
      db[resource] = collection;
      writeDatabase(db);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newItem));
      return;
    }

    // 4. PUT / PATCH (UPDATE)
    if ((req.method === 'PUT' || req.method === 'PATCH') && resourceId) {
      const index = collection.findIndex(i => String(i.id) === String(resourceId));
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Item with id '${resourceId}' not found in ${resource}` }));
        return;
      }

      const payload = await parseRequestBody(req);
      const updatedItem = req.method === 'PUT' 
        ? { ...payload, id: String(resourceId) }
        : { ...collection[index], ...payload, id: String(resourceId) };

      collection[index] = updatedItem;
      db[resource] = collection;
      writeDatabase(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedItem));
      return;
    }

    // 5. DELETE
    if (req.method === 'DELETE' && resourceId) {
      const index = collection.findIndex(i => String(i.id) === String(resourceId));
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Item with id '${resourceId}' not found in ${resource}` }));
        return;
      }

      const deletedItem = collection.splice(index, 1)[0];

      // If deleting a movie, cascade-delete associated reviews
      if (resource === 'movies') {
        db.reviews = (db.reviews || []).filter(r => String(r.movieId) !== String(resourceId));
      }

      db[resource] = collection;
      writeDatabase(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(deletedItem));
      return;
    }

    // Method not allowed
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Method ${req.method} not allowed` }));
  } catch (err) {
    console.error('Server error processing request:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
  }
}

// Only launch HTTP listener if run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const server = http.createServer(handleRequest);
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🎬 Movie & Entertainment Management Backend Active!`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📦 Resources available:`);
    console.log(`   - GET/POST           http://localhost:${PORT}/movies`);
    console.log(`   - GET/PUT/DELETE     http://localhost:${PORT}/movies/:id`);
    console.log(`   - GET/POST           http://localhost:${PORT}/genres`);
    console.log(`   - GET/PUT/DELETE     http://localhost:${PORT}/genres/:id`);
    console.log(`   - GET/POST           http://localhost:${PORT}/reviews`);
    console.log(`   - GET                http://localhost:${PORT}/reviews?movieId=:id`);
    console.log(`====================================================`);
  });
}
