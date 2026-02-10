import type { StockQuote } from "./types";

let cachedQuote: StockQuote | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60 seconds

export async function getCPNGQuote(): Promise<StockQuote> {
  const now = Date.now();
  if (cachedQuote && now - cacheTimestamp < CACHE_TTL) {
    return cachedQuote;
  }

  try {
    const yahooFinance = await import("yahoo-finance2");
    const yf = yahooFinance.default;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quote: any = await yf.quote("CPNG");

    cachedQuote = {
      symbol: "CPNG",
      price: Number(quote.regularMarketPrice) || 0,
      change: Number(quote.regularMarketChange) || 0,
      changePercent: Number(quote.regularMarketChangePercent) || 0,
      volume: Number(quote.regularMarketVolume) || 0,
      marketState: String(quote.marketState || "CLOSED"),
      timestamp: now,
    };
    cacheTimestamp = now;

    return cachedQuote;
  } catch (error) {
    console.error("Failed to fetch CPNG quote:", error);
    // Return stale cache or fallback
    if (cachedQuote) return cachedQuote;
    return {
      symbol: "CPNG",
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketState: "UNKNOWN",
      timestamp: now,
    };
  }
}
