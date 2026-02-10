import { RSU_PROFILE, EMPLOYEE_PROFILE } from "./rsu-data";

export { RSU_PROFILE, EMPLOYEE_PROFILE };

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
- Foreign worker in South Korea, **${(EMPLOYEE_PROFILE.flatTaxRate * 100).toFixed(1)}% flat tax** on RSU income (vs progressive up to ~45%)
- **Capital gains tax exemption until ${new Date(EMPLOYEE_PROFILE.exemptionExpiry).toLocaleDateString("en-US", { month: "long", year: "numeric" })}** — selling before then incurs zero cap gains tax
- ~2 years left in the capital gains exemption window — key consideration for sell/hold decisions
- Tax-loss harvesting operates differently under flat tax regime

## Key Considerations
- Most tranches vested above current price = most positions underwater
- ${RSU_PROFILE.unvested.shares.toLocaleString()} unvested shares = significant ongoing exposure to ${RSU_PROFILE.symbol}
- Data breach regulatory risk (PIPC investigation) creates headline risk
- Capital gains exemption window creates time pressure for any rebalancing strategy
- Cost basis varies widely ($${RSU_PROFILE.tranches[0]?.priceAtVest}–$${RSU_PROFILE.tranches[RSU_PROFILE.tranches.length - 1]?.priceAtVest}) = different tranches have different sell/hold calculus`;
}
