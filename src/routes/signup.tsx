import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Créer un compte — CTI-Network" },
      {
        name: "description",
        content: "Créez votre compte CTI-Network et accédez à nos solutions télécom.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const strength = getStrength(password);

  return (
    <AuthLayout
      title="Créer un compte."
      subtitle="Rejoignez CTI-Network et pilotez vos installations télécom en un endroit."
      footer={
        <span>
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Se connecter
          </Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom" icon={<User className="h-4 w-4" />} placeholder="Amine" required />
          <Field label="Nom" icon={<User className="h-4 w-4" />} placeholder="Ben Ali" required />
        </div>

        <Field
          label="Entreprise"
          icon={<Building2 className="h-4 w-4" />}
          placeholder="Nom de votre société"
        />

        <Field
          label="Adresse e-mail professionnelle"
          icon={<Mail className="h-4 w-4" />}
          type="email"
          placeholder="vous@entreprise.tn"
          autoComplete="email"
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Mot de passe</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="8 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-input bg-background pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-[color:var(--brand-accent)] focus:ring-4 focus:ring-[color:var(--brand-accent)]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password && (
            <div className="pt-1">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        i < strength.score
                          ? strength.color
                          : "color-mix(in oklab, var(--brand-deep) 10%, transparent)",
                    }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{strength.label}</p>
            </div>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-input accent-[color:var(--brand-deep)]"
          />
          <span>
            J'accepte les{" "}
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              conditions d'utilisation
            </a>{" "}
            et la{" "}
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              politique de confidentialité
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-95 active:scale-[0.99]"
        >
          Créer mon compte
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>

        <ul className="grid gap-2 pt-2 text-xs text-muted-foreground">
          {[
            "Accompagnement dès l'étude d'infrastructure",
            "Suivi périodique et maintenance préventive",
            "Solutions évolutives adaptées à votre entreprise",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </form>
    </AuthLayout>
  );
}

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Trop court", color: "oklch(0.6 0.22 27)" },
    { label: "Faible", color: "oklch(0.7 0.17 50)" },
    { label: "Correct", color: "oklch(0.75 0.15 85)" },
    { label: "Bon", color: "oklch(0.65 0.15 160)" },
    { label: "Excellent", color: "oklch(0.6 0.15 160)" },
  ];
  return { score, ...map[score] };
}

function Field({
  label,
  icon,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          {...props}
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-[color:var(--brand-accent)] focus:ring-4 focus:ring-[color:var(--brand-accent)]/15"
        />
      </div>
    </div>
  );
}
