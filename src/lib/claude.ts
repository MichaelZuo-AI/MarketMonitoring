import Anthropic from "@anthropic-ai/sdk";
import { getRSUContext } from "./rsu-profile";
import type { Article, ArticleAnalysis, PortfolioBriefing, ChatMessage } from "./types";

const client = new Anthropic();

const MODEL = "claude-sonnet-4-5-20250929";

const BRAIN_SYSTEM_PROMPT = `You are a financial analyst specializing in RSU (Restricted Stock Unit) portfolio management for a Coupang (CPNG) employee. You provide precise, actionable analysis.

${getRSUContext()}

Always respond with valid JSON matching the requested schema. Be specific about dollar amounts, share counts, and tranche-level analysis when relevant.`;

const CHAT_SYSTEM_PROMPT = `You are a knowledgeable RSU portfolio advisor for a Coupang (CPNG) employee. You have full context of their RSU position and today's news.

${getRSUContext()}

Be conversational but precise. When discussing numbers, always reference specific tranches, dollar amounts, and tax implications. You can discuss:
- Whether to sell specific tranches (reference vest date and cost basis)
- Tax-loss harvesting strategies under the 20.9% flat tax regime
- The capital gains exemption window (expires April 2028)
- Data breach regulatory risk assessment
- Overall portfolio concentration risk with 21K unvested shares
- Comparison of selling now vs. waiting for specific catalysts

Keep responses focused and actionable. Use bullet points for clarity.`;

export async function analyzeArticle(
  article: Pick<Article, "title" | "snippet" | "source" | "category">
): Promise<ArticleAnalysis> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: BRAIN_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this news article for its impact on my CPNG RSU position.

**Title:** ${article.title}
**Source:** ${article.source}
**Category:** ${article.category}
**Snippet:** ${article.snippet}

Respond with JSON:
{
  "summary": "3-sentence summary",
  "sentiment": "bullish" | "bearish" | "neutral",
  "sentimentScore": -1 to 1,
  "rsuRecommendation": "hold" | "consider_selling" | "accumulate",
  "rsuImpact": "specific impact on RSU position, referencing tranches/amounts",
  "confidence": 0 to 1,
  "keyPoints": ["point1", "point2", "point3"]
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]) as ArticleAnalysis;
  } catch {
    return {
      summary: text.slice(0, 500),
      sentiment: "neutral",
      sentimentScore: 0,
      rsuRecommendation: "hold",
      rsuImpact: "Unable to parse structured analysis",
      confidence: 0.3,
      keyPoints: ["Analysis parsing failed — review raw response"],
    };
  }
}

export async function generateBriefing(
  articles: Pick<Article, "title" | "snippet" | "source" | "category">[]
): Promise<PortfolioBriefing> {
  const articleList = articles
    .map(
      (a, i) =>
        `${i + 1}. [${a.category.toUpperCase()}] ${a.title} (${a.source})\n   ${a.snippet.slice(0, 150)}`
    )
    .join("\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: BRAIN_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate a portfolio-level briefing based on today's news for my CPNG RSU position.

**Today's Articles:**
${articleList}

Synthesize all articles into a comprehensive briefing. Respond with JSON:
{
  "overallSentiment": "bullish" | "bearish" | "neutral",
  "sentimentScore": -1 to 1,
  "rsuOutlook": "2-3 sentence overall outlook for my RSU position",
  "recommendations": ["specific actionable recommendation 1", "..."],
  "riskFactors": ["risk 1", "..."],
  "keyDevelopments": ["development 1", "..."]
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]) as PortfolioBriefing;
  } catch {
    return {
      overallSentiment: "neutral",
      sentimentScore: 0,
      rsuOutlook: "Unable to generate structured briefing. " + text.slice(0, 300),
      recommendations: ["Review individual articles for details"],
      riskFactors: ["Briefing generation encountered an error"],
      keyDevelopments: [],
    };
  }
}

export async function* streamChat(
  messages: ChatMessage[],
  newsContext?: string,
  analysisContext?: string
): AsyncGenerator<string> {
  const contextParts: string[] = [];
  if (newsContext) {
    contextParts.push(`## Today's News\n${newsContext}`);
  }
  if (analysisContext) {
    contextParts.push(`## Brain Agent Analysis\n${analysisContext}`);
  }

  const systemPrompt =
    contextParts.length > 0
      ? `${CHAT_SYSTEM_PROMPT}\n\n---\n\n${contextParts.join("\n\n")}`
      : CHAT_SYSTEM_PROMPT;

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}
