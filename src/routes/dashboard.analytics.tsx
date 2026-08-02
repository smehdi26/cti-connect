import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Ticket, Cpu, Building2, Clock } from "lucide-react";
import { initialClients } from "@/lib/clients-data";
import { initialEquipments } from "@/lib/equipment-data";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — CTI-Network" },
      {
        name: "description",
        content:
          "Indicateurs de performance CTI-Network : volume de tickets, délais de résolution, répartition du parc et interventions par client.",
      },
      { property: "og:title", content: "Analytics — CTI-Network" },
      {
        property: "og:description",
        content: "Tableaux de bord analytiques des interventions, tickets et équipements CTI-Network.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const periods = ["6 mois", "12 mois"] as const;

const monthly = [
  { mois: "Fév", tickets: 42, resolus: 38, interventions: 21 },
  { mois: "Mar", tickets: 51, resolus: 47, interventions: 26 },
  { mois: "Avr", tickets: 38, resolus: 36, interventions: 19 },
  { mois: "Mai", tickets: 60, resolus: 54, interventions: 31 },
  { mois: "Juin", tickets: 47, resolus: 45, interventions: 24 },
  { mois: "Juil", tickets: 55, resolus: 49, interventions: 29 },
];

const monthlyLong = [
  { mois: "Août", tickets: 33, resolus: 31, interventions: 17 },
  { mois: "Sep", tickets: 44, resolus: 41, interventions: 22 },
  { mois: "Oct", tickets: 49, resolus: 46, interventions: 25 },
  { mois: "Nov", tickets: 40, resolus: 39, interventions: 20 },
  { mois: "Déc", tickets: 36, resolus: 35, interventions: 18 },
  { mois: "Jan", tickets: 45, resolus: 42, interventions: 23 },
  ...monthly,
];

const resolutionTime = [
  { mois: "Fév", heures: 8.2 },
  { mois: "Mar", heures: 7.4 },
  { mois: "Avr", heures: 6.9 },
  { mois: "Mai", heures: 7.8 },
  { mois: "Juin", heures: 5.6 },
  { mois: "Juil", heures: 5.1 },
];

const PIE_COLORS = ["#1d4ed8", "#0ea5e9", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444", "#64748b"];

function AnalyticsPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("6 mois");
  const data = period === "6 mois" ? monthly : monthlyLong;

  const parcParType = Object.entries(
    initialEquipments.reduce<Record<string, number>>((acc, e) => {
      acc[e.type] = (acc[e.type] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const sitesParClient = initialClients
    .map((c) => ({ name: c.name.split(" ")[0], sites: c.sites }))
    .sort((a, b) => b.sites - a.sites);

  const totalTickets = data.reduce((s, d) => s + d.tickets, 0);
  const totalResolus = data.reduce((s, d) => s + d.resolus, 0);
  const tauxResolution = Math.round((totalResolus / totalTickets) * 100);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Performance des interventions, tickets et parc installé."
        action={
          <div className="inline-flex rounded-lg border border-border bg-background p-1">
            {periods.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? "default" : "ghost"}
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Ticket} label="Tickets sur la période" value={String(totalTickets)} delta="+8,4 %" up />
        <Kpi icon={Clock} label="Délai moyen de résolution" value="5,1 h" delta="−12 %" up={false} good />
        <Kpi icon={Cpu} label="Équipements suivis" value={String(initialEquipments.length * 18)} delta="+3,1 %" up />
        <Kpi icon={Building2} label="Taux de résolution" value={`${tauxResolution} %`} delta="+2,6 pts" up />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Tickets créés vs résolus" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 60% / 0.2)" vertical={false} />
              <XAxis dataKey="mois" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar name="Créés" dataKey="tickets" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              <Bar name="Résolus" dataKey="resolus" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Répartition du parc par type">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={parcParType} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                {parcParType.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1.5 text-xs">
            {parcParType.map((t, i) => (
              <li key={t.name} className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="flex-1 truncate">{t.name}</span>
                <span className="font-medium text-foreground">{t.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Délai moyen de résolution (heures)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={resolutionTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 60% / 0.2)" vertical={false} />
              <XAxis dataKey="mois" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="heures" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Sites gérés par client">
          <ul className="space-y-3">
            {sitesParClient.map((c) => (
              <li key={c.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="font-medium text-foreground">{c.sites}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[color:var(--brand-accent)]"
                    style={{ width: `${(c.sites / sitesParClient[0].sites) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] ${className}`}
    >
      <div className="mb-4 text-sm font-semibold text-foreground">{title}</div>
      {children}
    </section>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  up,
  good,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  up: boolean;
  good?: boolean;
}) {
  const positive = good ? true : up;
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {delta}
        </span>
      </div>
      <div className="mt-3 font-display text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
