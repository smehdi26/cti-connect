import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Building2, Plus, Search, MapPin, Phone, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/clients/")({
  head: () => ({ meta: [{ title: "Clients — CTI-Network" }] }),
  component: ClientsPage,
});

type Client = {
  name: string;
  sector: string;
  city: string;
  contact: string;
  sites: number;
  status: "Actif" | "Maintenance" | "En attente";
};

const initial: Client[] = [
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
  Actif: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  Maintenance: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  "En attente": "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30",
};

const filters = ["Tous", "Actif", "Maintenance", "En attente"] as const;
type Filter = (typeof filters)[number];

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initial);
  const [filter, setFilter] = useState<Filter>("Tous");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sector: "",
    city: "",
    contact: "",
    sites: "1",
    status: "Actif" as Client["status"],
  });

  const visible = clients.filter((c) => {
    const matchFilter = filter === "Tous" || c.status === filter;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setClients((prev) => [
      { ...form, sites: Number(form.sites) || 1 },
      ...prev,
    ]);
    setForm({ name: "", sector: "", city: "", contact: "", sites: "1", status: "Actif" });
    setOpen(false);
    toast.success("Client ajouté avec succès");
  };

  return (
    <>
      <PageHeader
        title="Clients"
        description="Entreprises accompagnées par CTI-Network."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
                <Plus className="h-4 w-4" />
                Nouveau client
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <form onSubmit={submit}>
                <DialogHeader>
                  <DialogTitle>Nouveau client</DialogTitle>
                  <DialogDescription>Ajoutez une entreprise au registre CTI-Network.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom de l'entreprise</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="sector">Secteur</Label>
                      <Input id="sector" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Banque, Industrie…" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="contact">Téléphone</Label>
                      <Input id="contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+216 …" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sites">Nombre de sites</Label>
                      <Input id="sites" type="number" min="1" value={form.sites} onChange={(e) => setForm({ ...form, sites: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Statut</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Client["status"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit">Ajouter le client</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une entreprise…"
            className="w-64 bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-background p-1 text-sm">
          {filters.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-md px-3 py-1 transition ${
                filter === t
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "Actif" ? "Actifs" : t}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{visible.length} client(s)</span>
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
            {visible.map((c) => (
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
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[c.status]}`}>
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
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Aucun client ne correspond à ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
