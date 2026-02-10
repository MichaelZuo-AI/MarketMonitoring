"use client";

import { useState, useEffect, useCallback } from "react";
import StockTicker from "./StockTicker";
import SourcePanel from "./SourcePanel";
import ExportPanel from "./ExportPanel";
import type { Article, StockQuote, CategoryFilter } from "@/lib/types";

export default function Dashboard() {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [category, setCategory] = useState<CategoryFilter>("all");

  const fetchQuote = useCallback(async () => {
    try {
      const res = await fetch("/api/stock");
      if (res.ok) {
        setQuote(await res.json());
      }
    } catch (error) {
      console.error("Quote fetch error:", error);
    } finally {
      setQuoteLoading(false);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const res = await fetch(`/api/news?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
      }
    } catch (error) {
      console.error("News fetch error:", error);
    } finally {
      setNewsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 60_000);
    return () => clearInterval(interval);
  }, [fetchQuote]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <StockTicker quote={quote} loading={quoteLoading} />
      <SourcePanel
        articles={articles}
        loading={newsLoading}
        category={category}
        onCategoryChange={setCategory}
        onRefresh={fetchNews}
      />
      <ExportPanel articles={articles} quote={quote} />
    </div>
  );
}
