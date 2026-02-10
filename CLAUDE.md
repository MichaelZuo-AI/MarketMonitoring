# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

World News Summarizer — a full-stack AI-powered news aggregation app with intelligent summarization and multi-language support (English/Chinese). No database; all data is fetched fresh per request.

## Commands

### Backend (run from `backend/`)
```bash
# Activate virtualenv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start dev server (port 8001)
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### Frontend (run from `frontend/`)
```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (port 5173, proxies /api/* to :8001)
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### No test suite exists yet
Backend would use `pytest`, frontend would use `vitest`.

## Architecture

**Backend:** Python FastAPI (`backend/main.py`) with two services:
- `services/feed_service.py` — Aggregates RSS feeds via `feedparser`, organized by category (Global Markets, Technology, Geopolitics, Crypto, Startups). When language != English, batch-translates all headlines in a single Gemini call to minimize API quota usage.
- `services/gemini_service.py` — Google GenAI wrapper. Primary model: `gemma-3-27b-it`, fallback: `gemini-2.0-flash-lite`. Provides `summarize()` (3-sentence summaries) and `translate_batch()`.

**Frontend:** React 19 + Vite (`frontend/src/App.jsx` is the single main component). Uses Tailwind CSS v4 with glassmorphism dark theme. API client in `frontend/src/api.js` hits three endpoints: `GET /api/news`, `POST /api/summarize`, `GET /api/config`.

**API Endpoints (backend/main.py):**
- `GET /api/news?category=&language=` — Fetch articles from RSS feeds, optionally translated
- `POST /api/summarize` `{text, language}` — AI-generated 3-sentence summary
- `GET /api/config` — Returns current AI model name

**Vite proxy:** `frontend/vite.config.js` proxies `/api/*` to `http://127.0.0.1:8001`.

## Environment

Backend requires `GOOGLE_API_KEY` in `backend/.env` (Google Cloud API key with Generative AI access).
