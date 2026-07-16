import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Plus, Phone, Wifi, Cable, Camera, ShieldCheck, Server, MoreHorizontal } from "lucide-react";
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

export const Route = createFileRoute("/dashboard/equipements")({
  head: () => ({ meta: [{ title: "Équipements — CTI-Network" }] }),
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

type Equipment = {
  ref: string;
  model: string;
  type: string;
  client: string;
  site: string;
  status: "En service" | "Alerte" | "Maintenance";
  lastCheck: string;
};

const initial: Equipment[] = [
  { ref: "GIG-N870-014", model: "Gigaset N870 IP PRO", type: "DECT Multicellulaire", client: "Groupe Poulina", site: "Ben Arous", status: "En service", lastCheck: "12 juil." },
  { ref: "NEC-SV9100-002", model: "NEC SV9100", type: "IP-PBX", client: "Société Générale", site: "Tunis Centre", status: "En service", lastCheck: "10 juil." },
  { ref: "UNF-OS-018", model: "Unify OpenScape Business", type: "Standard IP", client: "Ooredoo Tunisie", site: "Les Berges du Lac", status: "En service", lastCheck: "08 juil." },
  { ref: "MTX-SATATYA-041", model: "Matrix SATATYA CIDR20FL", type: "Caméra IP", client: "Délice Danone", site: "Sfax", status: "Alerte", lastCheck: "14 juil." },
  { ref: "MTX-COSEC-007", model: "Matrix COSEC DOOR", type: "Contrôle d'accès", client: "STEG", site: "Tunis", status: "En service", lastCheck: "05 juil." },
  { ref: "GIG-DE900-055", model: "Gigaset DE900 IP PRO", type: "Téléphone IP", client: "Hôtel Laico", site: "Hammamet", status: "Maintenance", lastCheck: "01 juil." },
  { ref: "MYF-500-003", model: "MyFax Server 500", type: "Fax to Mail", client: "Tunisair", site: "Tunis-Carthage", status: "En service", lastCheck: "15 juil." },
];

const statusColor: Record<string, string> = {
  "En service": "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  Alerte: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30",
  Maintenance: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
};

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
