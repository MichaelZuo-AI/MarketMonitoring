"use client";

import { useState } from "react";
import { Copy, Download, Check, Brain } from "lucide-react";
import { generateClaudePrompt } from "@/lib/export";
import type { Article, StockQuote } from "@/lib/types";

interface ExportPanelProps {
  articles: Article[];
  quote: StockQuote | null;
}

export default function ExportPanel({ articles, quote }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);

  const prompt = generateClaudePrompt(articles, quote);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([prompt], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cpng-briefing-${date}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-accent-purple" />
          <h2 className="text-lg font-semibold">Ask Claude</h2>
          <span className="text-xs text-text-muted">
            Copy prompt with your RSU context + today&apos;s news
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={articles.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-purple/10 text-accent-purple border border-accent-purple/20 hover:bg-accent-purple/20 transition-colors disabled:opacity-50"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Prompt"}
          </button>
          <button
            onClick={handleDownload}
            disabled={articles.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors disabled:opacity-50"
          >
            <Download size={14} />
            .md
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border p-4 max-h-[400px] overflow-y-auto">
        <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
          {articles.length > 0
            ? prompt
            : "Waiting for articles to load..."}
        </pre>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Paste this into{" "}
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-purple hover:underline"
        >
          claude.ai
        </a>{" "}
        or use <code className="text-accent-blue">claude</code> CLI to get your RSU analysis.
      </p>
    </section>
  );
}
