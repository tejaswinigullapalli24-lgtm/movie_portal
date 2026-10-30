import { EventEmitter } from 'node:events';
import { handleRequest, readDatabase } from './server.js';

// Helper to simulate an HTTP request & capture response
function mockRequest(method, url, body = null) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = { host: 'localhost:3000' };

    const headers = {};
    let statusCode = 200;
    let responseBody = '';

    const res = {
      setHeader: (name, val) => { headers[name.toLowerCase()] = val; },
      writeHead: (code, head = {}) => {
        statusCode = code;
        for (const [k, v] of Object.entries(head)) {
          headers[k.toLowerCase()] = v;
        }
      },
      end: (data) => {
        if (data) responseBody += data;
        let json = null;
        try {
          json = JSON.parse(responseBody);
        } catch (_) {}
        resolve({ statusCode, headers, body: responseBody, json });
      }
    };

    // Execute request handler
    handleRequest(req, res).catch(reject);

    // Emit data if payload exists
    if (body) {
      req.emit('data', Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
    }
    req.emit('end');
  });
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🧪 MOVIE & ENTERTAINMENT PORTAL: COMPREHENSIVE TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. GET ALL MOVIES
  const res1 = await mockRequest('GET', '/movies');
  assert(res1.statusCode === 200, `GET /movies returned 200 OK`);
  assert(Array.isArray(res1.json) && res1.json.length >= 10, `GET /movies returned ${res1.json?.length} movies`);

  // 2. GET MOVIE BY ID
  const res2 = await mockRequest('GET', '/movies/1');
  assert(res2.statusCode === 200, `GET /movies/1 returned 200 OK`);
  assert(res2.json?.title === 'Inception', `Movie 1 title is "Inception"`);

  // 3. POST CREATE MOVIE
  const newMovie = {
    title: 'The Prestige',
    director: 'Christopher Nolan',
    genre: 'Drama',
    releaseYear: 2006,
    rating: 8.5,
    duration: '130 min',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    synopsis: 'After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion.',
    cast: ['Hugh Jackman', 'Christian Bale', 'Michael Caine', 'Scarlett Johansson']
  };
  const res3 = await mockRequest('POST', '/movies', newMovie);
  assert(res3.statusCode === 201, `POST /movies created resource with 201 Created`);
  const createdId = res3.json?.id;
  assert(Boolean(createdId), `Created movie assigned ID: ${createdId}`);
  assert(res3.json?.title === 'The Prestige', `Created movie title is verified`);

  // 4. PUT UPDATE MOVIE
  const updatedMovie = { ...res3.json, rating: 8.7, title: 'The Prestige (Special Edition)' };
  const res4 = await mockRequest('PUT', `/movies/${createdId}`, updatedMovie);
  assert(res4.statusCode === 200, `PUT /movies/${createdId} returned 200 OK`);
  assert(res4.json?.rating === 8.7, `Updated rating is 8.7`);
  assert(res4.json?.title === 'The Prestige (Special Edition)', `Updated title matches`);

  // 5. DELETE MOVIE
  const res5 = await mockRequest('DELETE', `/movies/${createdId}`);
  assert(res5.statusCode === 200, `DELETE /movies/${createdId} returned 200 OK`);
  const res5Check = await mockRequest('GET', `/movies/${createdId}`);
  assert(res5Check.statusCode === 404, `GET after DELETE returned 404 Not Found`);

  // 6. GET ALL GENRES
  const res6 = await mockRequest('GET', '/genres');
  assert(res6.statusCode === 200, `GET /genres returned 200 OK`);
  assert(Array.isArray(res6.json) && res6.json.length >= 8, `GET /genres returned ${res6.json?.length} genres`);

  // 7. POST CREATE GENRE
  const newGenre = {
    name: 'Cyberpunk',
    description: 'Subgenre of science fiction in a dystopian futuristic setting.'
  };
  const res7 = await mockRequest('POST', '/genres', newGenre);
  assert(res7.statusCode === 201, `POST /genres returned 201 Created`);
  const genreId = res7.json?.id;
  assert(res7.json?.name === 'Cyberpunk', `Created genre name is Cyberpunk`);

  // 8. PUT UPDATE GENRE
  const updatedGenre = { ...res7.json, name: 'Cyberpunk / Tech-Noir' };
  const res8 = await mockRequest('PUT', `/genres/${genreId}`, updatedGenre);
  assert(res8.statusCode === 200, `PUT /genres/${genreId} returned 200 OK`);
  assert(res8.json?.name === 'Cyberpunk / Tech-Noir', `Updated genre name is verified`);

  // 9. DELETE GENRE
  const res9 = await mockRequest('DELETE', `/genres/${genreId}`);
  assert(res9.statusCode === 200, `DELETE /genres/${genreId} returned 200 OK`);

  // 10. GET REVIEWS BY MOVIE
  const res10 = await mockRequest('GET', '/reviews?movieId=1');
  assert(res10.statusCode === 200, `GET /reviews?movieId=1 returned 200 OK`);
  assert(Array.isArray(res10.json) && res10.json.length >= 2, `Movie 1 has ${res10.json?.length} reviews`);

  // 11. POST CREATE REVIEW
  const newReview = {
    movieId: '1',
    reviewerName: 'Unit Tester',
    rating: 10,
    comment: 'Flawlessly written and executed. Must watch!'
  };
  const res11 = await mockRequest('POST', '/reviews', newReview);
  assert(res11.statusCode === 201, `POST /reviews returned 201 Created`);
  const reviewId = res11.json?.id;
  assert(res11.json?.reviewerName === 'Unit Tester', `Reviewer name matches`);

  // Clean up review
  const res11Del = await mockRequest('DELETE', `/reviews/${reviewId}`);
  assert(res11Del.statusCode === 200, `DELETE /reviews/${reviewId} cleaned up test review`);

  // 12. FILTER & SEARCH
  const res12Filter = await mockRequest('GET', '/movies?genre=Action');
  assert(res12Filter.statusCode === 200, `GET /movies?genre=Action returned 200 OK`);
  assert(res12Filter.json.every(m => m.genre === 'Action'), `All returned movies have genre "Action"`);

  const res12Search = await mockRequest('GET', '/movies?q=dark');
  assert(res12Search.statusCode === 200, `GET /movies?q=dark returned 200 OK`);
  assert(res12Search.json.some(m => m.title.toLowerCase().includes('dark')), `Search found "The Dark Knight"`);

  // 13. PERSISTENCE CHECK IN DB.JSON
  const currentDb = readDatabase();
  assert(currentDb.movies.length >= 10, `Database file db.json currently stores ${currentDb.movies.length} movies`);
  assert(currentDb.genres.length >= 8, `Database file db.json currently stores ${currentDb.genres.length} genres`);
  assert(currentDb.reviews.length >= 8, `Database file db.json currently stores ${currentDb.reviews.length} reviews`);

  console.log('\n======================================================');
  console.log(`🎯 TEST RESULTS: ${passed} / ${total} TESTS PASSED`);
  if (passed === total) {
    console.log('🌟 ALL CRUD, SEARCH, FILTER, AND DATABASE OPERATIONS VERIFIED!');
  }
  console.log('======================================================\n');
}

runAllTests().catch(err => {
  console.error('Fatal error during test suite:', err);
  process.exit(1);
});
