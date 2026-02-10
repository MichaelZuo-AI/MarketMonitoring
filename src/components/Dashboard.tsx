"use client";

import { useState, useEffect, useCallback } from "react";
import StockTicker from "./StockTicker";
import SourcePanel from "./SourcePanel";
import BrainPanel from "./BrainPanel";
import ChatPanel from "./ChatPanel";
import type {
  Article,
  ArticleAnalysis,
  PortfolioBriefing,
  StockQuote,
  CategoryFilter,
} from "@/lib/types";

export default function Dashboard() {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [analyses, setAnalyses] = useState<Map<string, ArticleAnalysis>>(
    new Map()
  );
  const [briefing, setBriefing] = useState<PortfolioBriefing | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analyzingAll, setAnalyzingAll] = useState(false);

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

  async function handleAnalyze(article: Article) {
    setAnalyzingId(article.id);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          snippet: article.snippet,
          source: article.source,
          category: article.category,
        }),
      });
      if (res.ok) {
        const analysis: ArticleAnalysis = await res.json();
        setAnalyses((prev) => new Map(prev).set(article.id, analysis));
      }
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleAnalyzeAll() {
    setAnalyzingAll(true);
    try {
      // Generate individual analyses for first 5 articles
      const toAnalyze = articles.slice(0, 5);
      await Promise.all(
        toAnalyze.map(async (article) => {
          if (analyses.has(article.id)) return;
          try {
            const res = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: article.title,
                snippet: article.snippet,
                source: article.source,
                category: article.category,
              }),
            });
            if (res.ok) {
              const analysis: ArticleAnalysis = await res.json();
              setAnalyses((prev) => new Map(prev).set(article.id, analysis));
            }
          } catch (error) {
            console.error(`Analysis error for ${article.id}:`, error);
          }
        })
      );

      // Generate portfolio briefing
      const briefingRes = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articles: articles.slice(0, 10).map((a) => ({
            title: a.title,
            snippet: a.snippet,
            source: a.source,
            category: a.category,
          })),
        }),
      });
      if (briefingRes.ok) {
        setBriefing(await briefingRes.json());
      }
    } catch (error) {
      console.error("Analyze all error:", error);
    } finally {
      setAnalyzingAll(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <StockTicker quote={quote} loading={quoteLoading} />
      <SourcePanel
        articles={articles}
        loading={newsLoading}
        category={category}
        onCategoryChange={setCategory}
        onRefresh={fetchNews}
        onAnalyze={handleAnalyze}
        analyzingId={analyzingId}
      />
      <BrainPanel
        analyses={analyses}
        briefing={briefing}
        articles={articles}
        onAnalyzeAll={handleAnalyzeAll}
        analyzingAll={analyzingAll}
      />
      <ChatPanel articles={articles} analyses={analyses} briefing={briefing} />
    </div>
  );
}
