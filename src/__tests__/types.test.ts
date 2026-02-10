import { describe, it, expect } from "vitest";
import type { Article, StockQuote, CategoryFilter } from "@/lib/types";

describe("Type interfaces", () => {
  it("Article has all required fields", () => {
    const article: Article = {
      id: "abc123",
      title: "Test Article",
      link: "https://example.com",
      snippet: "Test snippet",
      source: "Reuters",
      pubDate: "2026-02-10T12:00:00Z",
      category: "coupang",
      ageHours: 1.5,
      freshness: "fresh",
      credibilityTier: 1,
    };
    expect(article.id).toBe("abc123");
    expect(article.category).toBe("coupang");
    expect(article.freshness).toBe("fresh");
  });

  it("StockQuote has all required fields", () => {
    const quote: StockQuote = {
      symbol: "CPNG",
      price: 18.54,
      change: 0.82,
      changePercent: 4.63,
      volume: 30559570,
      marketState: "REGULAR",
      timestamp: Date.now(),
    };
    expect(quote.symbol).toBe("CPNG");
    expect(quote.price).toBe(18.54);
  });

  it("CategoryFilter accepts valid values", () => {
    const filters: CategoryFilter[] = ["all", "coupang", "market", "tech"];
    expect(filters).toHaveLength(4);
  });
});
