# Space Research Explorer

A production-oriented full-stack coding challenge project that lets users explore NASA data through a modern SaaS dashboard powered by React and Node.js/Express.

## Live Demo

- Frontend: https://space-research-kmbhaquhk-yash-raoranes-projects.vercel.app/
- Backend: https://space-research-backend.onrender.com
- Backend health check: https://space-research-backend.onrender.com/health

Note: Backend is hosted on Render free tier, so the first request may be slow after inactivity.

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Recharts, Framer Motion, modern glassmorphism UI
- **Backend**: Node.js, Express, Axios, Express Validator, Redis/Node-Cache, express-rate-limit, axios-retry
- **Testing**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)
- **APIs**: NASA Open APIs (APOD, Mars Rover Photos, NeoWs)

## Project Structure

```text
space-research/
  backend/
    src/
      config/      → Environment and cache configuration
      controllers/ → Route handlers
      middlewares/ → Error, validation, rate limiting
      routes/      → API endpoint definitions
      services/    → NASA API client with resilience features
      validators/  → Input validation schemas
      utils/       → Helper utilities
      app.js       → Express app factory
      server.js    → Server entry point
    tests/         → Jest test suite
    .env.example   → Environment variables template
    package.json
  frontend/
    src/
      api/         → NASA API client wrapper
      components/  → Reusable components (header, loaders, etc.)
      pages/       → Page-level components
      test/        → Vitest test suite
      utils/       → Data transformation helpers
      App.jsx      → Router shell
      main.jsx     → React entry point
      index.css    → Modern SaaS styling with glassmorphism
    dist/          → Production build output
    .env.example   → Environment variables template
    package.json
  README.md        → This file
```

## 🎨 UI/UX Features

- **Modern SaaS Design**: Glassmorphic cards, gradient accents, premium spacing
- **Space Theme**: Deep blues, cyan accents, aurora effects, cosmic gradients
- **Responsive Layout**: Mobile-first design that scales beautifully
- **Smooth Animations**: Framer Motion staggered reveals, hover effects, transitions
- **Navigation Icons**: Emojis for quick visual scanning
- **Hero Banner**: Featured APOD display on dashboard
- **Premium Buttons**: Gradient backgrounds, hover effects, smooth interactions
- **Enhanced Charts**: Styled Recharts with custom tooltips and colors
- **Loading States**: Smooth spinner animations with text
- **Error Handling**: Graceful error displays with retry options
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## Features

- Dashboard overview for APOD and near-Earth object activity
- APOD viewer with image/video support and summary helper
- Mars Rover Gallery with rover + date filters
- Asteroid analytics charts:
  - Number of asteroids per day
  - Asteroid size vs miss distance
- Loading and error states across all pages
- Responsive, dark, space-themed UI
- Backend API proxy with validation and centralized error handling
- Response caching with Redis (if configured) and in-memory fallback
- API rate limiting to protect backend and upstream NASA quota
- Optimized NASA calls with retries, keep-alive, and duplicate-request deduplication

## Backend API Endpoints

Base URL: `http://localhost:5000`

- `GET /health`
- `GET /api/apod`
- `GET /api/mars-photos?rover=curiosity&date=2026-03-29`
- `GET /api/asteroids?start_date=2026-03-25&end_date=2026-03-29`

### Query Validation Rules

- `rover`: one of `curiosity`, `opportunity`, `spirit`, `perseverance`
- `date`: ISO date (`YYYY-MM-DD`)
- `start_date` and `end_date`: ISO date (`YYYY-MM-DD`)

## Local Setup

### 1) Clone and install dependencies

```bash
cd space-research/backend
npm install

cd ../frontend
npm install
```

### 2) Configure environment variables

```bash
# backend/.env
PORT=5000
NASA_API_KEY=YOUR_NASA_API_KEY
NASA_BASE_URL=https://api.nasa.gov
NASA_TIMEOUT_MS=10000
NASA_RETRY_COUNT=2
CACHE_TTL_SECONDS=300
REDIS_URL=
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60

# frontend/.env
VITE_API_BASE_URL=http://localhost:5000
```

You can use `DEMO_KEY` for NASA in local testing, but a personal API key is recommended for rate limits.

## Security For Public Repo

- Never commit real secrets to GitHub. Keep real values only in local `backend/.env` and Render environment variables.
- Commit only template files such as `backend/.env.example` and `frontend/.env.example`.
- If this repository is public, treat any committed key as leaked and rotate it immediately.

Before every push, run:

```bash
git status --short
git diff --cached
```

If you see `backend/.env` or any real key value in staged changes, unstage it before committing.

### 3) Run in development

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## Testing

```bash
cd backend
npm test

cd ../frontend
npm test
```

## Deployment

### Frontend on Vercel

- Framework preset: Vite
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=<your-render-backend-url>`

### Backend on Render

- Service type: Web Service
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `PORT`
  - `NASA_API_KEY`
  - `NASA_BASE_URL`
  - `NASA_TIMEOUT_MS`
  - `NASA_RETRY_COUNT`
  - `CACHE_TTL_SECONDS`
  - `REDIS_URL`
  - `RATE_LIMIT_WINDOW_MS`
  - `RATE_LIMIT_MAX`

## Screenshots

Add screenshots here after running locally:

- `frontend-dashboard.png`
- `frontend-apod.png`
- `frontend-mars-gallery.png`
- `frontend-asteroids.png`

## Notes and Tradeoffs

- The backend intentionally acts as the only NASA API caller to protect keys and centralize API behavior.
- Cache provider is Redis-first when `REDIS_URL` is set, with automatic fallback to Node-Cache.
- Frontend charts are currently single-page loaded and can be further optimized with route-level code splitting.

## Future Improvements

- Infinite scroll/pagination for Mars images
- Persisted favorites/bookmarks (local storage or database)
- Real AI APOD explanation endpoint using OpenAI
- Additional filtering/sorting in asteroid analytics
- Enhanced caching layer (Redis) for distributed deployments
