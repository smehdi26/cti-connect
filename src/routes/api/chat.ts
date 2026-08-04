import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  CHAT_MODEL,
  CTI_SYSTEM_PROMPT,
  createLovableAiGatewayProvider,
} from "@/lib/ai-gateway.server";

type ChatRequestBody = {
  messages?: unknown;
  threadId?: unknown;
  ownerKey?: unknown;
};

function textOf(message: UIMessage): string {
  return (message.parts ?? [])
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const threadId = typeof body.threadId === "string" ? body.threadId : null;
        const ownerKey = typeof body.ownerKey === "string" ? body.ownerKey : null;

        if (!Array.isArray(messages)) {
          return new Response("Messages requis", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("LOVABLE_API_KEY manquant", { status: 500 });

        const uiMessages = messages as UIMessage[];
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Verify the thread belongs to this visitor before touching it.
        let validThreadId: string | null = null;
        if (threadId && ownerKey) {
          const { data: thread } = await supabaseAdmin
            .from("chat_threads")
            .select("id, title")
            .eq("id", threadId)
            .eq("owner_key", ownerKey)
            .maybeSingle();
          if (thread) {
            validThreadId = thread.id;
            const last = uiMessages[uiMessages.length - 1];
            if (last?.role === "user") {
              const { error } = await supabaseAdmin.from("chat_messages").insert({
                thread_id: validThreadId,
                role: "user",
                parts: last.parts as never,
                client_message_id: last.id ?? null,
              });
              if (error) console.error("[chat] insert user message failed:", error.message);

              const patch: { updated_at: string; title?: string } = {
                updated_at: new Date().toISOString(),
              };
              if (thread.title === "Nouvelle conversation") {
                const t = textOf(last);
                if (t) patch.title = t.slice(0, 60);
              }
              const { error: upErr } = await supabaseAdmin
                .from("chat_threads")
                .update(patch)
                .eq("id", validThreadId);
              if (upErr) console.error("[chat] thread update failed:", upErr.message);
            }
          }
        }

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway(CHAT_MODEL),
            system: CTI_SYSTEM_PROMPT,
            messages: await convertToModelMessages(uiMessages),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: uiMessages,
            onFinish: async ({ responseMessage }) => {
              if (!validThreadId || !responseMessage) return;
              const { error } = await supabaseAdmin.from("chat_messages").insert({
                thread_id: validThreadId,
                role: "assistant",
                parts: responseMessage.parts as never,
                client_message_id: responseMessage.id ?? null,
              });
              if (error) console.error("[chat] insert assistant message failed:", error.message);
              await supabaseAdmin
                .from("chat_threads")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", validThreadId);
            },
          });
        } catch (error) {
          console.error("[chat] gateway error:", error);
          const message = error instanceof Error ? error.message : "Erreur inconnue";
          const status = message.includes("429") ? 429 : message.includes("402") ? 402 : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
