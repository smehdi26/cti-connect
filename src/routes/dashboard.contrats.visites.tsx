import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportCsv, exportJson, exportPdfTable } from "@/lib/export-utils";
import { MONTH_LABELS, isPast, monthlyVisits, type MonthlyRow } from "@/lib/visits-data";

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

function VisitesMensuellesPage() {
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);

  useEffect(() => {
    const now = new Date();
    setCursor({ y: now.getFullYear(), m: now.getMonth() });
  }, []);

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
                  return (
                    <td key={n} className="px-4 py-4">
                      <div
                        className={`rounded-lg border px-2.5 py-2 ${
                          isCurrent
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
                        <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/80">
                          {done ? "Effectuée" : "Planifiée"}
                        </div>
                      </div>
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
      </p>
    </>
  );
}
