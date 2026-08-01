import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardLayout";
import { Mail, Phone, MapPin, Building2, Shield, Save, Ticket, FileSignature, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — CTI-Network" },
      { name: "description", content: "Consultez et modifiez vos informations personnelles, votre entreprise et vos coordonnées." },
      { property: "og:title", content: "Mon profil — CTI-Network" },
      { property: "og:description", content: "Profil utilisateur de l'espace client CTI-Network." },
    ],
  }),
  component: ProfilPage,
});

const stats = [
  { label: "Tickets ouverts", value: "3", icon: Ticket, to: "/dashboard/tickets" as const },
  { label: "Équipements suivis", value: "128", icon: Cpu, to: "/dashboard/equipements" as const },
  { label: "Contrats actifs", value: "2", icon: FileSignature, to: "/dashboard/contrats" as const },
];

function ProfilPage() {
  const [form, setForm] = useState({
    prenom: "Amine",
    nom: "Ben Salah",
    email: "amine@cti-network.tn",
    tel: "+216 71 000 000",
    poste: "Responsable technique",
    entreprise: "Société Générale Tunisie",
    adresse: "Immeuble Le Dôme, Les Berges du Lac, Tunis",
    bio: "Responsable de l'infrastructure télécom et réseau du siège et des agences régionales.",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <>
      <PageHeader title="Mon profil" description="Vos informations personnelles et professionnelles." />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              {form.prenom[0]}
              {form.nom[0]}
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              {form.prenom} {form.nom}
            </h2>
            <p className="text-sm text-muted-foreground">{form.poste}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
              <Shield className="h-3.5 w-3.5" /> Compte vérifié
            </span>

            <dl className="mt-6 space-y-3 text-left text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0" /> {form.entreprise}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" /> {form.email}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" /> {form.tel}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {form.adresse}
              </div>
            </dl>
          </div>

          <div className="grid gap-3">
            {stats.map((s) => (
              <Link
                key={s.label}
                to={s.to}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition hover:bg-secondary"
              >
                <s.icon className="h-5 w-5 text-[color:var(--brand-accent)]" />
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="ml-auto font-display text-lg font-semibold text-foreground">{s.value}</span>
              </Link>
            ))}
          </div>
        </aside>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Profil mis à jour");
          }}
          className="space-y-6 rounded-2xl border border-border bg-background p-6"
        >
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Informations personnelles</h3>
            <p className="text-sm text-muted-foreground">Ces informations apparaissent sur vos tickets et rapports.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" value={form.prenom} onChange={(e) => set("prenom")(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={form.nom} onChange={(e) => set("nom")(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Téléphone</Label>
              <Input id="tel" value={form.tel} onChange={(e) => set("tel")(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poste">Poste</Label>
              <Input id="poste" value={form.poste} onChange={(e) => set("poste")(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entreprise">Entreprise</Label>
              <Input id="entreprise" value={form.entreprise} onChange={(e) => set("entreprise")(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="adresse">Adresse du site principal</Label>
              <Input id="adresse" value={form.adresse} onChange={(e) => set("adresse")(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Présentation</Label>
              <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => set("bio")(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={() => toast("Modifications annulées")}>
              Annuler
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" /> Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
