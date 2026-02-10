# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CPNG RSU Monitor** — A Next.js 15 app for monitoring Coupang (CPNG) stock and news relevant to your RSU position. Fetches live news via RSS, validates freshness, and generates briefings that Claude Code analyzes into personal (RSU strategy) and public (shareable) HTML reports.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run lint       # ESLint
npm test           # Run vitest (39 tests, 6 suites)
npm run briefing   # Fetch news + stock, save markdown to briefings/
```

## Daily Workflow

```bash
npm run briefing
# Then in Claude Code:
# "Read the latest briefing and analyze, generate both personal and public versions"
```

This generates two HTML files in `briefings/`:
- `*-personal.html` — RSU tranche analysis, sell/hold recs, tax strategy (private)
- `*-public.html` — Coupang news + stock forecast (shareable with coworkers)

## Architecture

**Stack:** Next.js 15 + TypeScript + Tailwind CSS v4

### Key Files
- `src/lib/types.ts` — TypeScript interfaces (Article, StockQuote, CategoryFilter)
- `src/lib/rsu-data.ts` — **GITIGNORED** — your real RSU financial data
- `src/lib/rsu-data.example.ts` — Template with placeholder values
- `src/lib/rsu-profile.ts` — Imports rsu-data.ts, exports RSU context generator
- `src/lib/feeds.ts` — RSS fetching + freshness validation + deduplication
- `src/lib/stock.ts` — Yahoo Finance CPNG quote (60s cache)
- `src/lib/export.ts` — Generates markdown prompt with Chinese analysis instructions
- `src/components/Dashboard.tsx` — Main client orchestrator
- `src/components/ExportPanel.tsx` — Copy/download prompt buttons
- `scripts/briefing.ts` — CLI script for offline briefing generation

### API Routes
- `GET /api/news?category=` — Fetch + filter articles from RSS feeds
- `GET /api/stock` — CPNG quote (cached 60s via Yahoo Finance)

### Privacy
- `src/lib/rsu-data.ts` — gitignored (personal financial data)
- `briefings/` — gitignored (generated reports contain RSU data)
- `.env.local` — gitignored

## Environment

No API keys required. All data sources (RSS feeds, Yahoo Finance) are free and unauthenticated.

## Setup (fresh clone)

```bash
npm install
cp src/lib/rsu-data.example.ts src/lib/rsu-data.ts
# Edit rsu-data.ts with your actual RSU values
```
