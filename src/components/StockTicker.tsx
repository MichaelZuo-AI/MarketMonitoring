"use client";

import { TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";
import type { StockQuote } from "@/lib/types";

interface StockTickerProps {
  quote: StockQuote | null;
  loading: boolean;
}

export default function StockTicker({ quote, loading }: StockTickerProps) {
  if (loading || !quote) {
    return (
      <div className="glass-card p-4 flex items-center gap-6">
        <div className="skeleton h-8 w-24" />
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-6 w-24" />
      </div>
    );
  }

  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? "text-accent-green" : "text-accent-red";
  const Arrow = isPositive ? TrendingUp : TrendingDown;
  const marketOpen = quote.marketState === "REGULAR";

  return (
    <div className="glass-card p-4 flex items-center gap-6 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold tracking-tight">CPNG</span>
        <span className="text-3xl font-bold">
          ${quote.price.toFixed(2)}
        </span>
      </div>

      <div className={`flex items-center gap-1.5 ${changeColor}`}>
        <Arrow size={18} />
        <span className="font-semibold">
          {isPositive ? "+" : ""}
          {quote.change.toFixed(2)} ({isPositive ? "+" : ""}
          {quote.changePercent.toFixed(2)}%)
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-text-secondary">
        <BarChart3 size={16} />
        <span className="text-sm">
          Vol: {(quote.volume / 1_000_000).toFixed(1)}M
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-text-secondary ml-auto">
        {marketOpen ? (
          <>
            <span className="w-2 h-2 rounded-full bg-accent-green pulse-dot" />
            <span className="text-sm">Market Open</span>
          </>
        ) : (
          <>
            <Clock size={14} />
            <span className="text-sm">{quote.marketState}</span>
          </>
        )}
      </div>
    </div>
  );
}
