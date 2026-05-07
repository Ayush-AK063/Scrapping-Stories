# MERN Scrapping Assignment

Mini full-stack application built for the Full Stack Developer (MERN) assignment.

The app scrapes top stories from Hacker News, stores them in MongoDB, exposes JWT-based backend APIs, and provides a frontend for authentication, stories, and bookmarks.

## Tech Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Auth:** JWT + bcrypt
- **Scraping:** Axios + Cheerio

## Project Structure

```txt
scrapping-assignment/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
      app.js
      server.js
    .env.example
    package.json
  src/
    app/
      bookmarks/
      login/
      register/
    components/
    context/
    lib/
    types/
  .env.example
  package.json
```

## Features Implemented

### 1) Web Scraper

- Scrapes top 10 stories from `https://news.ycombinator.com`
- Stores:
  - `title`
  - `url`
  - `points`
  - `author`
  - `postedAt`
- Saves data in MongoDB
- Runs automatically on backend startup
- Can be triggered manually via:
  - `POST /api/scrape`

### 2) Backend (Node.js + Express)

#### Authentication APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected helper for frontend auth restore)

#### Story APIs

- `GET /api/stories` (sorted by points descending)
- `GET /api/stories/:id`
- `POST /api/stories/:id/bookmark` (protected)
- `GET /api/stories/bookmarks` (protected helper for bookmarks page)

#### Bonus

- Pagination supported:
  - `GET /api/stories?page=1&limit=10`
  - `GET /api/stories/bookmarks?page=1&limit=10`

### 3) Frontend (React)

- Stories list page with:
  - title
  - points
  - author
  - posted time
- Login and Register pages
- Bookmark toggle integrated with backend API
- Protected Bookmarks page
- Authentication state management using React Context API

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use provided examples:

- root: `.env.example`
- backend: `backend/.env.example`

## Local Setup Instructions

### 1) Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
cd ..
```

### 2) Configure environment

- Create `.env.local` in root (frontend env)
- Create `backend/.env` (backend env)

### 3) Run the backend

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`

### 4) Run the frontend

In project root:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

## API Quick Reference

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

### Scraper

- `POST /api/scrape`

### Stories

- `GET /api/stories`
- `GET /api/stories/:id`
- `POST /api/stories/:id/bookmark` (Bearer token)
- `GET /api/stories/bookmarks` (Bearer token)

## Notes

- All secrets and environment-specific values are managed via `.env` files.
- No hardcoded API URL is used in frontend code; `NEXT_PUBLIC_API_URL` is required.
- The backend follows a clean, scalable structure with `routes`, `models`, `controllers`, and `middleware`.
