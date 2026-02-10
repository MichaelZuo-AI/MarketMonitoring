import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FreshnessBadge from "@/components/FreshnessBadge";

describe("FreshnessBadge", () => {
  it("renders 'fresh' badge for articles under 1 hour", () => {
    render(<FreshnessBadge freshness="fresh" ageHours={0.5} />);
    expect(screen.getByText("30m ago")).toBeInTheDocument();
  });

  it("renders hour-based label for articles 1-24h old", () => {
    render(<FreshnessBadge freshness="aging" ageHours={12} />);
    expect(screen.getByText("12h ago")).toBeInTheDocument();
  });

  it("renders day-based label for articles >24h old", () => {
    render(<FreshnessBadge freshness="stale" ageHours={36} />);
    expect(screen.getByText("2d ago")).toBeInTheDocument();
  });
});
