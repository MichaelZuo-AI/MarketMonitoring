"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import type { PortfolioBriefing } from "@/lib/types";

interface BriefingCardProps {
  briefing: PortfolioBriefing;
}

const SENTIMENT_ICONS = {
  bullish: TrendingUp,
  bearish: TrendingDown,
  neutral: Minus,
};

const SENTIMENT_COLORS = {
  bullish: "text-accent-green border-accent-green/30 bg-accent-green/10",
  bearish: "text-accent-red border-accent-red/30 bg-accent-red/10",
  neutral: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
};

export default function BriefingCard({ briefing }: BriefingCardProps) {
  const Icon = SENTIMENT_ICONS[briefing.overallSentiment];
  const colorClass = SENTIMENT_COLORS[briefing.overallSentiment];

  return (
    <div className={`glass-card-solid p-5 border ${colorClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={20} />
        <h3 className="text-base font-semibold">Portfolio Briefing</h3>
        <span className="text-xs font-bold uppercase">
          {briefing.overallSentiment}
        </span>
      </div>

      <p className="text-sm text-text-primary mb-4">{briefing.rsuOutlook}</p>

      {briefing.recommendations.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CheckCircle size={14} className="text-accent-green" />
            <span className="text-xs font-semibold text-text-secondary">
              Recommendations
            </span>
          </div>
          <ul className="space-y-1 ml-5">
            {briefing.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-text-secondary list-disc">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {briefing.riskFactors.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle size={14} className="text-accent-red" />
            <span className="text-xs font-semibold text-text-secondary">
              Risk Factors
            </span>
          </div>
          <ul className="space-y-1 ml-5">
            {briefing.riskFactors.map((risk, i) => (
              <li key={i} className="text-xs text-text-secondary list-disc">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {briefing.keyDevelopments.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap size={14} className="text-accent-amber" />
            <span className="text-xs font-semibold text-text-secondary">
              Key Developments
            </span>
          </div>
          <ul className="space-y-1 ml-5">
            {briefing.keyDevelopments.map((dev, i) => (
              <li key={i} className="text-xs text-text-secondary list-disc">
                {dev}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
