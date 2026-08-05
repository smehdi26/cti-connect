import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Building2,
  ArrowLeft,
  Paperclip,
  CheckCircle2,
  Upload,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { exportCsv, exportJson, exportPdfTable } from "@/lib/export-utils";
import { MONTH_LABELS, isPast, monthlyVisits, type MonthlyRow } from "@/lib/visits-data";
import {
  formatSize,
  loadReports,
  saveReports,
  visitKey,
  type VisitReport,
} from "@/lib/visit-reports";


export const Route = createFileRoute("/dashboard/contrats/visites")({
  head: () => ({
    meta: [
      { title: "Visites mensuelles — CTI-Network" },
      {
        name: "description",
        content:
          "Consultation mensuelle des visites préventives par client : numéro de visite du contrat, date jour/mois/année et technicien intervenant.",
      },
      { property: "og:title", content: "Visites mensuelles — CTI-Network" },
      { property: "og:description", content: "Vérifiez les visites préventives de chaque client mois par mois." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VisitesMensuellesPage,
});

const VISIT_COLS = [1, 2, 3, 4, 5, 6];

function csvRows(rows: MonthlyRow[]) {
  return rows.map((r) => {
    const cells: Record<string, string> = {
      clientId: r.clientId,
      contract: r.contract,
      visiteDuMois: `N°${r.current.index} — ${r.current.date} — ${r.current.technicien}`,
    };
    for (const n of VISIT_COLS) {
      const v = r.all.find((x) => x.index === n);
      cells[`v${n}`] = v ? `${v.date} (${v.technicien})` : "—";
    }
    return cells;
  });
}

const CSV_COLUMNS = [
  { key: "clientId", label: "Code client" },
  { key: "contract", label: "Contrat" },
  { key: "visiteDuMois", label: "Visite du mois" },
  ...VISIT_COLS.map((n) => ({ key: `v${n}`, label: `Visite ${n}` })),
];

type EditTarget = {
  key: string;
  clientId: string;
  contract: string;
  index: number;
  date: string;
  technicien: string;
};

function VisitesMensuellesPage() {
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [reports, setReports] = useState<Record<string, VisitReport>>({});
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [draft, setDraft] = useState<{ fileName: string; fileSize: number; note: string }>({
    fileName: "",
    fileSize: 0,
    note: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    setCursor({ y: now.getFullYear(), m: now.getMonth() });
    setReports(loadReports());
  }, []);

  const persist = (next: Record<string, VisitReport>) => {
    setReports(next);
    saveReports(next);
  };

  const openVisit = (t: EditTarget) => {
    const existing = reports[t.key];
    setDraft({
      fileName: existing?.fileName ?? "",
      fileSize: existing?.fileSize ?? 0,
      note: existing?.note ?? "",
    });
    setTarget(t);
  };

  const saveDraft = (validated: boolean) => {
    if (!target) return;
    if (validated && !draft.fileName) {
      toast.error("Joignez le rapport de visite avant de valider");
      return;
    }
    persist({
      ...reports,
      [target.key]: {
        fileName: draft.fileName,
        fileSize: draft.fileSize,
        note: draft.note,
        validated,
        validatedAt: validated ? new Date().toLocaleDateString("fr-FR") : undefined,
      },
    });
    toast.success(validated ? "Visite validée" : "Pièce jointe enregistrée");
    setTarget(null);
  };

  const removeReport = () => {
    if (!target) return;
    const next = { ...reports };
    delete next[target.key];
    persist(next);
    toast.success("Pièce jointe supprimée");
    setTarget(null);
  };

  const rows = useMemo(
    () => (cursor ? monthlyVisits(cursor.y, cursor.m) : []),
    [cursor],
  );


  const periodLabel = cursor ? `${MONTH_LABELS[cursor.m]} ${cursor.y}` : "—";
  const shift = (delta: number) =>
    setCursor((c) => {
      if (!c) return c;
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const exportPdf = () => {
    const ok = exportPdfTable(
      `Visites préventives — ${periodLabel}`,
      `${rows.length} client(s) avec une visite planifiée en ${periodLabel}`,
      [
        { label: "Code client" },
        { label: "Contrat" },
        { label: "Visite du mois" },
        ...VISIT_COLS.map((n) => ({ label: `V${n}` })),
      ],
      rows.map((r) => [
        r.clientId,
        r.contract,
        `N°${r.current.index} — ${r.current.date} — ${r.current.technicien}`,
        ...VISIT_COLS.map((n) => {
          const v = r.all.find((x) => x.index === n);
          return v ? `${v.date}\n${v.technicien}` : "—";
        }),
      ]),
    );
    if (ok) toast.success("Aperçu PDF ouvert — utilisez « Enregistrer en PDF »");
    else toast.error("Autorisez les fenêtres pop-up pour générer le PDF");
  };

  const slug = cursor ? `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}` : "mois";

  return (
    <>
      <PageHeader
        title="Visites mensuelles"
        description="Vérifiez, mois par mois, les clients à visiter, le numéro de visite prévu au contrat et le technicien concerné."
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/contrats"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Contrats
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95">
                  <Download className="h-4 w-4" /> Exporter le mois
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{periodLabel} — {rows.length} client(s)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportPdf}>
                  <FileText className="h-4 w-4" /> PDF (impression)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    exportCsv(`visites-${slug}`, CSV_COLUMNS as never, csvRows(rows) as never);
                    toast.success("Export CSV téléchargé");
                  }}
                >
                  <FileSpreadsheet className="h-4 w-4" /> CSV (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    exportJson(`visites-${slug}`, { periode: periodLabel, clients: rows });
                    toast.success("Export JSON téléchargé");
                  }}
                >
                  <FileJson className="h-4 w-4" /> JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          <button
            onClick={() => shift(-1)}
            aria-label="Mois précédent"
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[10rem] px-2 text-center text-sm font-medium">{periodLabel}</span>
          <button
            onClick={() => shift(1)}
            aria-label="Mois suivant"
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {rows.length} client(s) à visiter en {periodLabel}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-background shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Code client</th>
              <th className="px-5 py-3 font-medium">Contrat</th>
              {VISIT_COLS.map((n) => (
                <th key={n} className="px-4 py-3 font-medium">Visite {n}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.clientId} className="align-top transition hover:bg-secondary/30">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{r.clientId}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to="/dashboard/contrats/$clientId"
                        params={{ clientId: r.clientId }}
                        className="font-medium text-foreground hover:underline"
                      >
                        {r.contract}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {r.visits} visites / an · visite n°{r.current.index} ce mois
                      </div>
                    </div>
                  </div>
                </td>
                {VISIT_COLS.map((n) => {
                  const v = r.all.find((x) => x.index === n);
                  if (!v)
                    return (
                      <td key={n} className="px-4 py-4 text-xs text-muted-foreground/60">—</td>
                    );
                  const isCurrent = v.monthIndex === cursor?.m;
                  const done = isPast(v.date);
                  const key = visitKey(r.clientId, cursor?.y ?? 0, v.index);
                  const rep = reports[key];
                  return (
                    <td key={n} className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          openVisit({
                            key,
                            clientId: r.clientId,
                            contract: r.contract,
                            index: v.index,
                            date: v.date,
                            technicien: v.technicien,
                          })
                        }
                        className={`w-full rounded-lg border px-2.5 py-2 text-left transition hover:shadow-[var(--shadow-soft)] ${
                          rep?.validated
                            ? "border-emerald-500/60 bg-emerald-500/10"
                            : isCurrent
                              ? "border-[color:var(--brand-deep)] bg-[color:var(--brand-soft)]"
                              : "border-border bg-secondary/40"
                        }`}
                      >
                        <div
                          className={`font-mono text-xs font-medium ${
                            isCurrent ? "text-[color:var(--brand-deep)]" : "text-foreground"
                          }`}
                        >
                          {v.date}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {v.technicien}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground/80">
                          {rep?.validated ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-600">Validée</span>
                            </>
                          ) : (
                            <span>{done ? "Effectuée" : "Planifiée"}</span>
                          )}
                        </div>
                        {rep?.fileName && (
                          <div className="mt-1 flex items-center gap-1 truncate text-[10px] text-muted-foreground">
                            <Paperclip className="h-3 w-3 shrink-0" />
                            <span className="truncate">{rep.fileName}</span>
                          </div>
                        )}
                      </button>
                    </td>
                  );
                })}

              </tr>
            ))}
            {cursor && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Aucune visite planifiée en {periodLabel}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarCheck className="h-3.5 w-3.5" />
        Le numéro de visite suit l'ordre des mois défini dans le contrat d'origine (4 ou 6 visites par an).
        Cliquez sur une visite pour joindre son rapport et la valider.
      </p>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Visite n°{target?.index} — {target?.contract}
            </DialogTitle>
            <DialogDescription>
              {target?.date} · {target?.technicien} · {target?.clientId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Rapport de visite</label>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setDraft((d) => ({ ...d, fileName: f.name, fileSize: f.size }));
                  e.target.value = "";
                }}
              />
              {draft.fileName ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
                  <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{draft.fileName}</div>
                    <div className="text-xs text-muted-foreground">{formatSize(draft.fileSize)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, fileName: "", fileSize: 0 }))}
                    className="rounded-md p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground"
                    aria-label="Retirer le fichier"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-6 text-sm text-muted-foreground transition hover:border-[color:var(--brand-deep)] hover:text-foreground"
                >
                  <Upload className="h-4 w-4" /> Joindre un fichier (PDF, photo…)
                </button>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Observations</label>
              <Textarea
                value={draft.note}
                onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                placeholder="Constats, matériel remplacé, recommandations…"
                rows={3}
              />
            </div>

            {target && reports[target.key]?.validated && (
              <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Visite validée le {reports[target.key]?.validatedAt}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {target && reports[target.key] ? (
              <button
                type="button"
                onClick={removeReport}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => saveDraft(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => saveDraft(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-95"
              >
                <CheckCircle2 className="h-4 w-4" /> Valider la visite
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  );
}
