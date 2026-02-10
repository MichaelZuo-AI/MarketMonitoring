# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CPNG RSU Monitor** — A Next.js 15 app for monitoring Coupang (CPNG) stock and news with AI-powered RSU strategy analysis. Uses a 3-agent architecture (Sourcing, Brain, Chat) powered by the Claude API.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run lint       # ESLint
npm start          # Start production server
```

### No test suite exists yet
Would use `vitest` for testing.

## Architecture

**Stack:** Next.js 15 + TypeScript + Tailwind CSS v4 + Claude API (Anthropic SDK)

### 3-Agent System
1. **Sourcing Agent** (`/api/news`) — Fetches RSS feeds, validates freshness (<48h), deduplicates, categorizes (coupang/market/tech)
2. **Brain Agent** (`/api/analyze`, `/api/briefing`) — Analyzes articles against RSU position, gives sentiment + recommendation (hold/sell/accumulate)
3. **Chat Agent** (`/api/chat`) — Interactive streaming chat with full context of RSU position + news + analysis

### Key Files
- `src/lib/types.ts` — All TypeScript interfaces
- `src/lib/rsu-profile.ts` — Hardcoded RSU position data + employee tax profile
- `src/lib/feeds.ts` — RSS fetching + freshness validation
- `src/lib/stock.ts` — Yahoo Finance wrapper (CPNG quote, 60s cache)
- `src/lib/claude.ts` — Anthropic SDK wrapper with 3 prompt profiles
- `src/components/Dashboard.tsx` — Main client orchestrator
- `src/app/api/` — 5 route handlers (news, stock, analyze, briefing, chat)

### API Routes
- `GET /api/news?category=` — Fetch + filter articles
- `GET /api/stock` — CPNG quote (cached 60s)
- `POST /api/analyze` `{title, snippet, source, category}` — Single article analysis
- `POST /api/briefing` `{articles[]}` — Portfolio-level briefing
- `POST /api/chat` `{messages[], newsContext, analysisContext}` — Streaming chat

## Environment

Requires `ANTHROPIC_API_KEY` in `.env.local`.
