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

export interface ArticleAnalysis {
  summary: string;
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number; // -1 to 1
  rsuRecommendation: "hold" | "consider_selling" | "accumulate";
  rsuImpact: string;
  confidence: number; // 0 to 1
  keyPoints: string[];
}

export interface PortfolioBriefing {
  overallSentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;
  rsuOutlook: string;
  recommendations: string[];
  riskFactors: string[];
  keyDevelopments: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type CategoryFilter = "all" | "coupang" | "market" | "tech";
