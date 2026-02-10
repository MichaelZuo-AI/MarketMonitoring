"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import type {
  ChatMessage as ChatMessageType,
  Article,
  ArticleAnalysis,
  PortfolioBriefing,
} from "@/lib/types";

interface ChatPanelProps {
  articles: Article[];
  analyses: Map<string, ArticleAnalysis>;
  briefing: PortfolioBriefing | null;
}

function buildNewsContext(articles: Article[]): string {
  if (articles.length === 0) return "";
  return articles
    .slice(0, 10)
    .map((a) => `- [${a.category}] ${a.title} (${a.source}, ${a.ageHours}h ago)`)
    .join("\n");
}

function buildAnalysisContext(
  analyses: Map<string, ArticleAnalysis>,
  briefing: PortfolioBriefing | null,
  articles: Article[]
): string {
  const parts: string[] = [];
  if (briefing) {
    parts.push(
      `Overall: ${briefing.overallSentiment} | ${briefing.rsuOutlook}`
    );
  }
  for (const [id, analysis] of analyses) {
    const article = articles.find((a) => a.id === id);
    parts.push(
      `${article?.title || "Article"}: ${analysis.sentiment}, rec=${analysis.rsuRecommendation} — ${analysis.summary}`
    );
  }
  return parts.join("\n");
}

export default function ChatPanel({ articles, analyses, briefing }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessageType = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    const assistantMsg: ChatMessageType = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          newsContext: buildNewsContext(articles),
          analysisContext: buildAnalysisContext(analyses, briefing, articles),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <section className="glass-card p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={18} className="text-accent-green" />
        <h2 className="text-lg font-semibold">Chat Agent</h2>
        <span className="text-xs text-text-muted">
          Ask about your RSU strategy
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-[200px] max-h-[400px] overflow-y-auto space-y-3 mb-4 pr-1"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm space-y-2">
            <p>Ask questions about your RSU position, tax strategy, or today&apos;s news impact.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {[
                "Should I sell my underwater tranches?",
                "What's the data breach worst case?",
                "Tax harvesting strategy?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-bg-card hover:bg-bg-card-hover text-text-secondary border border-border transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask about your RSU strategy..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-bg-secondary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/50"
          disabled={streaming}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || streaming}
          className="px-4 py-2.5 rounded-xl bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 transition-colors disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </section>
  );
}
