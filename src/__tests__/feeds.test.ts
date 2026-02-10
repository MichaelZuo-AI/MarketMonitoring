import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockParseURL } = vi.hoisted(() => {
  const mockParseURL = vi.fn();
  return { mockParseURL };
});

vi.mock("rss-parser", () => {
  return {
    default: class MockParser {
      constructor() {
        // no-op
      }
      parseURL = mockParseURL;
    },
  };
});

import { fetchAllFeeds } from "@/lib/feeds";

function createMockFeedItem(overrides: Record<string, unknown> = {}) {
  return {
    title: "Test Article Title",
    link: `https://example.com/article-${Math.random().toString(36).slice(2)}`,
    pubDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    contentSnippet: "Test snippet content",
    creator: "Test Author",
    ...overrides,
  };
}

describe("fetchAllFeeds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns articles from feeds", async () => {
    mockParseURL.mockResolvedValue({
      items: [
        createMockFeedItem({ title: "Coupang News 1" }),
        createMockFeedItem({ title: "Coupang News 2" }),
      ],
    });

    const articles = await fetchAllFeeds("all");
    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0]).toHaveProperty("id");
    expect(articles[0]).toHaveProperty("title");
    expect(articles[0]).toHaveProperty("freshness");
    expect(articles[0]).toHaveProperty("ageHours");
  });

  it("generates unique IDs for different articles", async () => {
    mockParseURL.mockResolvedValue({
      items: [
        createMockFeedItem({ title: "Article A", link: "https://example.com/a" }),
        createMockFeedItem({ title: "Article B", link: "https://example.com/b" }),
        createMockFeedItem({ title: "Article C", link: "https://example.com/c" }),
      ],
    });

    const articles = await fetchAllFeeds("all");
    const ids = articles.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("rejects articles older than 48 hours", async () => {
    mockParseURL.mockResolvedValue({
      items: [
        createMockFeedItem({
          title: "Fresh Article",
          pubDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1h ago
        }),
        createMockFeedItem({
          title: "Old Article Should Be Filtered",
          link: "https://example.com/old",
          pubDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 72h ago
        }),
      ],
    });

    const articles = await fetchAllFeeds("all");
    const titles = articles.map((a) => a.title);
    expect(titles).not.toContain("Old Article Should Be Filtered");
  });

  it("marks freshness correctly", async () => {
    mockParseURL.mockResolvedValue({
      items: [
        createMockFeedItem({
          title: "Very Fresh",
          link: "https://example.com/fresh",
          pubDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min
        }),
        createMockFeedItem({
          title: "Somewhat Aging",
          link: "https://example.com/aging",
          pubDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12h
        }),
        createMockFeedItem({
          title: "Getting Stale",
          link: "https://example.com/stale",
          pubDate: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36h
        }),
      ],
    });

    const articles = await fetchAllFeeds("all");
    const freshArticle = articles.find((a) => a.title === "Very Fresh");
    const agingArticle = articles.find((a) => a.title === "Somewhat Aging");
    const staleArticle = articles.find((a) => a.title === "Getting Stale");

    expect(freshArticle?.freshness).toBe("fresh");
    expect(agingArticle?.freshness).toBe("aging");
    expect(staleArticle?.freshness).toBe("stale");
  });

  it("deduplicates articles with similar titles", async () => {
    mockParseURL.mockResolvedValue({
      items: [
        createMockFeedItem({
          title: "Coupang Reports Strong Q4 Earnings Results Today",
          link: "https://example.com/1",
        }),
        createMockFeedItem({
          title: "Coupang Reports Strong Q4 Earnings Results Today - Reuters",
          link: "https://example.com/2",
        }),
      ],
    });

    const articles = await fetchAllFeeds("all");
    const matchingTitles = articles.filter((a) =>
      a.title.startsWith("Coupang Reports Strong")
    );
    expect(matchingTitles.length).toBe(1);
  });

  it("filters by category", async () => {
    mockParseURL.mockResolvedValue({
      items: [createMockFeedItem()],
    });

    await fetchAllFeeds("coupang");
    // Should only call feeds matching the coupang category (2 feeds)
    expect(mockParseURL).toHaveBeenCalledTimes(2);
  });

  it("handles feed fetch errors gracefully", async () => {
    mockParseURL.mockRejectedValue(new Error("Network error"));

    const articles = await fetchAllFeeds("all");
    expect(articles).toEqual([]);
  });

  it("skips items without title or link", async () => {
    mockParseURL.mockResolvedValue({
      items: [
        createMockFeedItem({ title: null, link: "https://example.com/no-title" }),
        createMockFeedItem({ title: "Has Title", link: null }),
        createMockFeedItem({ title: "Valid Article", link: "https://example.com/valid" }),
      ],
    });

    const articles = await fetchAllFeeds("all");
    expect(articles.every((a) => a.title && a.link)).toBe(true);
  });

  it("sorts articles by freshness (newest first)", async () => {
    mockParseURL.mockResolvedValue({
      items: [
        createMockFeedItem({
          title: "Older One",
          link: "https://example.com/older",
          pubDate: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
        }),
        createMockFeedItem({
          title: "Newer One",
          link: "https://example.com/newer",
          pubDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        }),
      ],
    });

    const articles = await fetchAllFeeds("all");
    if (articles.length >= 2) {
      expect(articles[0].ageHours).toBeLessThanOrEqual(articles[1].ageHours);
    }
  });
});
