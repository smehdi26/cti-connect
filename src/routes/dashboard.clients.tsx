import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Building2, Plus, Search, MapPin, Phone, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/dashboard/clients")({
  head: () => ({ meta: [{ title: "Clients — CTI-Network" }] }),
  component: ClientsPage,
});

const clients = [
  { name: "Société Générale Tunisie", sector: "Banque", city: "Tunis", contact: "+216 71 123 456", sites: 12, status: "Actif" },
  { name: "Groupe Poulina", sector: "Industrie", city: "Ben Arous", contact: "+216 71 789 012", sites: 24, status: "Actif" },
  { name: "Tunisair", sector: "Aéronautique", city: "Tunis-Carthage", contact: "+216 70 837 000", sites: 8, status: "Actif" },
  { name: "Délice Danone", sector: "Agroalimentaire", city: "Sfax", contact: "+216 74 402 100", sites: 6, status: "Maintenance" },
  { name: "Ooredoo Tunisie", sector: "Télécom", city: "Les Berges du Lac", contact: "+216 31 300 100", sites: 15, status: "Actif" },
  { name: "STEG", sector: "Énergie", city: "Tunis", contact: "+216 71 341 311", sites: 32, status: "Actif" },
  { name: "Carthage Cement", sector: "Industrie", city: "Bizerte", contact: "+216 72 456 789", sites: 4, status: "En attente" },
  { name: "Hôtel Laico", sector: "Hôtellerie", city: "Hammamet", contact: "+216 72 288 000", sites: 3, status: "Actif" },
];

const statusColor: Record<string, string> = {
  Actif: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Maintenance: "bg-amber-50 text-amber-700 ring-amber-200",
  "En attente": "bg-slate-100 text-slate-700 ring-slate-200",
};

function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clients"
        description="Entreprises accompagnées par CTI-Network."
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
            <Plus className="h-4 w-4" />
            Nouveau client
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher une entreprise…"
            className="w-64 bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-background p-1 text-sm">
          {["Tous", "Actifs", "Maintenance", "En attente"].map((t, i) => (
            <button
              key={t}
              className={`rounded-md px-3 py-1 transition ${
                i === 0
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Entreprise</th>
              <th className="px-5 py-3 font-medium">Secteur</th>
              <th className="px-5 py-3 font-medium">Localisation</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium text-right">Sites</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.map((c) => (
              <tr key={c.name} className="transition hover:bg-secondary/30">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{c.sector}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {c.city}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {c.contact}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-medium">{c.sites}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[c.status]}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
