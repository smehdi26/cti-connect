import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Bell, Moon, Sun, Lock, Globe, Save, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/dashboard/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — CTI-Network" },
      { name: "description", content: "Gérez vos préférences d'affichage, vos notifications, la langue et la sécurité de votre compte." },
      { property: "og:title", content: "Paramètres — CTI-Network" },
      { property: "og:description", content: "Préférences du compte de l'espace client CTI-Network." },
    ],
  }),
  component: ParametresPage,
});

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-background p-6">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-[color:var(--brand-soft)] p-2 text-[color:var(--brand-deep)]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Toggle({
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
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ParametresPage() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const [notif, setNotif] = useState({ email: true, alertes: true, hebdo: false, contrats: true });
  const [langue, setLangue] = useState("fr");
  const [fuseau, setFuseau] = useState("Africa/Tunis");

  const setTheme = (next: boolean) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("cti-theme", next ? "dark" : "light");
  };

  return (
    <>
      <PageHeader title="Paramètres" description="Personnalisez votre espace client CTI-Network." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section icon={dark ? Moon : Sun} title="Apparence" description="Thème de l'interface.">
          <Toggle
            label="Thème sombre"
            hint="Réduit la fatigue visuelle en supervision de nuit."
            checked={dark}
            onCheckedChange={setTheme}
          />
        </Section>

        <Section icon={Globe} title="Langue et région" description="Format des dates et langue d'affichage.">
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
        </Section>

        <Section icon={Bell} title="Notifications" description="Choisissez ce que vous souhaitez recevoir.">
          <Toggle
            label="Notifications par email"
            hint="Résumé des mises à jour de vos tickets."
            checked={notif.email}
            onCheckedChange={(v) => setNotif((p) => ({ ...p, email: v }))}
          />
          <Toggle
            label="Alertes techniques"
            hint="Pannes, coupures fibre, équipements hors ligne."
            checked={notif.alertes}
            onCheckedChange={(v) => setNotif((p) => ({ ...p, alertes: v }))}
          />
          <Toggle
            label="Échéances de contrats"
            hint="Rappel avant chaque visite préventive et renouvellement."
            checked={notif.contrats}
            onCheckedChange={(v) => setNotif((p) => ({ ...p, contrats: v }))}
          />
          <Toggle
            label="Rapport hebdomadaire"
            hint="Synthèse des interventions chaque lundi."
            checked={notif.hebdo}
            onCheckedChange={(v) => setNotif((p) => ({ ...p, hebdo: v }))}
          />
        </Section>

        <Section icon={Lock} title="Sécurité" description="Mot de passe et accès au compte.">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Mot de passe mis à jour");
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="current">Mot de passe actuel</Label>
              <Input id="current" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next">Nouveau mot de passe</Label>
              <Input id="next" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" variant="outline" className="w-full">
              Mettre à jour le mot de passe
            </Button>
          </form>
        </Section>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">Supprimer le compte</h3>
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible et supprime l'accès à vos tickets et contrats.
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

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Paramètres enregistrés")}>
          <Save className="h-4 w-4" /> Enregistrer les préférences
        </Button>
      </div>
    </>
  );
}
