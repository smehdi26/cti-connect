import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Building2, Ticket, Cpu, TrendingUp, ArrowUpRight, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Tableau de bord — CTI-Network" }] }),
  component: DashboardHome,
});

const stats = [
  { label: "Clients actifs", value: "128", delta: "+6 ce mois", icon: Building2, to: "/dashboard/clients" as const },
  { label: "Tickets ouverts", value: "17", delta: "3 urgents", icon: Ticket, to: "/dashboard/tickets" as const },
  { label: "Équipements", value: "1 342", delta: "98% opérationnels", icon: Cpu, to: "/dashboard/equipements" as const },
  { label: "Disponibilité", value: "99.8%", delta: "30 derniers jours", icon: TrendingUp, to: "/dashboard" as const },
];

const activity = [
  { type: "ok", text: "Installation VOIP finalisée — SocGen Tunis", time: "il y a 2 h" },
  { type: "warn", text: "Alerte fibre optique — Site Sfax B", time: "il y a 4 h" },
  { type: "ok", text: "Maintenance préventive — Poste Analog. Lot 12", time: "hier" },
  { type: "ok", text: "Ticket #4821 résolu — Configuration DECT", time: "hier" },
];

function DashboardHome() {
  return (
    <>
      <PageHeader
        title="Bonjour, Amine"
        description="Voici un aperçu de vos installations et de l'activité récente."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
            </div>
            <div className="mt-4 font-display text-3xl font-semibold tracking-tight">
              {s.value}
            </div>
            <div className="text-sm text-foreground">{s.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-6">
          <h2 className="font-display text-lg font-semibold">Activité récente</h2>
          <ul className="mt-4 divide-y divide-border">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                {a.type === "ok" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[color:var(--brand-accent)]" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                )}
                <div className="flex-1">
                  <div className="text-sm text-foreground">{a.text}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-2xl p-6 text-white shadow-[var(--shadow-elegant)]"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-white/60">
            Contrat de maintenance
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Prochaine intervention préventive
          </h3>
          <p className="mt-2 text-sm text-white/75">
            Audit trimestriel de votre installation VOIP planifié le 24 juillet 2026.
          </p>
          <button className="mt-6 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15">
            Voir le calendrier
          </button>
        </div>
      </div>
    </>
  );
}
