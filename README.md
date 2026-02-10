# CPNG RSU Monitor

A personal tool for monitoring Coupang (CPNG) stock price and news, with AI-powered analysis of how current events affect your RSU position.

## How It Works

1. **`npm run briefing`** — Fetches live RSS news (Coupang, Korean market, tech) and CPNG stock quote, saves a markdown briefing to `briefings/`
2. **Claude Code** reads the briefing and generates two HTML reports:
   - **Personal** — RSU tranche analysis, sell/hold recommendations, tax strategy
   - **Public** — Coupang company news and stock price forecasting (safe to share)

No API keys needed. Analysis is done by Claude Code (uses your Claude subscription), not API calls.

## Quick Start

```bash
npm install
cp src/lib/rsu-data.example.ts src/lib/rsu-data.ts  # Fill in your RSU values
npm run briefing                                      # Generate today's briefing
```

Then in Claude Code: *"Read the latest briefing and analyze, generate both personal and public versions"*

## Web UI

```bash
npm run dev   # http://localhost:3000
```

Browse news with category filters, freshness badges, and a copy-to-clipboard prompt exporter.

## Tech Stack

Next.js 15, TypeScript, Tailwind CSS v4, RSS Parser, Yahoo Finance

## News Sources

| Category | Source |
|----------|--------|
| Coupang | Google News RSS (Coupang + CPNG) |
| Coupang (breach) | Google News RSS (data breach + PIPC) |
| Korean Market | Google News RSS (KOSPI) + Korea Herald |
| Korean Tech | Google News RSS (Samsung, SK Hynix) |
| Stock | Yahoo Finance (CPNG, 60s cache) |
