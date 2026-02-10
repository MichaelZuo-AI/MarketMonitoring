"use client";

import type { CategoryFilter as CategoryFilterType } from "@/lib/types";

interface CategoryFilterProps {
  active: CategoryFilterType;
  onChange: (category: CategoryFilterType) => void;
}

const CATEGORIES: { value: CategoryFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "coupang", label: "Coupang" },
  { value: "market", label: "Market" },
  { value: "tech", label: "Tech" },
];

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active === cat.value
              ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
