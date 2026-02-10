import { getRSUContext } from "./rsu-profile";
import type { Article, StockQuote } from "./types";

export function generateClaudePrompt(
  articles: Article[],
  quote: StockQuote | null
): string {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
    dateStyle: "full",
    timeStyle: "short",
  });

  const priceSection = quote
    ? `## Current Stock Price
- **CPNG:** $${quote.price.toFixed(2)} (${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)}, ${quote.change >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)
- **Volume:** ${(quote.volume / 1_000_000).toFixed(1)}M
- **Market State:** ${quote.marketState}
`
    : "";

  const categoryGroups: Record<string, Article[]> = {};
  for (const article of articles) {
    if (!categoryGroups[article.category]) {
      categoryGroups[article.category] = [];
    }
    categoryGroups[article.category].push(article);
  }

  const articleSections = Object.entries(categoryGroups)
    .map(([category, arts]) => {
      const items = arts
        .map(
          (a, i) =>
            `${i + 1}. **${a.title}**\n   - Source: ${a.source} | ${a.freshness} (${a.ageHours < 1 ? `${Math.round(a.ageHours * 60)}m ago` : `${Math.round(a.ageHours)}h ago`})\n   - ${a.snippet || "(no snippet)"}`
        )
        .join("\n\n");
      return `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${arts.length} articles)\n\n${items}`;
    })
    .join("\n\n---\n\n");

  return `# CPNG RSU Monitor — Daily Briefing
**Generated:** ${now}

${priceSection}
${getRSUContext(quote?.price)}

---

## Today's News (${articles.length} articles)

${articleSections}

---

## 请用中文回复我以下所有内容

基于以上 RSU 持仓和今日新闻：

1. **情绪评估** — 对每条重要新闻，评价其对 CPNG 的影响（看涨/看跌/中性），并解释原因。

2. **RSU 影响分析** — 哪些具体的 tranche 受影响最大？请引用归属日期和成本基础。

3. **可操作建议** — 我应该持有、考虑卖出特定 tranche、还是加仓？请考虑：
   - 资本利得免税窗口（2028年4月到期）
   - 20.9% 外国人固定税率优势
   - 各 tranche 成本基础 vs 当前价格
   - 21K 未归属股份带来的集中度风险

4. **风险评估** — 本周需要重点关注的风险有哪些？

5. **持仓总体展望** — 用2-3句话总结今天我的 CPNG 持仓状况。
`;
}
