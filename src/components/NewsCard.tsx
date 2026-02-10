"use client";

import { ExternalLink } from "lucide-react";
import FreshnessBadge from "./FreshnessBadge";
import type { Article } from "@/lib/types";

interface NewsCardProps {
  article: Article;
}

const CATEGORY_COLORS: Record<string, string> = {
  coupang: "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
  market: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  tech: "bg-accent-green/15 text-accent-green border-accent-green/30",
};

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="glass-card-solid p-4 hover:bg-bg-card-hover transition-colors">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium border ${CATEGORY_COLORS[article.category] || ""}`}
        >
          {article.category}
        </span>
        <FreshnessBadge
          freshness={article.freshness}
          ageHours={article.ageHours}
        />
        <span className="text-xs text-text-muted">{article.source}</span>
      </div>

      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-1.5"
      >
        <h3 className="text-sm font-medium leading-snug group-hover:text-accent-blue transition-colors">
          {article.title}
        </h3>
        <ExternalLink
          size={12}
          className="shrink-0 mt-1 text-text-muted group-hover:text-accent-blue"
        />
      </a>

      {article.snippet && (
        <p className="mt-1.5 text-xs text-text-secondary line-clamp-2">
          {article.snippet}
        </p>
      )}
    </div>
  );
}
