import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileSignature,
  Download,
  RefreshCw,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  CalendarClock,
  Wallet,
  FileText,
  FileSpreadsheet,
  FileJson,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportCsv, exportJson, exportPdfSections } from "@/lib/export-utils";
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
import { MONTHS, initialContracts, clientSlug, type Contract, type Redevance } from "@/lib/contracts-data";

export const Route = createFileRoute("/dashboard/contrats/$clientId")({
  head: ({ params }) => ({
    meta: [
      { title: `Contrat ${params.clientId} — CTI-Network` },
      { name: "description", content: `Détail du contrat de maintenance ${params.clientId} : redevance, visites préventives et actions de gestion.` },
      { property: "og:title", content: `Contrat ${params.clientId} — CTI-Network` },
      { property: "og:description", content: "Détail du contrat de maintenance et calendrier des visites." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContratDetailPage,
});

function ContratDetailPage() {
  const { clientId } = Route.useParams();
  const found = initialContracts.find((c) => c.clientId === clientId);
  const [contract, setContract] = useState<Contract | undefined>(found);
  const [active, setActive] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    contract: found?.contract ?? "",
    redevance: (found?.redevance ?? "Annuelle") as Redevance,
    signedAt: found?.signedAt ?? "",
    visits: String(found?.visits ?? 6) as "4" | "6",
    visitMonths: found?.visitMonths ?? [],
  });

  if (!contract) {
    return (
      <>
        <PageHeader title="Contrat introuvable" description={`Aucun contrat pour l'identifiant ${clientId}.`} />
        <Link to="/dashboard/contrats" className="inline-flex items-center gap-2 text-sm text-[color:var(--brand-deep)]">
          <ArrowLeft className="h-4 w-4" /> Retour aux contrats
        </Link>
      </>
    );
  }

  const toggleMonth = (m: string) => {
    setForm((f) => {
      const has = f.visitMonths.includes(m);
      if (has) return { ...f, visitMonths: f.visitMonths.filter((x) => x !== m) };
      if (f.visitMonths.length >= Number(f.visits)) {
        toast.error(`Sélectionnez au maximum ${f.visits} mois`);
        return f;
      }
      return { ...f, visitMonths: [...f.visitMonths, m] };
    });
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const visits = Number(form.visits) as 4 | 6;
    if (form.visitMonths.length !== visits) {
      toast.error(`Sélectionnez exactement ${visits} mois de visite`);
      return;
    }
    setContract({ ...contract, ...form, visits });
    setEditOpen(false);
    toast.success("Contrat mis à jour");
  };

  const renew = () => {
    const next = new Date(contract.signedAt);
    next.setFullYear(next.getFullYear() + 1);
    setContract({ ...contract, signedAt: next.toISOString().slice(0, 10) });
    setActive(true);
    toast.success("Contrat renouvelé pour 12 mois");
  };

  const signedYear = new Date(contract.signedAt).getFullYear();
  const nextVisit = contract.visitMonths[0];

  return (
    <>
      <Link
        to="/dashboard/contrats"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux contrats
      </Link>

      <PageHeader
        title={contract.contract}
        description={`Contrat de maintenance ${contract.clientId} — redevance ${contract.redevance.toLowerCase()}.`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Button>
            <Button variant="outline" onClick={renew}>
              <RefreshCw className="mr-2 h-4 w-4" /> Renouveler
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Exporter le contrat</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const ok = exportPdfSections(
                      "Contrat de maintenance",
                      `${contract.contract} — ${contract.clientId}`,
                      [
                        {
                          heading: "Contrat",
                          pairs: [
                            ["ID client", contract.clientId],
                            ["Entreprise", contract.contract],
                            ["Statut", active ? "Actif" : "Suspendu"],
                            ["Redevance", contract.redevance],
                            ["Date de signature", contract.signedAt],
                            ["Visites / an", String(contract.visits)],
                            ["Mois des visites", contract.visitMonths.join(", ")],
                          ] as [string, string][],
                        },
                        {
                          heading: "Calendrier des visites",
                          table: {
                            columns: ["Mois", "Type d'intervention"],
                            rows: contract.visitMonths.map((m) => [m, "Visite préventive planifiée"]),
                          },
                        },
                      ],
                    );
                    if (ok) toast.success("Aperçu PDF ouvert — utilisez « Enregistrer en PDF »");
                    else toast.error("Autorisez les fenêtres pop-up pour générer le PDF");
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" /> PDF (impression)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    exportCsv(
                      `contrat-${contract.clientId}`,
                      [
                        { key: "clientId", label: "ID client" },
                        { key: "contract", label: "Contrat" },
                        { key: "redevance", label: "Redevance" },
                        { key: "signedAt", label: "Date de signature" },
                        { key: "visits", label: "Visites" },
                        { key: "visitMonths", label: "Mois des visites" },
                      ],
                      [contract],
                    );
                    toast.success("Export CSV téléchargé");
                  }}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    exportJson(`contrat-${contract.clientId}`, { ...contract, actif: active });
                    toast.success("Export JSON téléchargé");
                  }}
                >
                  <FileJson className="mr-2 h-4 w-4" /> JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    void navigator.clipboard?.writeText(
                      `${contract.clientId} — ${contract.contract} — ${contract.redevance} — ${contract.visits} visites (${contract.visitMonths.join(", ")})`,
                    );
                    toast.success("Résumé copié");
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copier le résumé
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={() => {
                setActive((a) => !a);
                toast.success(active ? "Contrat suspendu" : "Contrat réactivé");
              }}
            >
              {active ? <Ban className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              {active ? "Suspendre" : "Réactiver"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => toast.success("Demande de résiliation envoyée")}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Résilier
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Statut", value: active ? "Actif" : "Suspendu", icon: CheckCircle2 },
          { label: "Redevance", value: contract.redevance, icon: Wallet },
          { label: "Visites / an", value: String(contract.visits), icon: CalendarClock },
          { label: "Signé en", value: String(signedYear), icon: FileSignature },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-background p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Informations du contrat</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["ID client", contract.clientId],
              ["Entreprise", contract.contract],
              ["Date de signature", new Date(contract.signedAt).toLocaleDateString("fr-FR")],
              ["Redevance", contract.redevance],
              ["Nombre de visites", `${contract.visits} par an`],
              ["Prochaine visite", nextVisit ?? "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 text-xs uppercase tracking-wider text-muted-foreground">Calendrier des visites</h3>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {MONTHS.map((m) => {
              const on = contract.visitMonths.includes(m);
              return (
                <div
                  key={m}
                  className={`rounded-md border px-2 py-2 text-center text-xs font-medium ${
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  {m}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-base font-semibold">Client</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{contract.contract}</div>
                <div className="font-mono text-xs text-muted-foreground">{contract.clientId}</div>
              </div>
            </div>
            <Link
              to="/dashboard/clients/$slug"
              params={{ slug: clientSlug(contract.contract) }}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary"
            >
              Voir la fiche client
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-base font-semibold">Actions rapides</h2>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Visite préventive planifiée")}>
                <Calendar className="mr-2 h-4 w-4" /> Planifier une visite
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Rappel de redevance envoyé")}>
                <Wallet className="mr-2 h-4 w-4" /> Envoyer un rappel de redevance
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Avenant généré")}>
                <FileSignature className="mr-2 h-4 w-4" /> Générer un avenant
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={saveEdit}>
            <DialogHeader>
              <DialogTitle>Modifier le contrat</DialogTitle>
              <DialogDescription>Mettez à jour les modalités et le calendrier.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="c-name">Entreprise</Label>
                <Input id="c-name" value={form.contract} onChange={(e) => setForm({ ...form, contract: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Redevance</Label>
                  <Select value={form.redevance} onValueChange={(v) => setForm({ ...form, redevance: v as Redevance })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annuelle">Annuelle</SelectItem>
                      <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-date">Signature</Label>
                  <Input id="c-date" type="date" value={form.signedAt} onChange={(e) => setForm({ ...form, signedAt: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Visites</Label>
                  <Select value={form.visits} onValueChange={(v) => setForm({ ...form, visits: v as "4" | "6", visitMonths: [] })}>
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
                    const on = form.visitMonths.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => toggleMonth(m)}
                        className={`rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                          on
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
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
