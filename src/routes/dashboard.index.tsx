import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import {
  Building2,
  Ticket,
  Cpu,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  MapPin,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

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

type Event = {
  date: string; // YYYY-MM-DD
  title: string;
  client: string;
  site: string;
  time: string;
  type: "install" | "maintenance" | "audit";
};

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

const MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const MOIS_COURT = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const fmtLong = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-");
  return `${Number(d)} ${MOIS[Number(m) - 1]} ${y}`;
};
const fmtShort = (isoDate: string) => {
  const [, m, d] = isoDate.split("-");
  return `${d} ${MOIS_COURT[Number(m) - 1]}`;
};

const events: Event[] = [
  { date: addDays(0), title: "Audit trimestriel VOIP", client: "Société Générale", site: "Tunis Centre", time: "10:00", type: "audit" },
  { date: addDays(1), title: "Installation bornes WIFI", client: "Hôtel Laico", site: "Hammamet", time: "09:30", type: "install" },
  { date: addDays(3), title: "Maintenance préventive DECT", client: "Groupe Poulina", site: "Ben Arous", time: "14:00", type: "maintenance" },
  { date: addDays(5), title: "Migration standard IP", client: "Ooredoo Tunisie", site: "Les Berges du Lac", time: "08:00", type: "install" },
  { date: addDays(8), title: "Contrôle caméras IP", client: "Délice Danone", site: "Sfax", time: "11:00", type: "maintenance" },
  { date: addDays(12), title: "Audit annuel sécurité", client: "STEG", site: "Tunis", time: "09:00", type: "audit" },
];

const typeStyles: Record<Event["type"], { label: string; cls: string }> = {
  install: { label: "Installation", cls: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30" },
  maintenance: { label: "Maintenance", cls: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30" },
  audit: { label: "Audit", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30" },
};

function DashboardHome() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(today);

  const eventDates = events.map((e) => new Date(e.date));
  const selectedIso = selected ? iso(selected) : "";
  const dayEvents = events.filter((e) => e.date === selectedIso);

  return (
    <>
      <PageHeader
        title="Bonjour, Amine"
        description="Voici un aperçu de vos installations et de l'activité récente."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
                <CalendarDays className="h-4 w-4" />
                Calendrier
                <span className="ml-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium">
                  {events.length}
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px]">
              <DialogHeader>
                <DialogTitle>Calendrier des interventions</DialogTitle>
                <DialogDescription>
                  Planning des installations, maintenances et audits programmés.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                <div className="rounded-xl border border-border bg-background p-2">
                  <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    modifiers={{ hasEvent: eventDates }}
                    modifiersClassNames={{
                      hasEvent: "relative font-semibold text-[color:var(--brand-accent)] after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[color:var(--brand-accent)]",
                    }}
                    className="pointer-events-auto"
                  />
                </div>
                <div className="min-w-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      {selected
                        ? selected.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                        : "Sélectionnez une date"}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {dayEvents.length} événement{dayEvents.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  {dayEvents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                      Aucune intervention prévue ce jour.
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {dayEvents.map((e, i) => (
                        <li key={i} className="rounded-xl border border-border bg-background p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-medium text-foreground">{e.title}</div>
                              <div className="mt-0.5 text-xs text-muted-foreground">{e.client}</div>
                            </div>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${typeStyles[e.type].cls}`}>
                              {typeStyles[e.type].label}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</span>
                            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{e.site}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 border-t border-border pt-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      À venir
                    </div>
                    <ul className="space-y-1.5">
                      {events.slice(0, 4).map((e, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          <span className="w-16 shrink-0 text-muted-foreground">
                            {fmtShort(e.date)}
                          </span>
                          <span className="truncate text-foreground">{e.title}</span>
                          <span className="ml-auto shrink-0 text-muted-foreground">{e.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
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

      {/* Highlights */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-base font-semibold">Engagements SLA</h2>
          <p className="mt-1 text-xs text-muted-foreground">Mois en cours</p>
          <div className="mt-4 space-y-4">
            {sla.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium text-foreground">{s.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.value}%`, background: "var(--gradient-brand)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Tickets par priorité</h2>
            <Link to="/dashboard/tickets" className="text-xs font-medium text-[color:var(--brand-accent)] hover:underline">
              Ouvrir
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {priorities.map((p) => (
              <li key={p.label} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${p.dot}`} />
                <span className="flex-1 text-sm text-foreground">{p.label}</span>
                <span className="font-display text-lg font-semibold">{p.count}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full">
            {priorities.map((p) => (
              <div key={p.label} className={p.bar} style={{ flex: p.count }} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Top clients — sites</h2>
            <Link to="/dashboard/carte" className="text-xs font-medium text-[color:var(--brand-accent)] hover:underline">
              Carte
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {topClients.map((c) => (
              <li key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/dashboard/clients/$slug"
                    params={{ slug: slugifyClient(c.name) }}
                    className="truncate font-medium text-foreground hover:underline"
                  >
                    {c.name}
                  </Link>
                  <span className="ml-2 shrink-0 text-muted-foreground">{c.sites}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[color:var(--brand-accent)]"
                    style={{ width: `${(c.sites / maxSites) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition hover:border-[color:var(--brand-accent)] hover:bg-secondary/40"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-[color:var(--brand-deep)]">
              <a.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{a.label}</div>
              <div className="truncate text-xs text-muted-foreground">{a.desc}</div>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
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

        <button
          onClick={() => setOpen(true)}
          className="rounded-2xl p-6 text-left text-white shadow-[var(--shadow-elegant)] transition hover:-translate-y-0.5"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div className="text-xs uppercase tracking-[0.2em] text-white/60">
            Contrat de maintenance
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Prochaine intervention préventive
          </h3>
          <p className="mt-2 text-sm text-white/75">
            Audit trimestriel de votre installation VOIP planifié le {fmtLong(events[0].date)}.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur">
            <CalendarDays className="h-4 w-4" />
            Voir le calendrier
          </span>
        </button>
      </div>
    </>
  );
}
