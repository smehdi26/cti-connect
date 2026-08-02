import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Calendar,
  FileSignature,
  Cpu,
  Ticket,
  Network,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/clients/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `Fiche client — ${params.slug} — CTI-Network` }],
  }),
  component: ClientDetailPage,
});

type Profile = {
  name: string;
  id: string;
  sector: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  legalRep: string;
  since: string;
  sites: number;
  headcount: string;
  taxId: string;
  status: "Actif" | "Maintenance" | "En attente";
  services: string[];
  contract: {
    redevance: "Annuelle" | "Semestrielle";
    signedAt: string;
    visits: 4 | 6;
    visitMonths: string[];
  };
  contacts: { name: string; role: string; phone: string; email: string }[];
  equipment: { name: string; count: number; type: string }[];
  tickets: { id: string; title: string; status: string; date: string }[];
};

const DIRECTORY: Record<string, Profile> = {
  "societe-generale-tunisie": {
    name: "Société Générale Tunisie",
    id: "CLI-001",
    sector: "Banque",
    city: "Tunis",
    address: "Avenue Habib Bourguiba, 1001 Tunis",
    phone: "+216 71 123 456",
    email: "contact@sg.tn",
    website: "www.sg.tn",
    legalRep: "M. Karim Ben Ammar",
    since: "2014-03-11",
    sites: 12,
    headcount: "1 200+ employés",
    taxId: "MF 1234567 A/P/M/000",
    status: "Actif",
    services: ["Téléphonie IP", "Câblage VDI", "Fibre optique", "Contrôle d'accès"],
    contract: {
      redevance: "Annuelle",
      signedAt: "2024-02-14",
      visits: 6,
      visitMonths: ["Fév", "Avr", "Juin", "Août", "Oct", "Déc"],
    },
    contacts: [
      { name: "Karim Ben Ammar", role: "Directeur IT", phone: "+216 98 111 222", email: "k.benammar@sg.tn" },
      { name: "Sonia Khemiri", role: "Responsable Réseau", phone: "+216 98 333 444", email: "s.khemiri@sg.tn" },
    ],
    equipment: [
      { name: "IP-PBX Alcatel OXE", count: 2, type: "Téléphonie" },
      { name: "Postes IP 8039s", count: 320, type: "Téléphonie" },
      { name: "Switches HPE Aruba", count: 46, type: "Réseau" },
    ],
    tickets: [
      { id: "#4832", title: "Coupure ligne DECT — 3ème étage", status: "Ouvert", date: "2026-07-15" },
      { id: "#4801", title: "Migration VOIP site Sfax", status: "En cours", date: "2026-07-08" },
      { id: "#4750", title: "Maintenance préventive T2", status: "Résolu", date: "2026-06-20" },
    ],
  },
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fallback(slug: string): Profile {
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    name,
    id: "CLI-000",
    sector: "—",
    city: "Tunis",
    address: "—",
    phone: "+216 —",
    email: "—",
    website: "—",
    legalRep: "—",
    since: "2020-01-01",
    sites: 1,
    headcount: "—",
    taxId: "—",
    status: "Actif",
    services: ["Téléphonie IP"],
    contract: {
      redevance: "Annuelle",
      signedAt: "2024-01-01",
      visits: 4,
      visitMonths: ["Mar", "Juin", "Sep", "Déc"],
    },
    contacts: [
      { name: "Contact principal", role: "Responsable IT", phone: "+216 —", email: "—" },
    ],
    equipment: [{ name: "IP-PBX", count: 1, type: "Téléphonie" }],
    tickets: [],
  };
}

const CITY_COORDS: Record<string, [number, number]> = {
  tunis: [36.8065, 10.1815],
  "ben arous": [36.7533, 10.2189],
  "tunis-carthage": [36.851, 10.2272],
  sfax: [34.7406, 10.7603],
  "les berges du lac": [36.8402, 10.2617],
  bizerte: [37.2744, 9.8739],
  hammamet: [36.4, 10.6167],
  sousse: [35.8256, 10.6084],
};

function cityCoords(city: string): [number, number] {
  return CITY_COORDS[city.trim().toLowerCase()] ?? CITY_COORDS.tunis;
}

function mapSrc(p: Profile) {
  const [lat, lon] = cityCoords(p.city);
  const d = 0.02;
  const bbox = [lon - d, lat - d / 2, lon + d, lat + d / 2].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}


  Actif: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  Maintenance: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  "En attente": "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30",
  Ouvert: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  "En cours": "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30",
  Résolu: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
};

function ClientDetailPage() {
  const { slug } = Route.useParams();
  const p = DIRECTORY[slug] ?? DIRECTORY[slugify(slug)] ?? fallback(slug);

  return (
    <>
      <Link
        to="/dashboard/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux clients
      </Link>

      <PageHeader
        title={p.name}
        description={`${p.sector} · ${p.city} · Client depuis ${new Date(p.since).getFullYear()}`}
        action={
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusColor[p.status]}`}
          >
            {p.status}
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <section className="lg:col-span-2 rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-semibold text-foreground">{p.name}</h2>
              <p className="text-sm text-muted-foreground">ID interne · <span className="font-mono">{p.id}</span></p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Adresse" value={p.address} />
            <InfoRow icon={Phone} label="Téléphone" value={p.phone} />
            <InfoRow icon={Mail} label="Email" value={p.email} />
            <InfoRow icon={Globe} label="Site web" value={p.website} />
            <InfoRow icon={User} label="Représentant légal" value={p.legalRep} />
            <InfoRow icon={ShieldCheck} label="Matricule fiscal" value={p.taxId} />
            <InfoRow icon={Building2} label="Effectif" value={p.headcount} />
            <InfoRow icon={Network} label="Sites gérés" value={String(p.sites)} />
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Services souscrits</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.services.map((s) => (
                <span
                  key={s}
                  className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contract summary */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileSignature className="h-4 w-4 text-[color:var(--brand-accent)]" />
            Contrat de maintenance
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Redevance</dt>
              <dd className="font-medium text-foreground">{p.contract.redevance}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Signé le</dt>
              <dd className="font-medium text-foreground">
                {new Date(p.contract.signedAt).toLocaleDateString("fr-FR")}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Visites / an</dt>
              <dd className="font-medium text-foreground">{p.contract.visits}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Mois programmés</dt>
              <dd className="mt-2 flex flex-wrap gap-1">
                {p.contract.visitMonths.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    <Calendar className="h-3 w-3" />
                    {m}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        {/* Contacts */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] lg:col-span-1">
          <div className="mb-4 text-sm font-semibold text-foreground">Interlocuteurs</div>
          <ul className="space-y-4">
            {p.contacts.map((c) => (
              <li key={c.email} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                  {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                  <div className="mt-1 text-xs text-muted-foreground truncate">{c.phone} · {c.email}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Localisation */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-[color:var(--brand-accent)]" />
            Localisation
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title={`Carte — ${p.name}`}
              src={mapSrc(p)}
              loading="lazy"
              className="h-[280px] w-full border-0"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{p.address !== "—" ? p.address : p.city}</span>
            <a
              href={`https://www.openstreetmap.org/?mlat=${cityCoords(p.city)[0]}&mlon=${cityCoords(p.city)[1]}#map=15/${cityCoords(p.city)[0]}/${cityCoords(p.city)[1]}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 font-medium text-[color:var(--brand-accent)] hover:underline"
            >
              Ouvrir la carte
            </a>
          </div>
        </section>


        {/* Equipment */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Cpu className="h-4 w-4 text-[color:var(--brand-accent)]" />
            Parc d'équipements
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Équipement</th>
                  <th className="px-4 py-2 font-medium">Catégorie</th>
                  <th className="px-4 py-2 font-medium text-right">Quantité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {p.equipment.map((e) => (
                  <tr key={e.name}>
                    <td className="px-4 py-2.5 font-medium text-foreground">{e.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{e.type}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tickets */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] lg:col-span-3">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Ticket className="h-4 w-4 text-[color:var(--brand-accent)]" />
            Historique des tickets
          </div>
          {p.tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun ticket enregistré pour ce client.</p>
          ) : (
            <ul className="divide-y divide-border">
              {p.tickets.map((t) => (
                <li key={t.id} className="flex items-center gap-4 py-3">
                  <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                  <span className="flex-1 text-sm font-medium text-foreground">{t.title}</span>
                  <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString("fr-FR")}</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[t.status] ?? ""}`}
                  >
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
