import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Search, Ticket, Star, Wrench } from "lucide-react";

export const Route = createFileRoute("/dashboard/equipe")({
  head: () => ({
    meta: [
      { title: "Équipe technique — CTI-Network" },
      {
        name: "description",
        content:
          "Annuaire de l'équipe CTI-Network : techniciens télécom, ingénieurs réseau et support, avec spécialités, zone et charge d'intervention.",
      },
      { property: "og:title", content: "Équipe technique — CTI-Network" },
      {
        property: "og:description",
        content: "Découvrez les techniciens et ingénieurs qui assurent vos installations et maintenances.",
      },
    ],
  }),
  component: EquipePage,
});

type Member = {
  name: string;
  role: string;
  pole: "Télécom" | "Réseau & VDI" | "Sécurité" | "Support";
  email: string;
  phone: string;
  zone: string;
  tickets: number;
  interventions: number;
  rating: number;
  skills: string[];
  status: "Disponible" | "En intervention" | "Congé";
};

const TEAM: Member[] = [
  {
    name: "Amine Ben Salah",
    role: "Responsable technique",
    pole: "Télécom",
    email: "amine@cti-network.tn",
    phone: "+216 71 000 001",
    zone: "Grand Tunis",
    tickets: 6,
    interventions: 48,
    rating: 4.9,
    skills: ["IP-PBX Alcatel", "Unify OpenScape", "DECT"],
    status: "Disponible",
  },
  {
    name: "Sonia Khemiri",
    role: "Ingénieure réseau",
    pole: "Réseau & VDI",
    email: "sonia@cti-network.tn",
    phone: "+216 71 000 002",
    zone: "Grand Tunis",
    tickets: 4,
    interventions: 39,
    rating: 4.8,
    skills: ["Fibre optique", "Switching HPE", "Certification VDI"],
    status: "En intervention",
  },
  {
    name: "Mehdi Trabelsi",
    role: "Technicien télécom senior",
    pole: "Télécom",
    email: "mehdi@cti-network.tn",
    phone: "+216 71 000 003",
    zone: "Sfax / Sud",
    tickets: 7,
    interventions: 61,
    rating: 4.7,
    skills: ["NEC SV9100", "Gigaset", "Fax to Mail"],
    status: "En intervention",
  },
  {
    name: "Nadia Bouzid",
    role: "Ingénieure sécurité",
    pole: "Sécurité",
    email: "nadia@cti-network.tn",
    phone: "+216 71 000 004",
    zone: "Nord",
    tickets: 3,
    interventions: 27,
    rating: 4.9,
    skills: ["Vidéosurveillance Matrix", "Contrôle d'accès COSEC", "Alarme"],
    status: "Disponible",
  },
  {
    name: "Karim Jaziri",
    role: "Technicien VDI",
    pole: "Réseau & VDI",
    email: "karim@cti-network.tn",
    phone: "+216 71 000 005",
    zone: "Sahel",
    tickets: 5,
    interventions: 44,
    rating: 4.6,
    skills: ["Câblage cuivre", "Baies 42U", "Tests certifiés"],
    status: "Disponible",
  },
  {
    name: "Rania Hamdi",
    role: "Coordinatrice support",
    pole: "Support",
    email: "rania@cti-network.tn",
    phone: "+216 71 000 006",
    zone: "Siège — Tunis",
    tickets: 12,
    interventions: 0,
    rating: 4.8,
    skills: ["Hotline", "Planification", "Suivi contrats"],
    status: "Disponible",
  },
  {
    name: "Youssef Gharbi",
    role: "Technicien terrain",
    pole: "Télécom",
    email: "youssef@cti-network.tn",
    phone: "+216 71 000 007",
    zone: "Ben Arous / Sud Tunis",
    tickets: 2,
    interventions: 33,
    rating: 4.5,
    skills: ["Postes IP", "Passerelles GSM", "Maintenance préventive"],
    status: "Congé",
  },
];

const poles = ["Tous", "Télécom", "Réseau & VDI", "Sécurité", "Support"] as const;

const statusColor: Record<Member["status"], string> = {
  Disponible:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  "En intervention":
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30",
  Congé:
    "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30",
};

function EquipePage() {
  const [pole, setPole] = useState<(typeof poles)[number]>("Tous");
  const [q, setQ] = useState("");

  const members = useMemo(() => {
    const s = q.trim().toLowerCase();
    return TEAM.filter(
      (m) =>
        (pole === "Tous" || m.pole === pole) &&
        (!s ||
          m.name.toLowerCase().includes(s) ||
          m.role.toLowerCase().includes(s) ||
          m.zone.toLowerCase().includes(s) ||
          m.skills.some((k) => k.toLowerCase().includes(s))),
    );
  }, [pole, q]);

  return (
    <>
      <PageHeader
        title="Équipe"
        description="Techniciens et ingénieurs CTI-Network, par pôle et zone d'intervention."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Membres" value={String(TEAM.length)} />
        <Stat
          label="Disponibles aujourd'hui"
          value={String(TEAM.filter((m) => m.status === "Disponible").length)}
        />
        <Stat
          label="Interventions cumulées"
          value={String(TEAM.reduce((s, m) => s + m.interventions, 0))}
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un membre, une compétence, une zone…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {poles.map((p) => (
            <Button key={p} size="sm" variant={pole === p ? "default" : "outline"} onClick={() => setPole(p)}>
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => (
          <article
            key={m.email}
            className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-base font-semibold text-foreground">{m.name}</h2>
                <p className="truncate text-sm text-muted-foreground">{m.role}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${statusColor[m.status]}`}
              >
                {m.status}
              </span>
            </div>

            <dl className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" /> {m.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" /> {m.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {m.zone} · pôle {m.pole}
              </div>
            </dl>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {m.skills.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground ring-1 ring-inset ring-border"
                >
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <Mini icon={Ticket} value={String(m.tickets)} label="tickets" />
              <Mini icon={Wrench} value={String(m.interventions)} label="interv." />
              <Mini icon={Star} value={m.rating.toFixed(1)} label="note" />
            </div>
          </article>
        ))}
      </div>

      {members.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">Aucun membre ne correspond à la recherche.</p>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]">
      <div className="font-display text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Mini({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div>
      <Icon className="mx-auto h-3.5 w-3.5 text-[color:var(--brand-accent)]" />
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
