"use client";

import type { Article } from "@/lib/types";

interface FreshnessBadgeProps {
  freshness: Article["freshness"];
  ageHours: number;
}

export default function FreshnessBadge({ freshness, ageHours }: FreshnessBadgeProps) {
  const config = {
    fresh: { bg: "bg-accent-green/15", text: "text-accent-green", border: "border-accent-green/30", label: "Fresh" },
    aging: { bg: "bg-accent-amber/15", text: "text-accent-amber", border: "border-accent-amber/30", label: "Aging" },
    stale: { bg: "bg-accent-red/15", text: "text-accent-red", border: "border-accent-red/30", label: "Stale" },
  }[freshness];

  const ageLabel =
    ageHours < 1
      ? `${Math.round(ageHours * 60)}m ago`
      : ageHours < 24
        ? `${Math.round(ageHours)}h ago`
        : `${Math.round(ageHours / 24)}d ago`;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {ageLabel}
    </span>
  );
}
