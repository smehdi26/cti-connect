import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Server,
  Pencil,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Download,
  Ticket,
  MapPin,
  Building2,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialEquipments, equipmentStatusColor, type Equipment } from "@/lib/equipment-data";

export const Route = createFileRoute("/dashboard/equipements/$ref")({
  head: ({ params }) => ({
    meta: [
      { title: `Équipement ${params.ref} — CTI-Network` },
      { name: "description", content: `Fiche technique de l'équipement ${params.ref} : état, client, site et historique d'intervention.` },
      { property: "og:title", content: `Équipement ${params.ref} — CTI-Network` },
      { property: "og:description", content: "Fiche technique, état et historique d'intervention." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EquipementDetailPage,
});

const HISTORY = [
  { date: "15 juil. 2026", label: "Contrôle préventif effectué", by: "Technicien Mehdi B." },
  { date: "02 mai 2026", label: "Mise à jour firmware", by: "Technicien Sami L." },
  { date: "18 janv. 2026", label: "Remplacement alimentation", by: "Technicien Mehdi B." },
  { date: "09 sept. 2025", label: "Installation et mise en service", by: "Équipe déploiement" },
];

function EquipementDetailPage() {
  const { ref } = Route.useParams();
  const found = initialEquipments.find((e) => e.ref === ref);
  const [item, setItem] = useState<Equipment | undefined>(found);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    model: found?.model ?? "",
    type: found?.type ?? "",
    client: found?.client ?? "",
    site: found?.site ?? "",
    status: (found?.status ?? "En service") as Equipment["status"],
  });

  if (!item) {
    return (
      <>
        <PageHeader title="Équipement introuvable" description={`Aucun équipement avec la référence ${ref}.`} />
        <Link to="/dashboard/equipements" className="inline-flex items-center gap-2 text-sm text-[color:var(--brand-deep)]">
          <ArrowLeft className="h-4 w-4" /> Retour aux équipements
        </Link>
      </>
    );
  }

  const setStatus = (status: Equipment["status"]) => {
    setItem({ ...item, status });
    toast.success(`État mis à jour : ${status}`);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setItem({ ...item, ...form });
    setEditOpen(false);
    toast.success("Équipement mis à jour");
  };

  return (
    <>
      <Link
        to="/dashboard/equipements"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux équipements
      </Link>

      <PageHeader
        title={item.model}
        description={`${item.type} — référence ${item.ref}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Button>
            <Button variant="outline" onClick={() => { setStatus("Maintenance"); }}>
              <Wrench className="mr-2 h-4 w-4" /> Planifier maintenance
            </Button>
            <Button variant="outline" onClick={() => setStatus("En service")}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Marquer en service
            </Button>
            <Button variant="outline" onClick={() => toast.success("Ticket de support créé pour cet équipement")}>
              <Ticket className="mr-2 h-4 w-4" /> Créer un ticket
            </Button>
            <Button variant="outline" onClick={() => toast.success("Fiche technique exportée")}>
              <Download className="mr-2 h-4 w-4" /> Exporter
            </Button>
            <Button variant="destructive" onClick={() => toast.success("Équipement retiré du parc")}>
              <Trash2 className="mr-2 h-4 w-4" /> Retirer du parc
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "État", value: item.status, icon: Activity },
          { label: "Client", value: item.client, icon: Building2 },
          { label: "Site", value: item.site, icon: MapPin },
          { label: "Dernier contrôle", value: item.lastCheck, icon: CheckCircle2 },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </div>
            <div className="mt-2 font-display text-lg font-semibold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Fiche technique</h2>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${equipmentStatusColor[item.status]}`}>
              {item.status}
            </span>
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Référence", item.ref],
              ["Modèle", item.model],
              ["Type", item.type],
              ["Client", item.client],
              ["Site d'installation", item.site],
              ["Dernier contrôle", item.lastCheck],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 text-xs uppercase tracking-wider text-muted-foreground">Historique d'intervention</h3>
          <ul className="mt-3 space-y-3">
            {HISTORY.map((h) => (
              <li key={h.date} className="flex gap-3 rounded-xl border border-border bg-secondary/30 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-[color:var(--brand-deep)]">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{h.label}</div>
                  <div className="text-xs text-muted-foreground">{h.date} · {h.by}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-base font-semibold">Changer l'état</h2>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setStatus("En service")}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> En service
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setStatus("Maintenance")}>
                <Wrench className="mr-2 h-4 w-4" /> Maintenance
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setStatus("Alerte")}>
                <AlertTriangle className="mr-2 h-4 w-4" /> Alerte
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-base font-semibold">Actions rapides</h2>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Diagnostic à distance lancé")}>
                <Activity className="mr-2 h-4 w-4" /> Lancer un diagnostic
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Contrôle préventif planifié")}>
                <Wrench className="mr-2 h-4 w-4" /> Planifier un contrôle
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={saveEdit}>
            <DialogHeader>
              <DialogTitle>Modifier l'équipement</DialogTitle>
              <DialogDescription>Mettez à jour les informations du parc.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="e-model">Modèle</Label>
                  <Input id="e-model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="e-type">Type</Label>
                  <Input id="e-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="e-client">Client</Label>
                  <Input id="e-client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="e-site">Site</Label>
                  <Input id="e-site" value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>État</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Equipment["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En service">En service</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Alerte">Alerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
