import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import {
  Plus,
  Search,
  Clock,
  User,
  List as ListIcon,
  LayoutGrid,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  MessageSquare,
  History as HistoryIcon,
  Send,
  Trash2,
  FileText,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type Priority = "Urgent" | "Élevée" | "Normale" | "Faible";
type Status = "Ouvert" | "En cours" | "En attente" | "Résolu";

type Comment = { id: string; author: string; text: string; at: string };
type Attachment = { id: string; name: string; size: number };
type HistoryEntry = { id: string; at: string; author: string; text: string };

type Ticket = {
  id: string;
  subject: string;
  client: string;
  priority: Priority;
  status: Status;
  assignee: string;
  age: string;
  date: string; // yyyy-mm-dd
  description?: string;
  comments: Comment[];
  attachments: Attachment[];
  history: HistoryEntry[];
};

const CURRENT_USER = "Amine B.";

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (base: Date, n: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};
const uid = () => Math.random().toString(36).slice(2, 10);
const nowLabel = () =>
  new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

const seed = (t: Omit<Ticket, "comments" | "attachments" | "history">): Ticket => ({
  ...t,
  comments: [],
  attachments: [],
  history: [{ id: uid(), at: nowLabel(), author: "Système", text: "Ticket créé" }],
});

const initial: Ticket[] = [
  seed({ id: "#4832", subject: "Coupure ligne DECT — Bureau 3ème étage", client: "Société Générale Tunisie", priority: "Urgent", status: "Ouvert", assignee: "Karim H.", age: "il y a 25 min", date: iso(today) }),
  seed({ id: "#4831", subject: "Configuration IVR pour service client", client: "Ooredoo Tunisie", priority: "Élevée", status: "En cours", assignee: "Sami B.", age: "il y a 2 h", date: iso(addDays(today, 1)) }),
  seed({ id: "#4830", subject: "Caméra IP hors ligne — Site Sfax", client: "Délice Danone", priority: "Élevée", status: "En cours", assignee: "Aya M.", age: "il y a 3 h", date: iso(addDays(today, 2)) }),
  seed({ id: "#4829", subject: "Ajout de 12 postes Gigaset", client: "Groupe Poulina", priority: "Normale", status: "Ouvert", assignee: "—", age: "il y a 5 h", date: iso(addDays(today, 3)) }),
  seed({ id: "#4828", subject: "Migration standard vers VOIP", client: "Hôtel Laico", priority: "Normale", status: "En attente", assignee: "Karim H.", age: "hier", date: iso(addDays(today, 5)) }),
  seed({ id: "#4827", subject: "Fax to mail — erreur de routage", client: "Tunisair", priority: "Faible", status: "Résolu", assignee: "Sami B.", age: "hier", date: iso(addDays(today, -1)) }),
  seed({ id: "#4826", subject: "Contrat maintenance annuel", client: "STEG", priority: "Normale", status: "Résolu", assignee: "Aya M.", age: "il y a 2 j", date: iso(addDays(today, -2)) }),
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

const STATUSES: Status[] = ["Ouvert", "En cours", "En attente", "Résolu"];
const PRIORITIES: Priority[] = ["Urgent", "Élevée", "Normale", "Faible"];

const kpis = [
  { label: "Ouverts", value: 17, tone: "text-[color:var(--brand-deep)]" },
  { label: "Urgents", value: 3, tone: "text-red-600 dark:text-red-400" },
  { label: "En cours", value: 8, tone: "text-blue-600 dark:text-blue-400" },
  { label: "Résolus (7j)", value: 42, tone: "text-emerald-600 dark:text-emerald-400" },
];

type View = "list" | "board" | "calendar";
type FormState = {
  subject: string;
  client: string;
  priority: Priority;
  status: Status;
  assignee: string;
  description: string;
  date: string;
};
const emptyForm: FormState = {
  subject: "",
  client: "",
  priority: "Normale",
  status: "Ouvert",
  assignee: "",
  description: "",
  date: iso(today),
};

function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initial);
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  // Ticket editor dialog (create + edit)
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  // Detail drawer
  const [detailId, setDetailId] = useState<string | null>(null);
  const detailTicket = tickets.find((t) => t.id === detailId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.subject.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      );
    });
  }, [tickets, query, priorityFilter, statusFilter]);

  const openCreate = (prefillDate?: string) => {
    setEditingId(null);
    setForm({ ...emptyForm, date: prefillDate ?? iso(today) });
    setEditorOpen(true);
  };

  const openEdit = (t: Ticket) => {
    setEditingId(t.id);
    setForm({
      subject: t.subject,
      client: t.client,
      priority: t.priority,
      status: t.status,
      assignee: t.assignee === "—" ? "" : t.assignee,
      description: t.description ?? "",
      date: t.date,
    });
    setEditorOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.client.trim()) return;

    if (editingId) {
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id !== editingId) return t;
          const changes: string[] = [];
          if (t.subject !== form.subject) changes.push(`sujet → « ${form.subject} »`);
          if (t.client !== form.client) changes.push(`client → ${form.client}`);
          if (t.priority !== form.priority) changes.push(`priorité → ${form.priority}`);
          if (t.status !== form.status) changes.push(`statut → ${form.status}`);
          if ((t.assignee === "—" ? "" : t.assignee) !== form.assignee)
            changes.push(`assigné → ${form.assignee || "—"}`);
          if (t.date !== form.date) changes.push(`date → ${form.date}`);
          if ((t.description ?? "") !== form.description) changes.push("description modifiée");
          const historyEntry: HistoryEntry | null = changes.length
            ? { id: uid(), at: nowLabel(), author: CURRENT_USER, text: changes.join(", ") }
            : null;
          return {
            ...t,
            subject: form.subject,
            client: form.client,
            priority: form.priority,
            status: form.status,
            assignee: form.assignee || "—",
            date: form.date,
            description: form.description,
            history: historyEntry ? [...t.history, historyEntry] : t.history,
          };
        })
      );
      toast.success("Ticket mis à jour");
    } else {
      const nextNum = 4833 + tickets.filter((t) => t.id.startsWith("#48")).length - initial.length;
      const nextId = `#${nextNum}`;
      setTickets((prev) => [
        {
          id: nextId,
          subject: form.subject,
          client: form.client,
          priority: form.priority,
          status: form.status,
          assignee: form.assignee || "—",
          age: "à l'instant",
          date: form.date,
          description: form.description,
          comments: [],
          attachments: [],
          history: [
            { id: uid(), at: nowLabel(), author: CURRENT_USER, text: "Ticket créé" },
          ],
        },
        ...prev,
      ]);
      toast.success("Ticket créé");
    }
    setEditorOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const addComment = (ticketId: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              comments: [
                ...t.comments,
                { id: uid(), author: CURRENT_USER, text, at: nowLabel() },
              ],
              history: [
                ...t.history,
                { id: uid(), at: nowLabel(), author: CURRENT_USER, text: "commentaire ajouté" },
              ],
            }
          : t
      )
    );
  };

  const addAttachments = (ticketId: string, files: FileList) => {
    const items: Attachment[] = Array.from(files).map((f) => ({
      id: uid(),
      name: f.name,
      size: f.size,
    }));
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              attachments: [...t.attachments, ...items],
              history: [
                ...t.history,
                {
                  id: uid(),
                  at: nowLabel(),
                  author: CURRENT_USER,
                  text: `${items.length} pièce(s) jointe(s) ajoutée(s)`,
                },
              ],
            }
          : t
      )
    );
  };

  const removeAttachment = (ticketId: string, attId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              attachments: t.attachments.filter((a) => a.id !== attId),
              history: [
                ...t.history,
                { id: uid(), at: nowLabel(), author: CURRENT_USER, text: "pièce jointe supprimée" },
              ],
            }
          : t
      )
    );
  };

  const quickStatus = (ticketId: string, status: Status) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId && t.status !== status
          ? {
              ...t,
              status,
              history: [
                ...t.history,
                { id: uid(), at: nowLabel(), author: CURRENT_USER, text: `statut → ${status}` },
              ],
            }
          : t
      )
    );
  };

  return (
    <>
      <PageHeader
        title="Tickets de support"
        description="Suivi des demandes d'intervention et incidents."
        action={
          <button
            onClick={() => openCreate()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Nouveau ticket
          </button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-background p-4">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className={`mt-1 font-display text-2xl font-semibold ${k.tone}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-border bg-background p-1">
          {(
            [
              { v: "list", label: "Liste", icon: ListIcon },
              { v: "board", label: "Board", icon: LayoutGrid },
              { v: "calendar", label: "Calendrier", icon: CalendarDays },
            ] as const
          ).map(({ v, label, icon: Icon }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                view === v ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm w-full sm:w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as "all" | Priority)}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Priorité" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes priorités</SelectItem>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | Status)}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === "list" && <ListView tickets={filtered} onOpen={(t) => setDetailId(t.id)} />}
      {view === "board" && <BoardView tickets={filtered} onOpen={(t) => setDetailId(t.id)} />}
      {view === "calendar" && (
        <CalendarView
          tickets={filtered}
          onDayClick={(date) => openCreate(date)}
          onTicketClick={(t) => setDetailId(t.id)}
        />
      )}

      {/* Editor dialog (create + edit) */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier le ticket" : "Nouveau ticket"}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Mettez à jour les informations du ticket."
                  : "Créez une demande d'intervention."}
              </DialogDescription>
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
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Statut</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assigné à</Label>
                  <Input id="assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Technicien" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date planifiée</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Détails de l'incident…" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditorOpen(false)}>Annuler</Button>
              <Button type="submit">{editingId ? "Enregistrer" : "Créer le ticket"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail drawer */}
      <TicketDrawer
        ticket={detailTicket}
        onClose={() => setDetailId(null)}
        onEdit={(t) => {
          setDetailId(null);
          openEdit(t);
        }}
        onAddComment={addComment}
        onAddAttachments={addAttachments}
        onRemoveAttachment={removeAttachment}
        onStatusChange={quickStatus}
      />
    </>
  );
}

/* ---------- Views ---------- */

function ListView({ tickets, onOpen }: { tickets: Ticket[]; onOpen: (t: Ticket) => void }) {
  return (
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
            <tr
              key={t.id}
              onClick={() => onOpen(t)}
              className="cursor-pointer transition hover:bg-secondary/30"
            >
              <td className="px-5 py-4">
                <div className="font-mono text-xs text-muted-foreground">{t.id}</div>
                <div className="mt-0.5 font-medium text-foreground">{t.subject}</div>
              </td>
              <td className="px-5 py-4 text-muted-foreground">{t.client}</td>
              <td className="px-5 py-4">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityColor[t.priority]}`}>{t.priority}</span>
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[t.status]}`}>{t.status}</span>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground"><User className="h-3.5 w-3.5" />{t.assignee}</span>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{t.age}</span>
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                Aucun ticket ne correspond aux filtres.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BoardView({ tickets, onOpen }: { tickets: Ticket[]; onOpen: (t: Ticket) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATUSES.map((status) => {
        const items = tickets.filter((t) => t.status === status);
        return (
          <div key={status} className="flex flex-col rounded-2xl border border-border bg-secondary/30 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[status]}`}>{status}</span>
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onOpen(t)}
                  className="rounded-xl border border-border bg-background p-3 text-left shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${priorityColor[t.priority]}`}>{t.priority}</span>
                  </div>
                  <div className="mt-1.5 line-clamp-2 text-sm font-medium text-foreground">{t.subject}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t.client}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{t.assignee}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{t.date.slice(5)}</span>
                  </div>
                </button>
              ))}
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">Vide</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({
  tickets,
  onDayClick,
  onTicketClick,
}: {
  tickets: Ticket[];
  onDayClick: (dateIso: string) => void;
  onTicketClick: (t: Ticket) => void;
}) {
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const byDate = useMemo(() => {
    const m = new Map<string, Ticket[]>();
    for (const t of tickets) {
      const arr = m.get(t.date) ?? [];
      arr.push(t);
      m.set(t.date, arr);
    }
    return m;
  }, [tickets]);

  const todayIso = iso(new Date());

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-display text-lg font-semibold capitalize">{monthLabel}</div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
            Aujourd'hui
          </button>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-border">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="border-b border-r border-border bg-secondary/40 px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          const key = date ? iso(date) : `empty-${i}`;
          const items = date ? byDate.get(iso(date)) ?? [] : [];
          const isToday = date && iso(date) === todayIso;
          return (
            <div
              key={key}
              onClick={() => date && onDayClick(iso(date))}
              className={`group relative min-h-[104px] border-b border-r border-border p-1.5 align-top transition ${date ? "cursor-pointer hover:bg-secondary/40" : ""}`}
              title={date ? "Cliquer pour créer un ticket ce jour" : undefined}
            >
              {date && (
                <>
                  <div className="mb-1 flex items-center justify-between">
                    <div className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${isToday ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}>
                      {date.getDate()}
                    </div>
                    <Plus className="h-3 w-3 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col gap-1">
                    {items.slice(0, 3).map((t) => (
                      <button
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTicketClick(t);
                        }}
                        title={`${t.id} — ${t.subject}`}
                        className={`truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-medium ring-1 ring-inset transition hover:brightness-95 ${priorityColor[t.priority]}`}
                      >
                        {t.subject}
                      </button>
                    ))}
                    {items.length > 3 && (
                      <div className="text-[10px] text-muted-foreground">+{items.length - 3} de plus</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Detail drawer ---------- */

function TicketDrawer({
  ticket,
  onClose,
  onEdit,
  onAddComment,
  onAddAttachments,
  onRemoveAttachment,
  onStatusChange,
}: {
  ticket: Ticket | null;
  onClose: () => void;
  onEdit: (t: Ticket) => void;
  onAddComment: (id: string, text: string) => void;
  onAddAttachments: (id: string, files: FileList) => void;
  onRemoveAttachment: (id: string, attId: string) => void;
  onStatusChange: (id: string, s: Status) => void;
}) {
  const [comment, setComment] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const open = !!ticket;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        {ticket && (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border p-6 pb-4 text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-muted-foreground">{ticket.id}</div>
                  <SheetTitle className="mt-0.5 text-lg leading-snug">{ticket.subject}</SheetTitle>
                  <SheetDescription className="mt-1">{ticket.client}</SheetDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => onEdit(ticket)} className="shrink-0">
                  <Pencil className="h-3.5 w-3.5" /> Modifier
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityColor[ticket.priority]}`}>{ticket.priority}</span>
                <Select value={ticket.status} onValueChange={(v) => onStatusChange(ticket.id, v as Status)}>
                  <SelectTrigger className="h-7 w-auto gap-1 px-2 py-0 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" /> {ticket.assignee}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3" /> {ticket.date}
                </span>
              </div>
            </SheetHeader>

            <Tabs defaultValue="details" className="flex-1">
              <TabsList className="mx-6 mt-4 grid w-[calc(100%-3rem)] grid-cols-4">
                <TabsTrigger value="details"><FileText className="h-3.5 w-3.5" /> Détails</TabsTrigger>
                <TabsTrigger value="comments"><MessageSquare className="h-3.5 w-3.5" /> Commentaires</TabsTrigger>
                <TabsTrigger value="files"><Paperclip className="h-3.5 w-3.5" /> Fichiers</TabsTrigger>
                <TabsTrigger value="history"><HistoryIcon className="h-3.5 w-3.5" /> Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6 pt-4">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <Field label="Créé"><span className="text-muted-foreground">{ticket.age}</span></Field>
                  <Field label="Date planifiée"><span>{ticket.date}</span></Field>
                  <Field label="Client"><span>{ticket.client}</span></Field>
                  <Field label="Assigné"><span>{ticket.assignee}</span></Field>
                </dl>
                <div className="mt-6">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</div>
                  <p className="whitespace-pre-wrap rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                    {ticket.description?.trim() || <span className="text-muted-foreground">Aucune description.</span>}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="flex flex-col gap-3 p-6 pt-4">
                <div className="flex flex-col gap-3">
                  {ticket.comments.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      Aucun commentaire pour l'instant.
                    </div>
                  )}
                  {ticket.comments.map((c) => (
                    <div key={c.id} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{c.author}</span>
                        <span className="text-muted-foreground">{c.at}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{c.text}</p>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = comment.trim();
                    if (!v) return;
                    onAddComment(ticket.id, v);
                    setComment("");
                  }}
                  className="mt-2 flex flex-col gap-2 rounded-lg border border-border bg-background p-2"
                >
                  <Textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajouter un commentaire…"
                    className="min-h-0 border-0 shadow-none focus-visible:ring-0"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={!comment.trim()}>
                      <Send className="h-3.5 w-3.5" /> Publier
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="files" className="flex flex-col gap-3 p-6 pt-4">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length) {
                      onAddAttachments(ticket.id, e.target.files);
                      e.target.value = "";
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="w-fit">
                  <Paperclip className="h-3.5 w-3.5" /> Ajouter des fichiers
                </Button>
                <div className="flex flex-col gap-2">
                  {ticket.attachments.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      Aucune pièce jointe.
                    </div>
                  )}
                  {ticket.attachments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5 text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate">{a.name}</span>
                        <span className="text-xs text-muted-foreground">{formatBytes(a.size)}</span>
                      </div>
                      <button
                        onClick={() => onRemoveAttachment(ticket.id, a.id)}
                        className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="p-6 pt-4">
                <ol className="relative border-l border-border pl-4">
                  {ticket.history.map((h) => (
                    <li key={h.id} className="mb-4 last:mb-0">
                      <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary/60 ring-4 ring-background" />
                      <div className="text-xs text-muted-foreground">{h.at} — {h.author}</div>
                      <div className="text-sm text-foreground">{h.text}</div>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}
