import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import {
  Bell,
  Moon,
  Sun,
  Lock,
  Globe,
  Save,
  Trash2,
  SlidersHorizontal,
  Building2,
  Plug,
  ShieldCheck,
  Smartphone,
  Monitor,
  KeyRound,
  Bot,
  Check,
  Download,
  PanelLeft,
  PanelTop,
} from "lucide-react";
import { useNavPreferences } from "@/lib/nav-preferences";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres du compte — CTI-Network" },
      {
        name: "description",
        content:
          "Gérez l'organisation, l'apparence, les notifications, la sécurité et les intégrations de votre espace CTI-Network.",
      },
      { property: "og:title", content: "Paramètres du compte — CTI-Network" },
      {
        property: "og:description",
        content: "Préférences, sécurité et intégrations de l'espace client CTI-Network.",
      },
    ],
  }),
  component: ParametresPage,
});

type TabId = "general" | "apparence" | "notifications" | "securite" | "integrations";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "general", label: "Organisation", icon: Building2 },
  { id: "apparence", label: "Apparence & région", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "securite", label: "Sécurité", icon: ShieldCheck },
  { id: "integrations", label: "Intégrations", icon: Plug },
];

function Card({
  icon: Icon,
  title,
  description,
  children,
  footer,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex items-start gap-3 border-b border-border px-6 py-5">
        <span className="rounded-lg bg-[color:var(--brand-soft)] p-2 text-[color:var(--brand-deep)]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-5 px-6 py-5">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 border-t border-border bg-secondary/40 px-6 py-3">
          {footer}
        </div>
      )}
    </section>
  );
}

function Row({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-4 py-3">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

const SESSIONS = [
  { device: "MacBook Pro — Tunis", detail: "Chrome · 41.230.x.x", time: "Session actuelle", icon: Monitor },
  { device: "iPhone 14 — Sfax", detail: "Safari · dernier accès hier", time: "Actif", icon: Smartphone },
];

function ParametresPage() {
  const [tab, setTab] = useState<TabId>("general");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const [org, setOrg] = useState({
    name: "CTI-Network",
    matricule: "1234567/A",
    email: "contact@cti-network.tn",
    phone: "+216 71 000 000",
    address: "Immeuble Yasmine, Tunis",
  });
  const [notif, setNotif] = useState({ email: true, alertes: true, hebdo: false, contrats: true, sms: false });
  const [langue, setLangue] = useState("fr");
  const [fuseau, setFuseau] = useState("Africa/Tunis");
  const [dateFmt, setDateFmt] = useState("dd/MM/yyyy");
  const [density, setDensity] = useState("confort");
  const [twoFa, setTwoFa] = useState(true);
  const [assistant, setAssistant] = useState({ widget: true, suggestions: true });

  const setTheme = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("cti-theme", next ? "dark" : "light");
  };

  const saved = () => toast.success("Paramètres enregistrés");

  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Configuration de l'organisation, des préférences et de la sécurité."
        action={
          <Button onClick={saved}>
            <Save className="h-4 w-4" /> Enregistrer
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-border bg-background p-2 lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  tab === t.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          {tab === "general" && (
            <Card
              icon={Building2}
              title="Profil de l'organisation"
              description="Informations utilisées sur les rapports, devis et exports PDF."
              footer={
                <Button size="sm" onClick={saved}>
                  <Check className="h-4 w-4" /> Enregistrer
                </Button>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Raison sociale</Label>
                  <Input
                    id="org-name"
                    value={org.name}
                    onChange={(e) => setOrg((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-mat">Matricule fiscal</Label>
                  <Input
                    id="org-mat"
                    value={org.matricule}
                    onChange={(e) => setOrg((p) => ({ ...p, matricule: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-mail">Email de contact</Label>
                  <Input
                    id="org-mail"
                    type="email"
                    value={org.email}
                    onChange={(e) => setOrg((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-tel">Téléphone</Label>
                  <Input
                    id="org-tel"
                    value={org.phone}
                    onChange={(e) => setOrg((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="org-adr">Adresse du siège</Label>
                  <Input
                    id="org-adr"
                    value={org.address}
                    onChange={(e) => setOrg((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </div>
            </Card>
          )}

          {tab === "apparence" && (
            <>
              <Card
                icon={dark ? Moon : Sun}
                title="Apparence"
                description="Thème et densité d'affichage des tableaux."
              >
                <Row
                  label="Thème sombre"
                  hint="Réduit la fatigue visuelle en supervision de nuit."
                  checked={dark}
                  onCheckedChange={setTheme}
                />
                <div className="space-y-2">
                  <Label>Densité d'affichage</Label>
                  <Select value={density} onValueChange={setDensity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confort">Confortable</SelectItem>
                      <SelectItem value="compact">Compacte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <Card
                icon={navMode === "side" ? PanelLeft : PanelTop}
                title="Position de la navigation"
                description="Choisissez une barre en haut ou une sidebar à gauche. Votre choix est mémorisé."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { id: "top" as const, label: "Barre en haut", hint: "Navigation horizontale, contenu pleine largeur." },
                      { id: "side" as const, label: "Sidebar à gauche", hint: "Navigation verticale, réductible en mode icônes." },
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setNavMode(opt.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all duration-200 hover:border-[color:var(--brand-accent)]/60",
                        navMode === opt.id
                          ? "border-[color:var(--brand-accent)] bg-[color:var(--brand-soft)]/60 shadow-sm"
                          : "border-border bg-background",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {opt.id === "top" ? (
                          <div className="w-full max-w-[96px] space-y-1 rounded-md border border-border p-1.5">
                            <div className="h-2 rounded bg-[color:var(--brand-accent)]/70" />
                            <div className="h-6 rounded bg-secondary" />
                          </div>
                        ) : (
                          <div className="flex w-full max-w-[96px] gap-1 rounded-md border border-border p-1.5">
                            <div className="w-3 rounded bg-[color:var(--brand-accent)]/70" />
                            <div className="h-9 flex-1 rounded bg-secondary" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                        {opt.label}
                        {navMode === opt.id && <Check className="h-4 w-4 text-[color:var(--brand-accent)]" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{opt.hint}</div>
                    </button>
                  ))}
                </div>

                <Row
                  label="Sidebar réduite (mode icônes)"
                  hint={
                    navMode === "side"
                      ? "Affiche uniquement les icônes pour gagner de l'espace."
                      : "Disponible lorsque la navigation est à gauche."
                  }
                  checked={navCollapsed}
                  onCheckedChange={setNavCollapsed}
                />
              </Card>



              <Card
                icon={Globe}
                title="Langue et région"
                description="Langue d'affichage, fuseau horaire et format des dates."
                footer={
                  <Button size="sm" variant="outline" onClick={saved}>
                    Appliquer
                  </Button>
                }
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Langue</Label>
                    <Select value={langue} onValueChange={setLangue}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fuseau horaire</Label>
                    <Select value={fuseau} onValueChange={setFuseau}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Tunis">Tunis (GMT+1)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (GMT+2)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Format de date</Label>
                    <Select value={dateFmt} onValueChange={setDateFmt}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">31/12/2025</SelectItem>
                        <SelectItem value="yyyy-MM-dd">2025-12-31</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </>
          )}

          {tab === "notifications" && (
            <Card
              icon={Bell}
              title="Préférences de notification"
              description="Canaux et événements suivis par votre compte."
              footer={
                <Button size="sm" onClick={saved}>
                  <Check className="h-4 w-4" /> Enregistrer
                </Button>
              }
            >
              <Row
                label="Notifications par email"
                hint="Résumé des mises à jour de vos tickets."
                checked={notif.email}
                onCheckedChange={(v) => setNotif((p) => ({ ...p, email: v }))}
              />
              <Row
                label="Alertes techniques critiques"
                hint="Pannes, coupures fibre, équipements hors ligne."
                checked={notif.alertes}
                onCheckedChange={(v) => setNotif((p) => ({ ...p, alertes: v }))}
              />
              <Row
                label="Échéances de contrats"
                hint="Rappel avant chaque visite préventive et renouvellement."
                checked={notif.contrats}
                onCheckedChange={(v) => setNotif((p) => ({ ...p, contrats: v }))}
              />
              <Row
                label="SMS d'astreinte"
                hint="Pour les incidents Urgent hors heures ouvrables."
                checked={notif.sms}
                onCheckedChange={(v) => setNotif((p) => ({ ...p, sms: v }))}
              />
              <Row
                label="Rapport hebdomadaire"
                hint="Synthèse des interventions chaque lundi matin."
                checked={notif.hebdo}
                onCheckedChange={(v) => setNotif((p) => ({ ...p, hebdo: v }))}
              />
            </Card>
          )}

          {tab === "securite" && (
            <>
              <Card
                icon={Lock}
                title="Mot de passe"
                description="Utilisez au moins 12 caractères avec chiffres et symboles."
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Mot de passe mis à jour");
                  }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="current">Mot de passe actuel</Label>
                    <Input id="current" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next">Nouveau mot de passe</Label>
                    <Input id="next" type="password" placeholder="••••••••" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" variant="outline">
                      <KeyRound className="h-4 w-4" /> Mettre à jour
                    </Button>
                  </div>
                </form>
              </Card>

              <Card
                icon={ShieldCheck}
                title="Authentification & sessions"
                description="Renforcez l'accès et surveillez les appareils connectés."
              >
                <Row
                  label="Double authentification (2FA)"
                  hint="Code à usage unique envoyé sur votre mobile."
                  checked={twoFa}
                  onCheckedChange={setTwoFa}
                />
                <ul className="divide-y divide-border rounded-lg border border-border/60">
                  {SESSIONS.map((s) => (
                    <li key={s.device} className="flex items-center gap-3 px-4 py-3">
                      <s.icon className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-foreground">{s.device}</div>
                        <div className="text-xs text-muted-foreground">{s.detail}</div>
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">{s.time}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Toutes les autres sessions ont été déconnectées")}
                >
                  Déconnecter les autres appareils
                </Button>
              </Card>
            </>
          )}

          {tab === "integrations" && (
            <>
              <Card
                icon={Bot}
                title="Assistant IA"
                description="Comportement de l'Assistant CTI dans l'application."
              >
                <Row
                  label="Widget flottant"
                  hint="Affiche l'assistant en bas à droite sur toutes les pages."
                  checked={assistant.widget}
                  onCheckedChange={(v) => setAssistant((p) => ({ ...p, widget: v }))}
                />
                <Row
                  label="Suggestions de questions"
                  hint="Propose des questions fréquentes au démarrage d'une conversation."
                  checked={assistant.suggestions}
                  onCheckedChange={(v) => setAssistant((p) => ({ ...p, suggestions: v }))}
                />
              </Card>

              <Card
                icon={Plug}
                title="Connecteurs & données"
                description="Accès agents (MCP) et export de vos données."
              >
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">Serveur MCP · /mcp</div>
                    <div className="text-xs text-muted-foreground">
                      Outils lecture seule : clients, tickets, équipements, contrats.
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                    Actif
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Export des données demandé — vous recevrez un email")}
                >
                  <Download className="h-4 w-4" /> Exporter mes données
                </Button>
              </Card>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Supprimer le compte
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Action irréversible : accès aux tickets, contrats et historiques supprimé.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => toast.error("Contactez votre gestionnaire de compte CTI-Network")}
                >
                  <Trash2 className="h-4 w-4" /> Supprimer
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
