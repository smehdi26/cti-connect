import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { CheckCircle2, AlertTriangle, Info, CheckCheck, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { initialNotifications, type Notification } from "@/lib/notifications-data";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — CTI-Network" },
      { name: "description", content: "Toutes les alertes, interventions et mises à jour de vos tickets, contrats et équipements." },
      { property: "og:title", content: "Notifications — CTI-Network" },
      { property: "og:description", content: "Centre de notifications de l'espace client CTI-Network." },
    ],
  }),
  component: NotificationsPage,
});

const filters = ["Toutes", "Non lues", "Tickets", "Interventions", "Contrats", "Équipements"] as const;
type Filter = (typeof filters)[number];

const icon = {
  ok: <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />,
  warn: <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />,
  info: <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />,
};

function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<Filter>("Toutes");

  const unread = items.filter((n) => !n.read).length;
  const list = items.filter((n) =>
    filter === "Toutes" ? true : filter === "Non lues" ? !n.read : n.category === filter,
  );

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`${items.length} notifications · ${unread} non lues`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setItems((p) => p.map((n) => ({ ...n, read: true })));
                toast.success("Toutes les notifications sont marquées comme lues");
              }}
            >
              <CheckCheck className="h-4 w-4" /> Tout marquer comme lu
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItems([]);
                toast.success("Notifications effacées");
              }}
            >
              <Trash2 className="h-4 w-4" /> Effacer
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
            {f === "Non lues" && unread > 0 && (
              <span className="ml-1.5 text-xs opacity-80">({unread})</span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-background">
        {list.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Aucune notification à afficher.</p>
          </div>
        )}
        {list.map((n, i) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 px-5 py-4 ${i > 0 ? "border-t border-border" : ""} ${
              n.read ? "" : "bg-[color:var(--brand-soft)]/40"
            }`}
          >
            {icon[n.type]}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{n.title}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {n.category}
                </span>
                {!n.read && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-accent)]" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{n.desc}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">{n.time}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {!n.read && (
                <button
                  onClick={() => setItems((p) => p.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                  className="rounded-md p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  title="Marquer comme lu"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setItems((p) => p.filter((x) => x.id !== n.id))}
                className="rounded-md p-2 text-muted-foreground transition hover:bg-secondary hover:text-destructive"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
