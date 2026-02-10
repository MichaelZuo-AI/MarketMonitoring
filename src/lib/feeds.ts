import { createHash } from "crypto";
import Parser from "rss-parser";
import type { Article } from "./types";

const parser = new Parser({
  timeout: 10_000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; RSUMonitor/1.0)",
  },
});

interface FeedSource {
  url: string;
  category: Article["category"];
  credibilityTier: 1 | 2 | 3;
  sourceName: string;
}

const FEEDS: FeedSource[] = [
  {
    url: "https://news.google.com/rss/search?q=Coupang+OR+CPNG&hl=en-US&gl=US&ceid=US:en",
    category: "coupang",
    credibilityTier: 2,
    sourceName: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=Coupang+data+breach+OR+Coupang+PIPC&hl=en-US&gl=US&ceid=US:en",
    category: "coupang",
    credibilityTier: 2,
    sourceName: "Google News",
  },
  {
    url: "https://news.google.com/rss/search?q=KOSPI+OR+%22Korean+stock+market%22&hl=en-US&gl=US&ceid=US:en",
    category: "market",
    credibilityTier: 2,
    sourceName: "Google News",
  },
  {
    url: "https://www.koreaherald.com/rss/kh_Business",
    category: "market",
    credibilityTier: 1,
    sourceName: "Korea Herald",
  },
  {
    url: "https://news.google.com/rss/search?q=%22Korean+tech%22+OR+Samsung+OR+%22SK+Hynix%22&hl=en-US&gl=US&ceid=US:en",
    category: "tech",
    credibilityTier: 2,
    sourceName: "Google News",
  },
];

const MAX_AGE_HOURS = 48;

function computeAgeHours(pubDate: string): number {
  const pub = new Date(pubDate).getTime();
  const now = Date.now();
  if (isNaN(pub)) return Infinity;
  return (now - pub) / (1000 * 60 * 60);
}

function getFreshness(ageHours: number): Article["freshness"] {
  if (ageHours <= 6) return "fresh";
  if (ageHours <= 24) return "aging";
  return "stale";
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Map<string, Article>();
  for (const article of articles) {
    const normalized = normalizeTitle(article.title);
    const words = normalized.split(" ");
    // Use first 6 words as dedup key
    const key = words.slice(0, 6).join(" ");
    if (!seen.has(key)) {
      seen.set(key, article);
    }
  }
  return Array.from(seen.values());
}

async function fetchFeed(source: FeedSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const articles: Article[] = [];

    // Detect stale feed: check if all articles have identical timestamps
    const timestamps = feed.items
      .map((item) => item.pubDate)
      .filter(Boolean);
    const uniqueTimestamps = new Set(timestamps);
    const isStale =
      uniqueTimestamps.size === 1 &&
      timestamps.length > 3 &&
      computeAgeHours(timestamps[0]!) > 24;

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const pubDate = item.pubDate || new Date().toISOString();
      const ageHours = computeAgeHours(pubDate);

      // Reject articles older than 48 hours
      if (ageHours > MAX_AGE_HOURS) continue;

      articles.push({
        id: createHash("sha256").update(item.link).digest("hex").slice(0, 16),
        title: item.title,
        link: item.link,
        snippet: item.contentSnippet?.slice(0, 300) || item.content?.slice(0, 300) || "",
        source: item.creator || source.sourceName,
        pubDate,
        category: source.category,
        ageHours: Math.round(ageHours * 10) / 10,
        freshness: isStale ? "stale" : getFreshness(ageHours),
        credibilityTier: source.credibilityTier,
      });
    }

    return articles;
  } catch (error) {
    console.error(`Failed to fetch feed ${source.url}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(
  category?: string
): Promise<Article[]> {
  const sources =
    category && category !== "all"
      ? FEEDS.filter((f) => f.category === category)
      : FEEDS;

  const results = await Promise.all(sources.map(fetchFeed));
  const allArticles = results.flat();

  const deduplicated = deduplicateArticles(allArticles);

  // Sort by freshness (newest first)
  deduplicated.sort((a, b) => a.ageHours - b.ageHours);

  return deduplicated;
}
