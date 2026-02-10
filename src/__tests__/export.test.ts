import { describe, it, expect } from "vitest";
import { generateClaudePrompt } from "@/lib/export";
import type { Article, StockQuote } from "@/lib/types";

const mockArticles: Article[] = [
  {
    id: "abc",
    title: "Coupang Data Breach Fine Expected",
    link: "https://example.com/1",
    snippet: "South Korea regulators preparing fine for data breach",
    source: "Reuters",
    pubDate: new Date().toISOString(),
    category: "coupang",
    ageHours: 1,
    freshness: "fresh",
    credibilityTier: 1,
  },
  {
    id: "def",
    title: "KOSPI Rises 2% on Foreign Buying",
    link: "https://example.com/2",
    snippet: "Korean stock market rallied today",
    source: "Korea Herald",
    pubDate: new Date().toISOString(),
    category: "market",
    ageHours: 3,
    freshness: "fresh",
    credibilityTier: 1,
  },
];

const mockQuote: StockQuote = {
  symbol: "CPNG",
  price: 18.54,
  change: 0.82,
  changePercent: 4.63,
  volume: 30559570,
  marketState: "PRE",
  timestamp: Date.now(),
};

describe("generateClaudePrompt", () => {
  it("includes RSU profile context", () => {
    const prompt = generateClaudePrompt(mockArticles, mockQuote);
    expect(prompt).toContain("RSU15273");
    expect(prompt).toContain("CPNG");
    expect(prompt).toContain("20.9% flat tax");
    expect(prompt).toContain("April 2028");
  });

  it("includes stock price", () => {
    const prompt = generateClaudePrompt(mockArticles, mockQuote);
    expect(prompt).toContain("$18.54");
    expect(prompt).toContain("+0.82");
  });

  it("includes all articles grouped by category", () => {
    const prompt = generateClaudePrompt(mockArticles, mockQuote);
    expect(prompt).toContain("Coupang Data Breach Fine Expected");
    expect(prompt).toContain("KOSPI Rises 2%");
    expect(prompt).toContain("Coupang (1 articles)");
    expect(prompt).toContain("Market (1 articles)");
  });

  it("includes Chinese analysis instructions", () => {
    const prompt = generateClaudePrompt(mockArticles, mockQuote);
    expect(prompt).toContain("请用中文回复");
    expect(prompt).toContain("情绪评估");
    expect(prompt).toContain("RSU 影响分析");
    expect(prompt).toContain("可操作建议");
    expect(prompt).toContain("风险评估");
  });

  it("handles null quote gracefully", () => {
    const prompt = generateClaudePrompt(mockArticles, null);
    expect(prompt).toContain("RSU15273");
    expect(prompt).toContain("Coupang Data Breach");
    // Should not crash, just omit price section
    expect(prompt).not.toContain("Current Stock Price");
  });

  it("handles empty articles", () => {
    const prompt = generateClaudePrompt([], mockQuote);
    expect(prompt).toContain("0 articles");
    expect(prompt).toContain("RSU15273");
  });
});
