import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import type { UIMessage } from "ai";
import { MessageSquarePlus, Trash2, MessagesSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { getChatOwnerKey } from "@/lib/chat-owner";
import { rowsToUIMessages } from "@/lib/chat-ui";
import {
  createThread,
  deleteThread,
  getThreadMessages,
  listThreads,
  type ChatThreadRow,
} from "@/lib/chat.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/chatbot/$threadId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Assistant CTI — Conversation | CTI-Network" },
      {
        name: "description",
        content:
          "Conversation avec l'Assistant CTI : support télécom, réseaux, vidéosurveillance et contrats de maintenance.",
      },
      { property: "og:title", content: "Assistant CTI — Conversation" },
      {
        property: "og:description",
        content: "Historique et échanges avec l'assistant IA interne de CTI-Network.",
      },
    ],
  }),
  component: ChatbotThread,
});

function ChatbotThread() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();

  const fetchThreads = useServerFn(listThreads);
  const fetchMessages = useServerFn(getThreadMessages);
  const newThread = useServerFn(createThread);
  const removeThread = useServerFn(deleteThread);

  const [ownerKey, setOwnerKey] = useState("");
  const [threads, setThreads] = useState<ChatThreadRow[]>([]);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    setOwnerKey(getChatOwnerKey());
  }, []);

  const refreshThreads = useCallback(
    async (key: string) => {
      try {
        setThreads(await fetchThreads({ data: { ownerKey: key } }));
      } catch {
        /* liste non critique */
      }
    },
    [fetchThreads],
  );

  useEffect(() => {
    if (!ownerKey) return;
    void refreshThreads(ownerKey);
  }, [ownerKey, refreshThreads]);

  useEffect(() => {
    if (!ownerKey) return;
    let cancelled = false;
    setInitial(null);
    (async () => {
      try {
        const res = await fetchMessages({ data: { ownerKey, threadId } });
        if (cancelled) return;
        if (!res.thread) {
          toast.error("Conversation introuvable.");
          void navigate({ to: "/dashboard/chatbot", replace: true });
          return;
        }
        setInitial(rowsToUIMessages(res.messages));
      } catch {
        if (!cancelled) toast.error("Chargement de la conversation impossible.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ownerKey, threadId, fetchMessages, navigate]);

  const handleNew = async () => {
    if (!ownerKey) return;
    const created = await newThread({ data: { ownerKey } });
    await refreshThreads(ownerKey);
    void navigate({ to: "/dashboard/chatbot/$threadId", params: { threadId: created.id } });
  };

  const handleDelete = async (id: string) => {
    if (!ownerKey) return;
    await removeThread({ data: { ownerKey, threadId: id } });
    const rest = threads.filter((t) => t.id !== id);
    setThreads(rest);
    if (id === threadId) {
      if (rest[0]) {
        void navigate({ to: "/dashboard/chatbot/$threadId", params: { threadId: rest[0].id } });
      } else {
        void navigate({ to: "/dashboard/chatbot", replace: true });
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Assistant CTI"
        description="Assistant IA interne pour le support, la technique et le commercial."
        action={
          <button
            onClick={() => void handleNew()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <MessageSquarePlus className="h-4 w-4" /> Nouvelle conversation
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-border bg-background p-3">
          <div className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <MessagesSquare className="h-3.5 w-3.5" /> Conversations
          </div>
          <ul className="space-y-1">
            {threads.length === 0 && (
              <li className="px-2 py-3 text-xs text-muted-foreground">Aucune conversation.</li>
            )}
            {threads.map((t) => (
              <li
                key={t.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-1 transition",
                  t.id === threadId ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <Link
                  to="/dashboard/chatbot/$threadId"
                  params={{ threadId: t.id }}
                  className="min-w-0 flex-1 truncate px-2 py-2 text-sm text-foreground"
                  title={t.title}
                >
                  {t.title}
                </Link>
                <button
                  onClick={() => void handleDelete(t.id)}
                  title="Supprimer"
                  className="rounded-md p-1.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex h-[calc(100vh-16rem)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-background px-4">
          {initial && ownerKey ? (
            <ChatWindow
              key={threadId}
              threadId={threadId}
              ownerKey={ownerKey}
              initialMessages={initial}
              onActivity={() => void refreshThreads(ownerKey)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
