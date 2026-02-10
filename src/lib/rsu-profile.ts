export const RSU_PROFILE = {
  symbol: "CPNG",
  grantId: "RSU15273",
  totalGrantShares: 42_016,
  totalValue: 778_976.64,
  tradeable: { shares: 16_941, value: 314_086.14 },
  pending: { shares: 4_015, value: 74_438.10 },
  unvested: { shares: 21_060, value: 390_452.40 },
  totalVested: 31_331,
  totalSold: 10_375,
  unrealizedLoss: -142_504.95,
  tranches: [
    { vestDate: "2024-02-01", vested: 5221, sold: 5221, remaining: 0, priceAtVest: 13.91 },
    { vestDate: "2024-05-01", vested: 1306, sold: 0, remaining: 1306, priceAtVest: 22.21 },
    { vestDate: "2024-08-01", vested: 1305, sold: 0, remaining: 1305, priceAtVest: 20.62 },
    { vestDate: "2024-11-01", vested: 1306, sold: 0, remaining: 1306, priceAtVest: 25.40 },
    { vestDate: "2025-03-10", vested: 1305, sold: 325, remaining: 980, priceAtVest: 23.51 },
    { vestDate: "2025-05-01", vested: 5222, sold: 1208, remaining: 4014, priceAtVest: 23.47 },
    { vestDate: "2025-08-01", vested: 5222, sold: 1207, remaining: 4015, priceAtVest: 28.74 },
    { vestDate: "2025-11-03", vested: 5222, sold: 1207, remaining: 4015, priceAtVest: 31.97 },
    { vestDate: "2026-02-02", vested: 5222, sold: 1207, remaining: 4015, priceAtVest: 20.16 },
  ],
} as const;

export const EMPLOYEE_PROFILE = {
  joinDate: "2023-04-01",
  status: "foreign_employee" as const,
  flatTaxRate: 0.209,
  capitalGainsTaxExemption: true,
  exemptionExpiry: "2028-04-01",
};

export function getRSUContext(currentPrice?: number): string {
  const price = currentPrice ?? 18.54;
  const holdingShares = RSU_PROFILE.tranches.reduce((sum, t) => sum + t.remaining, 0);
  const underwaterTranches = RSU_PROFILE.tranches
    .filter((t) => t.remaining > 0 && t.priceAtVest > price)
    .map((t) => `${t.vestDate}: ${t.remaining} shares @ $${t.priceAtVest} (loss: $${((t.priceAtVest - price) * t.remaining).toFixed(0)})`)
    .join("\n  ");

  return `## RSU Position Profile
- **Grant:** ${RSU_PROFILE.grantId} — ${RSU_PROFILE.totalGrantShares.toLocaleString()} total shares of ${RSU_PROFILE.symbol}
- **Current Price:** $${price.toFixed(2)}
- **Holding:** ${holdingShares.toLocaleString()} shares (~$${(holdingShares * price).toFixed(0)} value)
- **Unvested:** ${RSU_PROFILE.unvested.shares.toLocaleString()} shares (future vests)
- **Unrealized Loss:** $${RSU_PROFILE.unrealizedLoss.toLocaleString()}
- **Underwater Tranches:**
  ${underwaterTranches}

## Tax Situation
- Foreign worker in South Korea, **20.9% flat tax** on RSU income (vs progressive up to ~45%)
- **Capital gains tax exemption until April 2028** — selling before then incurs zero cap gains tax
- ~2 years left in the capital gains exemption window — key consideration for sell/hold decisions
- Tax-loss harvesting operates differently under flat tax regime

## Key Considerations
- Most tranches vested above current price = most positions underwater
- 21K unvested shares = significant ongoing exposure to CPNG
- Data breach regulatory risk (PIPC investigation) creates headline risk
- Capital gains exemption window creates time pressure for any rebalancing strategy
- Cost basis varies widely ($13.91–$31.97) = different tranches have different sell/hold calculus`;
}
