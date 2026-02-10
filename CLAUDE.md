# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CPNG RSU Monitor** — A Next.js 15 app for monitoring Coupang (CPNG) stock and news relevant to your RSU position. Fetches live news via RSS, validates freshness, and generates a markdown prompt you can paste into Claude for AI-powered analysis.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run lint       # ESLint
npm test           # Run vitest
npm start          # Start production server
```

## Architecture

**Stack:** Next.js 15 + TypeScript + Tailwind CSS v4

### Workflow
1. **Sourcing Agent** fetches RSS feeds, validates freshness (<48h), deduplicates
2. **Export Panel** generates a markdown prompt with RSU context + stock price + articles
3. **You** paste the prompt into claude.ai or Claude Code for analysis

### Key Files
- `src/lib/types.ts` — TypeScript interfaces (Article, StockQuote, CategoryFilter)
- `src/lib/rsu-profile.ts` — Hardcoded RSU position data + employee tax profile
- `src/lib/feeds.ts` — RSS fetching + freshness validation + deduplication
- `src/lib/stock.ts` — Yahoo Finance CPNG quote (60s cache)
- `src/lib/export.ts` — Generates markdown prompt for Claude
- `src/components/Dashboard.tsx` — Main client orchestrator
- `src/components/ExportPanel.tsx` — Copy/download prompt for Claude

### API Routes
- `GET /api/news?category=` — Fetch + filter articles from RSS feeds
- `GET /api/stock` — CPNG quote (cached 60s via Yahoo Finance)

## Environment

No API keys required. All data sources (RSS feeds, Yahoo Finance) are free and unauthenticated.
