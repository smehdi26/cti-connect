import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { MessageSquare, X, Maximize2 } from "lucide-react";
import type { UIMessage } from "ai";
import { ChatWindow } from "./ChatWindow";
import { getChatOwnerKey } from "@/lib/chat-owner";
import { rowsToUIMessages } from "@/lib/chat-ui";
import { createThread, getThreadMessages } from "@/lib/chat.functions";
import logo from "@/assets/cti-logo.png";

const WIDGET_THREAD_KEY = "cti-chat-widget-thread";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [ownerKey, setOwnerKey] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [initial, setInitial] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThread = useServerFn(getThreadMessages);
  const newThread = useServerFn(createThread);

  useEffect(() => {
    setOwnerKey(getChatOwnerKey());
  }, []);

  useEffect(() => {
    if (!open || !ownerKey || threadId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const stored = localStorage.getItem(WIDGET_THREAD_KEY);
        if (stored) {
          const res = await fetchThread({ data: { ownerKey, threadId: stored } });
          if (res.thread && !cancelled) {
            setInitial(rowsToUIMessages(res.messages));
            setThreadId(res.thread.id);
            return;
          }
        }
        const created = await newThread({ data: { ownerKey, title: "Assistant rapide" } });
        if (cancelled) return;
        localStorage.setItem(WIDGET_THREAD_KEY, created.id);
        setInitial([]);
        setThreadId(created.id);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, ownerKey, threadId, fetchThread, newThread]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Assistant CTI</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[min(600px,80vh)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-[color:var(--brand-soft)]/50 px-4 py-3">
            <img src={logo} alt="" className="h-7 w-7" width={28} height={28} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">Assistant CTI</div>
              <div className="text-[10px] text-muted-foreground">En ligne · propulsé par Lovable AI</div>
            </div>
            {threadId && (
              <Link
                to="/dashboard/chatbot/$threadId"
                params={{ threadId }}
                onClick={() => setOpen(false)}
                title="Ouvrir en plein écran"
                className="rounded-md p-1.5 text-muted-foreground transition hover:text-foreground"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => setOpen(false)}
              title="Fermer"
              className="rounded-md p-1.5 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {threadId && ownerKey ? (
            <ChatWindow
              key={threadId}
              threadId={threadId}
              ownerKey={ownerKey}
              initialMessages={initial}
              compact
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              {loading ? "Chargement de la conversation…" : "Préparation…"}
            </div>
          )}
        </div>
      )}
    </>
  );
}
