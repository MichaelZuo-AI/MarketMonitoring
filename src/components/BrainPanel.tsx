"use client";

import { Brain, Sparkles } from "lucide-react";
import AnalysisCard from "./AnalysisCard";
import BriefingCard from "./BriefingCard";
import type { Article, ArticleAnalysis, PortfolioBriefing } from "@/lib/types";

interface BrainPanelProps {
  analyses: Map<string, ArticleAnalysis>;
  briefing: PortfolioBriefing | null;
  articles: Article[];
  onAnalyzeAll: () => void;
  analyzingAll: boolean;
}

export default function BrainPanel({
  analyses,
  briefing,
  articles,
  onAnalyzeAll,
  analyzingAll,
}: BrainPanelProps) {
  const hasAnalyses = analyses.size > 0;

  return (
    <section className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-accent-purple" />
          <h2 className="text-lg font-semibold">Brain Agent</h2>
          {hasAnalyses && (
            <span className="text-xs text-text-muted">
              {analyses.size} analyzed
            </span>
          )}
        </div>
        <button
          onClick={onAnalyzeAll}
          disabled={analyzingAll || articles.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-purple/10 text-accent-purple border border-accent-purple/20 hover:bg-accent-purple/20 transition-colors disabled:opacity-50"
        >
          <Sparkles size={14} className={analyzingAll ? "animate-pulse" : ""} />
          {analyzingAll ? "Analyzing..." : "Analyze All"}
        </button>
      </div>

      {briefing && (
        <div className="mb-4">
          <BriefingCard briefing={briefing} />
        </div>
      )}

      {hasAnalyses ? (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {Array.from(analyses.entries()).map(([articleId, analysis]) => {
            const article = articles.find((a) => a.id === articleId);
            return (
              <AnalysisCard
                key={articleId}
                title={article?.title || "Unknown Article"}
                analysis={analysis}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-text-muted text-sm">
          Click &quot;Analyze&quot; on an article or &quot;Analyze All&quot; to get AI-powered
          RSU insights.
        </div>
      )}
    </section>
  );
}
