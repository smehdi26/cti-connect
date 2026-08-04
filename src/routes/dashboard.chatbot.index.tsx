import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getChatOwnerKey } from "@/lib/chat-owner";
import { createThread, listThreads } from "@/lib/chat.functions";

export const Route = createFileRoute("/dashboard/chatbot/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Assistant CTI — Chatbot | CTI-Network" },
      {
        name: "description",
        content:
          "Assistant IA interne CTI-Network : posez vos questions sur les clients, tickets, équipements et contrats de maintenance.",
      },
      { property: "og:title", content: "Assistant CTI — Chatbot" },
      {
        property: "og:description",
        content: "Assistant IA interne pour le support télécom, réseaux et sécurité de CTI-Network.",
      },
    ],
  }),
  component: ChatbotIndex,
});

function ChatbotIndex() {
  const navigate = useNavigate();
  const fetchThreads = useServerFn(listThreads);
  const newThread = useServerFn(createThread);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ownerKey = getChatOwnerKey();
        const threads = await fetchThreads({ data: { ownerKey } });
        const target = threads[0] ?? (await newThread({ data: { ownerKey } }));
        if (!cancelled) {
          void navigate({
            to: "/dashboard/chatbot/$threadId",
            params: { threadId: target.id },
            replace: true,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur inconnue");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchThreads, newThread, navigate]);

  return (
    <div className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
      {error ? `Impossible d'ouvrir l'assistant : ${error}` : "Ouverture de l'assistant…"}
    </div>
  );
}
