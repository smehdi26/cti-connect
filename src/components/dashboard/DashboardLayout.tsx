import { Link, Outlet, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Ticket,
  Cpu,
  FileSignature,
  LogOut,
  Bell,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/cti-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/clients", label: "Clients", icon: Building2, exact: false },
  { to: "/dashboard/tickets", label: "Tickets", icon: Ticket, exact: false },
  { to: "/dashboard/equipements", label: "Équipements", icon: Cpu, exact: false },
  { to: "/dashboard/contrats", label: "Contrats", icon: FileSignature, exact: false },
] as const;

const notifications = [
  { type: "warn", title: "Alerte fibre optique", desc: "Site Sfax B — perte de signal", time: "il y a 12 min" },
  { type: "ok", title: "Installation VOIP finalisée", desc: "Société Générale — Tunis", time: "il y a 2 h" },
  { type: "info", title: "Nouveau ticket #4832", desc: "Coupure ligne DECT — 3ème étage", time: "il y a 3 h" },
  { type: "ok", title: "Maintenance préventive terminée", desc: "STEG — Poste analog. lot 12", time: "hier" },
];

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cti-theme") : null;
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("cti-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

export function DashboardLayout() {
  const router = useRouter();
  const { dark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-[color:var(--brand-soft)]/40">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-8" width={32} height={32} />
            <span className="font-display text-base font-semibold tracking-tight">
              CTI-Network
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <input
                placeholder="Rechercher…"
                className="w-48 bg-transparent outline-none placeholder:text-muted-foreground/60"
              />
            </div>

            <button
              onClick={toggle}
              className="rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
              title={dark ? "Thème clair" : "Thème sombre"}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--brand-accent)]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="rounded-full bg-[color:var(--brand-soft)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--brand-deep)]">
                    {notifications.length} nouvelles
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n, i) => (
                  <DropdownMenuItem key={i} className="items-start gap-2 py-2.5">
                    {n.type === "ok" && <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />}
                    {n.type === "warn" && <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />}
                    {n.type === "info" && <Info className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{n.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">{n.time}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-sm text-[color:var(--brand-accent)]">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition hover:opacity-90">
                  AB
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <div className="text-sm font-semibold text-foreground">Amine Ben Salah</div>
                  <div className="text-xs text-muted-foreground">amine@cti-network.tn</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4" /> Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4" /> Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggle}>
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {dark ? "Thème clair" : "Thème sombre"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.navigate({ to: "/login" })}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
