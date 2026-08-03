import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { MapPin, Building2, Search, ExternalLink, Navigation, Layers } from "lucide-react";
import { initialClients, slugifyClient } from "@/lib/clients-data";
import { osmEmbed, osmLink } from "@/lib/geo-data";

export const Route = createFileRoute("/dashboard/carte")({
  head: () => ({
    meta: [
      { title: "Carte des sites — CTI-Network" },
      { name: "description", content: "Cartographie des sites clients CTI-Network en Tunisie : localisation, nombre de sites et accès direct aux fiches." },
      { property: "og:title", content: "Carte des sites — CTI-Network" },
      { property: "og:description", content: "Cartographie des installations clients CTI-Network en Tunisie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartePage,
});

const statusColor: Record<string, string> = {
  Actif: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  Maintenance: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  "En attente": "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30",
};

function CartePage() {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoom, setZoom] = useState(0.02);

  const visible = initialClients.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });

  const active = initialClients[activeIdx];
  const totalSites = initialClients.reduce((s, c) => s + c.sites, 0);
  const cities = new Set(initialClients.map((c) => c.city)).size;

  return (
    <>
      <PageHeader
        title="Carte des sites"
        description="Localisation des installations clients à travers la Tunisie."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(z * 2, 4))}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <Layers className="h-4 w-4" /> Dézoomer
            </button>
            <button
              onClick={() => setZoom(0.02)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95"
            >
              <Navigation className="h-4 w-4" /> Recentrer
            </button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Highlight label="Clients cartographiés" value={String(initialClients.length)} />
        <Highlight label="Sites gérés" value={String(totalSites)} />
        <Highlight label="Villes couvertes" value={String(cities)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
          <iframe
            title={`Carte — ${active.name}`}
            src={osmEmbed(active.city, zoom)}
            loading="lazy"
            className="h-[520px] w-full border-0"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-sm">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <MapPin className="h-4 w-4 text-[color:var(--brand-accent)]" />
              {active.name} — {active.city}
            </span>
            <a
              href={osmLink(active.city)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[color:var(--brand-accent)] hover:underline"
            >
              Ouvrir dans OpenStreetMap <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un site…"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
            />
          </div>

          <ul className="mt-3 max-h-[470px] space-y-1.5 overflow-y-auto pr-1">
            {visible.map((c) => {
              const idx = initialClients.indexOf(c);
              const isActive = idx === activeIdx;
              return (
                <li key={c.name}>
                  <button
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      isActive
                        ? "border-[color:var(--brand-accent)] bg-secondary"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.city} · {c.sites} site(s)
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${statusColor[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    {isActive && (
                      <Link
                        to="/dashboard/clients/$slug"
                        params={{ slug: slugifyClient(c.name) }}
                        className="mt-2 inline-flex text-xs font-medium text-[color:var(--brand-accent)] hover:underline"
                      >
                        Voir la fiche client →
                      </Link>
                    )}
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Aucun site trouvé.
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}

function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]">
      <div className="font-display text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
