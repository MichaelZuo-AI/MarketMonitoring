import { describe, it, expect, vi, beforeEach } from "vitest";

const mockQuote = vi.fn();

// Mock yahoo-finance2 with a proper class constructor
vi.mock("yahoo-finance2", () => {
  return {
    default: class MockYahooFinance {
      constructor() {
        // no-op
      }
      quote = mockQuote;
    },
  };
});

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
});

async function getQuoteFn() {
  const mod = await import("@/lib/stock");
  return mod.getCPNGQuote;
}

describe("getCPNGQuote", () => {
  it("returns a valid stock quote on success", async () => {
    mockQuote.mockResolvedValue({
      regularMarketPrice: 18.54,
      regularMarketChange: 0.82,
      regularMarketChangePercent: 4.63,
      regularMarketVolume: 30559570,
      marketState: "PRE",
    });

    const getCPNGQuote = await getQuoteFn();
    const quote = await getCPNGQuote();

    expect(quote.symbol).toBe("CPNG");
    expect(quote.price).toBe(18.54);
    expect(quote.change).toBe(0.82);
    expect(quote.changePercent).toBe(4.63);
    expect(quote.volume).toBe(30559570);
    expect(quote.marketState).toBe("PRE");
    expect(quote.timestamp).toBeGreaterThan(0);
  });

  it("returns fallback when Yahoo Finance errors", async () => {
    mockQuote.mockRejectedValue(new Error("Network error"));

    const getCPNGQuote = await getQuoteFn();
    const quote = await getCPNGQuote();

    expect(quote.symbol).toBe("CPNG");
    expect(quote.price).toBe(0);
    expect(quote.marketState).toBe("UNKNOWN");
  });

  it("handles missing fields gracefully with Number() coercion", async () => {
    mockQuote.mockResolvedValue({
      regularMarketPrice: undefined,
      regularMarketChange: null,
      regularMarketVolume: "not-a-number",
      marketState: undefined,
    });

    const getCPNGQuote = await getQuoteFn();
    const quote = await getCPNGQuote();

    expect(quote.price).toBe(0);
    expect(quote.change).toBe(0);
    expect(quote.volume).toBe(0);
    expect(quote.marketState).toBe("CLOSED");
  });

  it("uses cached value within TTL", async () => {
    mockQuote.mockResolvedValue({
      regularMarketPrice: 18.54,
      regularMarketChange: 0.82,
      regularMarketChangePercent: 4.63,
      regularMarketVolume: 30559570,
      marketState: "REGULAR",
    });

    const getCPNGQuote = await getQuoteFn();
    await getCPNGQuote();
    await getCPNGQuote();

    expect(mockQuote).toHaveBeenCalledTimes(1);
  });
});
