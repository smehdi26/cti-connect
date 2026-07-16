import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Plus, Search, Clock, User } from "lucide-react";

export const Route = createFileRoute("/dashboard/tickets")({
  head: () => ({ meta: [{ title: "Tickets de support — CTI-Network" }] }),
  component: TicketsPage,
});

const tickets = [
  { id: "#4832", subject: "Coupure ligne DECT — Bureau 3ème étage", client: "Société Générale Tunisie", priority: "Urgent", status: "Ouvert", assignee: "Karim H.", age: "il y a 25 min" },
  { id: "#4831", subject: "Configuration IVR pour service client", client: "Ooredoo Tunisie", priority: "Élevée", status: "En cours", assignee: "Sami B.", age: "il y a 2 h" },
  { id: "#4830", subject: "Caméra IP hors ligne — Site Sfax", client: "Délice Danone", priority: "Élevée", status: "En cours", assignee: "Aya M.", age: "il y a 3 h" },
  { id: "#4829", subject: "Ajout de 12 postes Gigaset", client: "Groupe Poulina", priority: "Normale", status: "Ouvert", assignee: "—", age: "il y a 5 h" },
  { id: "#4828", subject: "Migration standard vers VOIP", client: "Hôtel Laico", priority: "Normale", status: "En attente", assignee: "Karim H.", age: "hier" },
  { id: "#4827", subject: "Fax to mail — erreur de routage", client: "Tunisair", priority: "Faible", status: "Résolu", assignee: "Sami B.", age: "hier" },
  { id: "#4826", subject: "Contrat maintenance annuel", client: "STEG", priority: "Normale", status: "Résolu", assignee: "Aya M.", age: "il y a 2 j" },
];

const priorityColor: Record<string, string> = {
  Urgent: "bg-red-50 text-red-700 ring-red-200",
  Élevée: "bg-orange-50 text-orange-700 ring-orange-200",
  Normale: "bg-blue-50 text-blue-700 ring-blue-200",
  Faible: "bg-slate-100 text-slate-700 ring-slate-200",
};
const statusColor: Record<string, string> = {
  Ouvert: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "En cours": "bg-blue-50 text-blue-700 ring-blue-200",
  "En attente": "bg-amber-50 text-amber-700 ring-amber-200",
  Résolu: "bg-slate-100 text-slate-700 ring-slate-200",
};

const kpis = [
  { label: "Ouverts", value: 17, tone: "text-[color:var(--brand-deep)]" },
  { label: "Urgents", value: 3, tone: "text-red-600" },
  { label: "En cours", value: 8, tone: "text-blue-600" },
  { label: "Résolus (7j)", value: 42, tone: "text-emerald-600" },
];

function TicketsPage() {
  return (
    <>
      <PageHeader
        title="Tickets de support"
        description="Suivi des demandes d'intervention et incidents."
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
            <Plus className="h-4 w-4" />
            Nouveau ticket
          </button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-background p-4">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className={`mt-1 font-display text-2xl font-semibold ${k.tone}`}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm w-full sm:w-80">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Rechercher un ticket…"
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Ticket</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Priorité</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium">Assigné</th>
              <th className="px-5 py-3 font-medium">Créé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((t) => (
              <tr key={t.id} className="transition hover:bg-secondary/30">
                <td className="px-5 py-4">
                  <div className="font-mono text-xs text-muted-foreground">{t.id}</div>
                  <div className="mt-0.5 font-medium text-foreground">{t.subject}</div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{t.client}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityColor[t.priority]}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    {t.assignee}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {t.age}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
