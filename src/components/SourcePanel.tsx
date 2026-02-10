"use client";

import { Rss } from "lucide-react";
import NewsCard from "./NewsCard";
import CategoryFilter from "./CategoryFilter";
import RefreshButton from "./RefreshButton";
import type { Article, CategoryFilter as CategoryFilterType } from "@/lib/types";

interface SourcePanelProps {
  articles: Article[];
  loading: boolean;
  category: CategoryFilterType;
  onCategoryChange: (category: CategoryFilterType) => void;
  onRefresh: () => void;
}

export default function SourcePanel({
  articles,
  loading,
  category,
  onCategoryChange,
  onRefresh,
}: SourcePanelProps) {
  return (
    <section className="glass-card p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Rss size={18} className="text-accent-blue" />
          <h2 className="text-lg font-semibold">Sourcing Agent</h2>
          <span className="text-xs text-text-muted">
            {articles.length} articles
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CategoryFilter active={category} onChange={onCategoryChange} />
          <RefreshButton onClick={onRefresh} loading={loading} />
        </div>
      </div>

      {loading && articles.length === 0 ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-text-muted">
          No articles found. Try a different category or refresh.
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
