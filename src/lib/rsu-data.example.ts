// Copy this file to rsu-data.ts and fill in your actual RSU values.
// rsu-data.ts is gitignored and will never be committed.

export const RSU_PROFILE = {
  symbol: "CPNG",
  grantId: "YOUR_GRANT_ID",
  totalGrantShares: 0,
  totalValue: 0,
  tradeable: { shares: 0, value: 0 },
  pending: { shares: 0, value: 0 },
  unvested: { shares: 0, value: 0 },
  totalVested: 0,
  totalSold: 0,
  unrealizedLoss: 0,
  tranches: [
    // Add your tranches here:
    // { vestDate: "2024-02-01", vested: 1000, sold: 0, remaining: 1000, priceAtVest: 20.00 },
  ],
};

export const EMPLOYEE_PROFILE = {
  joinDate: "2023-01-01",
  status: "foreign_employee" as const,
  flatTaxRate: 0.209,
  capitalGainsTaxExemption: true,
  exemptionExpiry: "2028-01-01",
};
