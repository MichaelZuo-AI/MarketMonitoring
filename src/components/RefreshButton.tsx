"use client";

import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function RefreshButton({ onClick, loading }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors disabled:opacity-50"
    >
      <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      Refresh
    </button>
  );
}
