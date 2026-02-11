import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fetchAllFeeds } from "../src/lib/feeds";
import { getCPNGQuote } from "../src/lib/stock";
import { generateClaudePrompt } from "../src/lib/export";

async function main() {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const time = now.toTimeString().slice(0, 5).replace(":", "");

  console.log("Fetching CPNG stock quote...");
  const quote = await getCPNGQuote();
  console.log(
    `  CPNG: $${quote.price.toFixed(2)} (${quote.change >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)`
  );

  console.log("Fetching news feeds...");
  const articles = await fetchAllFeeds();
  console.log(`  Found ${articles.length} articles`);

  const prompt = generateClaudePrompt(articles, quote);

  const dir = join(process.cwd(), "briefings", "personal");
  mkdirSync(dir, { recursive: true });

  const filepath = join(dir, `${date}-${time}.md`);
  writeFileSync(filepath, prompt, "utf-8");

  console.log(`\nBriefing saved to: briefings/personal/${date}-${time}.md`);
  console.log(
    `\nAsk Claude Code: "Read briefings/personal/${date}-${time}.md and analyze my RSU position"`
  );
}

main().catch((err) => {
  console.error("Failed to generate briefing:", err);
  process.exit(1);
});
