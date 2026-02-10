"use client";

import { User, Bot } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser ? "bg-accent-blue/20" : "bg-accent-purple/20"
        }`}
      >
        {isUser ? (
          <User size={14} className="text-accent-blue" />
        ) : (
          <Bot size={14} className="text-accent-purple" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-accent-blue/15 text-text-primary"
            : "bg-bg-card text-text-primary"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
