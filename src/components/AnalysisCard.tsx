"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Target,
} from "lucide-react";
import type { ArticleAnalysis } from "@/lib/types";

interface AnalysisCardProps {
  title: string;
  analysis: ArticleAnalysis;
}

const SENTIMENT_CONFIG = {
  bullish: { icon: TrendingUp, color: "text-accent-green", bg: "bg-accent-green/10 border-accent-green/20" },
  bearish: { icon: TrendingDown, color: "text-accent-red", bg: "bg-accent-red/10 border-accent-red/20" },
  neutral: { icon: Minus, color: "text-accent-amber", bg: "bg-accent-amber/10 border-accent-amber/20" },
};

const REC_CONFIG = {
  hold: { label: "HOLD", color: "text-accent-amber", bg: "bg-accent-amber/15" },
  consider_selling: { label: "CONSIDER SELLING", color: "text-accent-red", bg: "bg-accent-red/15" },
  accumulate: { label: "ACCUMULATE", color: "text-accent-green", bg: "bg-accent-green/15" },
};

export default function AnalysisCard({ title, analysis }: AnalysisCardProps) {
  const sentimentCfg = SENTIMENT_CONFIG[analysis.sentiment];
  const SentimentIcon = sentimentCfg.icon;
  const recCfg = REC_CONFIG[analysis.rsuRecommendation];

  return (
    <div className={`glass-card-solid p-4 border ${sentimentCfg.bg}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-medium line-clamp-1 flex-1">{title}</h4>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`flex items-center gap-1 text-xs font-semibold ${sentimentCfg.color}`}>
            <SentimentIcon size={14} />
            {analysis.sentiment.toUpperCase()}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${recCfg.color} ${recCfg.bg}`}>
            {recCfg.label}
          </span>
        </div>
      </div>

      <p className="text-xs text-text-secondary mb-3">{analysis.summary}</p>

      <div className="flex items-start gap-1.5 mb-2">
        <Target size={12} className="text-accent-purple mt-0.5 shrink-0" />
        <p className="text-xs text-text-secondary">{analysis.rsuImpact}</p>
      </div>

      {analysis.keyPoints.length > 0 && (
        <div className="flex items-start gap-1.5">
          <ShieldAlert size={12} className="text-accent-amber mt-0.5 shrink-0" />
          <ul className="text-xs text-text-muted space-y-0.5">
            {analysis.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
        <span>Confidence: {Math.round(analysis.confidence * 100)}%</span>
        <span>
          Score: {analysis.sentimentScore > 0 ? "+" : ""}
          {analysis.sentimentScore.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
