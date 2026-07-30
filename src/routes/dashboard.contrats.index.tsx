import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { FileSignature, Plus, Search, Calendar, Building2 } from "lucide-react";
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

export const Route = createFileRoute("/dashboard/contrats")({
  head: () => ({ meta: [{ title: "Contrats de maintenance — CTI-Network" }] }),
  component: ContratsPage,
});

type Redevance = "Annuelle" | "Semestrielle";
type Contract = {
  clientId: string;
  contract: string; // company name
  redevance: Redevance;
  signedAt: string; // YYYY-MM-DD
  visits: 4 | 6;
  visitMonths: string[];
};

const MONTHS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
];

const initial: Contract[] = [
  {
    clientId: "CLI-001",
    contract: "Société Générale Tunisie",
    redevance: "Annuelle",
    signedAt: "2024-02-14",
    visits: 6,
    visitMonths: ["Fév", "Avr", "Juin", "Août", "Oct", "Déc"],
  },
  {
    clientId: "CLI-002",
    contract: "Groupe Poulina",
    redevance: "Semestrielle",
    signedAt: "2023-09-03",
    visits: 4,
    visitMonths: ["Mar", "Juin", "Sep", "Déc"],
  },
  {
    clientId: "CLI-003",
    contract: "Tunisair",
    redevance: "Annuelle",
    signedAt: "2024-06-21",
    visits: 6,
    visitMonths: ["Jan", "Mar", "Mai", "Juil", "Sep", "Nov"],
  },
  {
    clientId: "CLI-004",
    contract: "Délice Danone",
    redevance: "Semestrielle",
    signedAt: "2025-01-12",
    visits: 4,
    visitMonths: ["Fév", "Mai", "Août", "Nov"],
  },
  {
    clientId: "CLI-006",
    contract: "STEG",
    redevance: "Annuelle",
    signedAt: "2022-11-08",
    visits: 6,
    visitMonths: ["Fév", "Avr", "Juin", "Août", "Oct", "Déc"],
  },
];

function ContratsPage() {
  const [rows, setRows] = useState<Contract[]>(initial);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    clientId: "",
    contract: "",
    redevance: "Annuelle" as Redevance,
    signedAt: new Date().toISOString().slice(0, 10),
    visits: "6" as "6" | "4",
    visitMonths: [] as string[],
  });

  const visible = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      r.contract.toLowerCase().includes(q) ||
      r.clientId.toLowerCase().includes(q)
    );
  });

  const toggleMonth = (m: string) => {
    setForm((f) => {
      const has = f.visitMonths.includes(m);
      const max = Number(f.visits);
      if (has) return { ...f, visitMonths: f.visitMonths.filter((x) => x !== m) };
      if (f.visitMonths.length >= max) {
        toast.error(`Sélectionnez au maximum ${max} mois`);
        return f;
      }
      return { ...f, visitMonths: [...f.visitMonths, m] };
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId.trim() || !form.contract.trim()) return;
    const visits = Number(form.visits) as 4 | 6;
    if (form.visitMonths.length !== visits) {
      toast.error(`Sélectionnez exactement ${visits} mois de visite`);
      return;
    }
    setRows((prev) => [
      {
        clientId: form.clientId,
        contract: form.contract,
        redevance: form.redevance,
        signedAt: form.signedAt,
        visits,
        visitMonths: form.visitMonths,
      },
      ...prev,
    ]);
    setForm({
      clientId: "",
      contract: "",
      redevance: "Annuelle",
      signedAt: new Date().toISOString().slice(0, 10),
      visits: "6",
      visitMonths: [],
    });
    setOpen(false);
    toast.success("Contrat enregistré");
  };

  return (
    <>
      <PageHeader
        title="Contrats de maintenance"
        description="Suivi des contrats, redevances et calendriers de visites préventives."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
                <Plus className="h-4 w-4" />
                Nouveau contrat
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <form onSubmit={submit}>
                <DialogHeader>
                  <DialogTitle>Nouveau contrat de maintenance</DialogTitle>
                  <DialogDescription>
                    Renseignez les modalités et le calendrier des visites.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="clientId">ID client</Label>
                      <Input
                        id="clientId"
                        required
                        placeholder="CLI-012"
                        value={form.clientId}
                        onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contract">Contrat (entreprise)</Label>
                      <Input
                        id="contract"
                        required
                        value={form.contract}
                        onChange={(e) => setForm({ ...form, contract: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Redevance</Label>
                      <Select
                        value={form.redevance}
                        onValueChange={(v) => setForm({ ...form, redevance: v as Redevance })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Annuelle">Annuelle</SelectItem>
                          <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signedAt">Date de signature</Label>
                      <Input
                        id="signedAt"
                        type="date"
                        value={form.signedAt}
                        onChange={(e) => setForm({ ...form, signedAt: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Nombre de visites</Label>
                      <Select
                        value={form.visits}
                        onValueChange={(v) =>
                          setForm({ ...form, visits: v as "6" | "4", visitMonths: [] })
                        }
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 visites</SelectItem>
                          <SelectItem value="4">4 visites</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Mois des visites ({form.visitMonths.length}/{form.visits})</Label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {MONTHS.map((m) => {
                        const active = form.visitMonths.includes(m);
                        return (
                          <button
                            type="button"
                            key={m}
                            onClick={() => toggleMonth(m)}
                            className={`rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
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
            placeholder="Rechercher un contrat ou un ID client…"
            className="w-72 bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{visible.length} contrat(s)</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">ID client</th>
              <th className="px-5 py-3 font-medium">Contrat</th>
              <th className="px-5 py-3 font-medium">Redevance</th>
              <th className="px-5 py-3 font-medium">Date de signature</th>
              <th className="px-5 py-3 font-medium text-right">Visites</th>
              <th className="px-5 py-3 font-medium">Mois des visites</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((r) => (
              <tr key={r.clientId} className="transition hover:bg-secondary/30">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{r.clientId}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">{r.contract}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--brand-deep)] ring-1 ring-inset ring-[color:var(--brand-soft)]">
                    {r.redevance}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(r.signedAt).toLocaleDateString("fr-FR")}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-medium">{r.visits}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {r.visitMonths.map((m) => (
                      <span
                        key={m}
                        className="inline-flex rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Aucun contrat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <FileSignature className="h-3.5 w-3.5" />
        Les contrats définissent les actions préventives programmées via CTI-Network.
      </p>
    </>
  );
}
