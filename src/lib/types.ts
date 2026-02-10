export interface Article {
  id: string;
  title: string;
  link: string;
  snippet: string;
  source: string;
  pubDate: string;
  category: "coupang" | "market" | "tech";
  ageHours: number;
  freshness: "fresh" | "aging" | "stale";
  credibilityTier: 1 | 2 | 3;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketState: string;
  timestamp: number;
}

export type CategoryFilter = "all" | "coupang" | "market" | "tech";
