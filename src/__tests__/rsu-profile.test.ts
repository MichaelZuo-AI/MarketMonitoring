import { describe, it, expect } from "vitest";
import { RSU_PROFILE, EMPLOYEE_PROFILE, getRSUContext } from "@/lib/rsu-profile";

describe("RSU_PROFILE", () => {
  it("has correct total grant shares", () => {
    expect(RSU_PROFILE.totalGrantShares).toBe(42_016);
  });

  it("has correct symbol", () => {
    expect(RSU_PROFILE.symbol).toBe("CPNG");
  });

  it("has 9 tranches", () => {
    expect(RSU_PROFILE.tranches).toHaveLength(9);
  });

  it("tranche remaining shares sum to expected holding", () => {
    const totalRemaining = RSU_PROFILE.tranches.reduce(
      (sum, t) => sum + t.remaining,
      0
    );
    // 20,956 shares held
    expect(totalRemaining).toBe(20_956);
  });

  it("tranche vested shares sum to totalVested", () => {
    const totalVested = RSU_PROFILE.tranches.reduce(
      (sum, t) => sum + t.vested,
      0
    );
    expect(totalVested).toBe(RSU_PROFILE.totalVested);
  });

  it("tranche sold shares sum to totalSold", () => {
    const totalSold = RSU_PROFILE.tranches.reduce(
      (sum, t) => sum + t.sold,
      0
    );
    expect(totalSold).toBe(RSU_PROFILE.totalSold);
  });

  it("every tranche has remaining = vested - sold", () => {
    for (const tranche of RSU_PROFILE.tranches) {
      expect(tranche.remaining).toBe(tranche.vested - tranche.sold);
    }
  });

  it("first tranche is fully sold", () => {
    expect(RSU_PROFILE.tranches[0].remaining).toBe(0);
  });
});

describe("EMPLOYEE_PROFILE", () => {
  it("has 20.9% flat tax rate", () => {
    expect(EMPLOYEE_PROFILE.flatTaxRate).toBe(0.209);
  });

  it("has capital gains exemption until 2028", () => {
    expect(EMPLOYEE_PROFILE.capitalGainsTaxExemption).toBe(true);
    expect(EMPLOYEE_PROFILE.exemptionExpiry).toBe("2028-04-01");
  });
});

describe("getRSUContext", () => {
  it("returns a string containing RSU details", () => {
    const context = getRSUContext(18.54);
    expect(context).toContain("RSU15273");
    expect(context).toContain("CPNG");
    expect(context).toContain("$18.54");
    expect(context).toContain("20,956");
  });

  it("uses default price when none provided", () => {
    const context = getRSUContext();
    expect(context).toContain("$18.54");
  });

  it("identifies underwater tranches at given price", () => {
    const context = getRSUContext(18.54);
    // Most tranches vested above $18.54, so they should be listed as underwater
    expect(context).toContain("2024-05-01"); // $22.21 > $18.54
    expect(context).toContain("2025-11-03"); // $31.97 > $18.54
  });

  it("includes tax situation info", () => {
    const context = getRSUContext();
    expect(context).toContain("20.9% flat tax");
    expect(context).toContain("Capital gains tax exemption");
    expect(context).toContain("April 2028");
  });
});
