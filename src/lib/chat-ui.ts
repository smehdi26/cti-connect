import type { UIMessage } from "ai";
import type { ChatMessageRow } from "@/lib/chat.functions";

export function rowsToUIMessages(rows: ChatMessageRow[]): UIMessage[] {
  return rows
    .filter((r) => r.role === "user" || r.role === "assistant")
    .map((r) => ({
      id: r.id,
      role: r.role as "user" | "assistant",
      parts: (Array.isArray(r.parts) ? r.parts : []).filter(
        (p) => p && typeof p === "object" && p.type === "text",
      ) as UIMessage["parts"],
    }));
}
