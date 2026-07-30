import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Plus, Phone, Wifi, Cable, Camera, ShieldCheck, Server, ChevronRight } from "lucide-react";
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
import { initialEquipments, equipmentStatusColor, type Equipment } from "@/lib/equipment-data";

export const Route = createFileRoute("/dashboard/equipements/")({
  head: () => ({
    meta: [
      { title: "Équipements — CTI-Network" },
      { name: "description", content: "Parc d'équipements installés chez les clients CTI-Network : téléphonie IP, réseau, vidéosurveillance et contrôle d'accès." },
      { property: "og:title", content: "Équipements — CTI-Network" },
      { property: "og:description", content: "Inventaire du parc téléphonie, réseau et sécurité." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EquipementsPage,
});

const categories = [
  { name: "Téléphonie IP", count: 486, icon: Phone, tone: "from-blue-500/20 to-blue-500/5" },
  { name: "Postes DECT", count: 214, icon: Phone, tone: "from-cyan-500/20 to-cyan-500/5" },
  { name: "Bornes WIFI", count: 172, icon: Wifi, tone: "from-indigo-500/20 to-indigo-500/5" },
  { name: "Câblage / Fibre", count: 92, icon: Cable, tone: "from-teal-500/20 to-teal-500/5" },
  { name: "Vidéosurveillance", count: 268, icon: Camera, tone: "from-purple-500/20 to-purple-500/5" },
  { name: "Contrôle d'accès", count: 110, icon: ShieldCheck, tone: "from-rose-500/20 to-rose-500/5" },
];

const initial = initialEquipments;
const statusColor = equipmentStatusColor;


function EquipementsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    ref: "",
    model: "",
    type: "",
    client: "",
    site: "",
    status: "En service" as Equipment["status"],
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ref.trim() || !form.model.trim()) return;
    setEquipments((prev) => [{ ...form, lastCheck: "aujourd'hui" }, ...prev]);
    setForm({ ref: "", model: "", type: "", client: "", site: "", status: "En service" });
    setOpen(false);
    toast.success("Équipement ajouté");
  };

  return (
    <>
      <PageHeader
        title="Équipements"
        description="Parc installé chez vos clients — téléphonie, réseau et sécurité."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
                <Plus className="h-4 w-4" />
                Ajouter un équipement
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={submit}>
                <DialogHeader>
                  <DialogTitle>Nouvel équipement</DialogTitle>
                  <DialogDescription>Enregistrez un équipement dans le parc client.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="ref">Référence</Label>
                      <Input id="ref" required value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} placeholder="GIG-N870-015" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model">Modèle</Label>
                      <Input id="model" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Gigaset N870 IP PRO" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Input id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="DECT Multicellulaire, Caméra IP…" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="client">Client</Label>
                      <Input id="client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="site">Site</Label>
                      <Input id="site" value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} />
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
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((c) => (
          <button
            key={c.name}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.tone} p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 text-[color:var(--brand-deep)] backdrop-blur">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-display text-2xl font-semibold text-foreground">
              {c.count}
            </div>
            <div className="text-xs text-muted-foreground">{c.name}</div>
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-base font-semibold">Parc récent</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {equipments.length} équipements affichés
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Référence</th>
              <th className="px-5 py-3 font-medium">Modèle</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Client / Site</th>
              <th className="px-5 py-3 font-medium">État</th>
              <th className="px-5 py-3 font-medium">Dernier contrôle</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {equipments.map((e) => (
              <tr key={e.ref} className="transition hover:bg-secondary/30">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{e.ref}</td>
                <td className="px-5 py-4 font-medium text-foreground">{e.model}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.type}</td>
                <td className="px-5 py-4">
                  <div className="text-foreground">{e.client}</div>
                  <div className="text-xs text-muted-foreground">{e.site}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[e.status]}`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{e.lastCheck}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to="/dashboard/equipements/$ref"
                    params={{ ref: e.ref }}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[color:var(--brand-deep)] transition hover:bg-secondary"
                  >
                    Détails <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
