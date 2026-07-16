import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/auth-hero.jpg";
import logo from "@/assets/cti-logo.png";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside
        className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white"
        style={{ background: "var(--gradient-brand)" }}
      >
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--brand-deep) 85%, transparent) 0%, color-mix(in oklab, var(--brand-mid) 55%, transparent) 100%)",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20">
            <img src={logo} alt="CTI-Network" className="h-8 w-8" width={32} height={32} />
          </div>
          <div className="font-display text-lg font-semibold tracking-tight">
            CTI-Network
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-soft)]" />
            Depuis 2008 · Tunisie
          </div>
          <h1 className="font-display text-4xl xl:text-5xl font-semibold leading-[1.05] tracking-tight">
            Télécommunications,{" "}
            <span className="text-[color:var(--brand-soft)]">réseaux</span> et sécurité —
            pensés pour votre entreprise.
          </h1>
          <p className="text-base text-white/75 leading-relaxed">
            Téléphonie IP, câblage VDI, fibre optique, WIFI, applicatifs CTI et solutions
            de sécurité. Une équipe d'ingénieurs et de techniciens forte de plus de 15 ans
            d'expertise.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { k: "15+", v: "ans d'expertise" },
              { k: "500+", v: "installations" },
              { k: "5", v: "partenaires majeurs" },
              { k: "24/7", v: "support & maintenance" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
              >
                <div className="font-display text-2xl font-semibold text-white">
                  {s.k}
                </div>
                <div className="text-xs text-white/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs text-white/50">
          <span className="uppercase tracking-[0.2em]">Partenaires</span>
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-display text-sm font-medium text-white/70">
            <span>GIGASET</span>
            <span>NEC</span>
            <span>UNIFY</span>
            <span>MATRIX</span>
            <span>MYFAX</span>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-background px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden mb-8 inline-flex items-center gap-2 font-display text-base font-semibold"
          >
            <img src={logo} alt="" className="h-7 w-7" width={28} height={28} />
            CTI-Network
          </Link>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </main>
    </div>
  );
}
