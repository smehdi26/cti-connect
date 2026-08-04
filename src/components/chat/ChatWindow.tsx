import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import logo from "@/assets/cti-logo.png";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Résume les tickets urgents en cours",
  "Comment diagnostiquer une perte de signal fibre ?",
  "Rappelle-moi le contenu d'un contrat de maintenance semestriel",
];

export function ChatWindow({
  threadId,
  ownerKey,
  initialMessages,
  className,
  compact = false,
  onActivity,
}: {
  threadId: string;
  ownerKey: string;
  initialMessages: UIMessage[];
  className?: string;
  compact?: boolean;
  onActivity?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { threadId, ownerKey },
    }),
    onError: (err) => {
      const msg = err.message || "";
      if (msg.includes("429")) toast.error("Trop de requêtes — réessayez dans un instant.");
      else if (msg.includes("402")) toast.error("Crédits IA épuisés pour cet espace de travail.");
      else toast.error("L'assistant est momentanément indisponible.");
    },
    onFinish: () => onActivity?.(),
  });

  const focusInput = useCallback(() => {
    containerRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput, threadId, status]);

  const busy = status === "submitted" || status === "streaming";

  const submit = (message: PromptInputMessage) => {
    const text = (message.text ?? "").trim();
    if (!text || busy) return;
    void sendMessage({ text });
    onActivity?.();
  };

  const ask = (text: string) => {
    if (busy) return;
    void sendMessage({ text });
    onActivity?.();
  };

  return (
    <div ref={containerRef} className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className={cn(compact ? "gap-4 p-4" : "gap-6 px-1 py-4")}>
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
              <ConversationEmptyState
                icon={<img src={logo} alt="" className="h-10 w-10" width={40} height={40} />}
                title="Assistant CTI"
                description="Posez une question sur les clients, tickets, équipements ou contrats."
              />
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-[color:var(--brand-accent)] hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("");
            return (
              <Message from={message.role} key={message.id}>
                <MessageContent
                  className={cn(
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent px-0 text-foreground",
                  )}
                >
                  {message.role === "assistant" ? (
                    <MessageResponse>{text}</MessageResponse>
                  ) : (
                    <span className="whitespace-pre-wrap">{text}</span>
                  )}
                </MessageContent>
              </Message>
            );
          })}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent className="bg-transparent px-0">
                <Shimmer>Réflexion…</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <p className="text-xs text-destructive">
              Une erreur est survenue. Réessayez votre question.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className={cn("border-t border-border bg-background", compact ? "p-3" : "px-1 pt-4")}>
        <PromptInput onSubmit={submit}>
          <PromptInputTextarea
            placeholder="Écrivez votre message…"
            disabled={false}
            autoFocus
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={busy} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-[10px] text-muted-foreground">
          L'Assistant CTI peut se tromper — vérifiez les informations critiques.
        </p>
      </div>
    </div>
  );
}
