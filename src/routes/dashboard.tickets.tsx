import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Plus, Search, Clock, User } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/tickets")({
  head: () => ({ meta: [{ title: "Tickets de support — CTI-Network" }] }),
  component: TicketsPage,
});

type Ticket = {
  id: string;
  subject: string;
  client: string;
  priority: "Urgent" | "Élevée" | "Normale" | "Faible";
  status: "Ouvert" | "En cours" | "En attente" | "Résolu";
  assignee: string;
  age: string;
};

const initial: Ticket[] = [
  { id: "#4832", subject: "Coupure ligne DECT — Bureau 3ème étage", client: "Société Générale Tunisie", priority: "Urgent", status: "Ouvert", assignee: "Karim H.", age: "il y a 25 min" },
  { id: "#4831", subject: "Configuration IVR pour service client", client: "Ooredoo Tunisie", priority: "Élevée", status: "En cours", assignee: "Sami B.", age: "il y a 2 h" },
  { id: "#4830", subject: "Caméra IP hors ligne — Site Sfax", client: "Délice Danone", priority: "Élevée", status: "En cours", assignee: "Aya M.", age: "il y a 3 h" },
  { id: "#4829", subject: "Ajout de 12 postes Gigaset", client: "Groupe Poulina", priority: "Normale", status: "Ouvert", assignee: "—", age: "il y a 5 h" },
  { id: "#4828", subject: "Migration standard vers VOIP", client: "Hôtel Laico", priority: "Normale", status: "En attente", assignee: "Karim H.", age: "hier" },
  { id: "#4827", subject: "Fax to mail — erreur de routage", client: "Tunisair", priority: "Faible", status: "Résolu", assignee: "Sami B.", age: "hier" },
  { id: "#4826", subject: "Contrat maintenance annuel", client: "STEG", priority: "Normale", status: "Résolu", assignee: "Aya M.", age: "il y a 2 j" },
];

const priorityColor: Record<string, string> = {
  Urgent: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30",
  Élevée: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30",
  Normale: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30",
  Faible: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30",
};
const statusColor: Record<string, string> = {
  Ouvert: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  "En cours": "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30",
  "En attente": "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  Résolu: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30",
};

const kpis = [
  { label: "Ouverts", value: 17, tone: "text-[color:var(--brand-deep)]" },
  { label: "Urgents", value: 3, tone: "text-red-600 dark:text-red-400" },
  { label: "En cours", value: 8, tone: "text-blue-600 dark:text-blue-400" },
  { label: "Résolus (7j)", value: 42, tone: "text-emerald-600 dark:text-emerald-400" },
];

function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    client: "",
    priority: "Normale" as Ticket["priority"],
    status: "Ouvert" as Ticket["status"],
    assignee: "",
    description: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.client.trim()) return;
    const nextId = `#${4833 + tickets.length - initial.length}`;
    setTickets((prev) => [
      { id: nextId, subject: form.subject, client: form.client, priority: form.priority, status: form.status, assignee: form.assignee || "—", age: "à l'instant" },
      ...prev,
    ]);
    setForm({ subject: "", client: "", priority: "Normale", status: "Ouvert", assignee: "", description: "" });
    setOpen(false);
    toast.success("Ticket créé");
  };

  return (
    <>
      <PageHeader
        title="Tickets de support"
        description="Suivi des demandes d'intervention et incidents."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
                <Plus className="h-4 w-4" />
                Nouveau ticket
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={submit}>
                <DialogHeader>
                  <DialogTitle>Nouveau ticket</DialogTitle>
                  <DialogDescription>Créez une demande d'intervention.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Ex. Coupure ligne DECT" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="client">Client</Label>
                    <Input id="client" required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Priorité</Label>
                      <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Ticket["priority"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                          <SelectItem value="Élevée">Élevée</SelectItem>
                          <SelectItem value="Normale">Normale</SelectItem>
                          <SelectItem value="Faible">Faible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Statut</Label>
                      <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Ticket["status"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ouvert">Ouvert</SelectItem>
                          <SelectItem value="En cours">En cours</SelectItem>
                          <SelectItem value="En attente">En attente</SelectItem>
                          <SelectItem value="Résolu">Résolu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assigné à</Label>
                      <Input id="assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Technicien" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Détails de l'incident…" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit">Créer le ticket</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
