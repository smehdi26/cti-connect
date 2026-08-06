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
  BarChart3,
  Users,
  Map,
  Bot,
  PanelLeft,
  PanelTop,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/cti-logo.png";
import { cn } from "@/lib/utils";
import { useNavPreferences } from "@/lib/nav-preferences";
import { ChatWidget } from "@/components/chat/ChatWidget";


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
  { to: "/dashboard/carte", label: "Carte", icon: Map, exact: false },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { to: "/dashboard/equipe", label: "Équipe", icon: Users, exact: false },
  { to: "/dashboard/chatbot", label: "Assistant IA", icon: Bot, exact: false },
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
  const { mode, collapsed, toggleMode, toggleCollapsed } = useNavPreferences();
  const side = mode === "side";
  const mini = side && collapsed;


  const toolbar = (
    <div className="ml-auto flex items-center gap-2">
      <div className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
        <Search className="h-4 w-4" />
        <input
          placeholder="Rechercher…"
          className="w-48 bg-transparent outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <button
        onClick={toggleMode}
        className="hidden md:inline-flex rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
        title={side ? "Navigation en haut" : "Navigation à gauche"}
        aria-label={side ? "Navigation en haut" : "Navigation à gauche"}
      >
        {side ? <PanelTop className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
      </button>

      {side && (
        <button
          onClick={toggleCollapsed}
          className="hidden md:inline-flex rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
          title={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
          aria-label={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      )}


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
          <DropdownMenuItem asChild className="justify-center text-sm text-[color:var(--brand-accent)]">
            <Link to="/dashboard/notifications">Voir toutes les notifications</Link>
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
          <DropdownMenuItem asChild>
            <Link to="/dashboard/profil">
              <User className="h-4 w-4" /> Mon profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/parametres">
              <Settings className="h-4 w-4" /> Paramètres
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleMode}>
            {side ? <PanelTop className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            {side ? "Navigation en haut" : "Navigation à gauche"}
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
  );

  const mobileNav = (
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
  );

  const brand = (
    <Link to="/dashboard" className="flex items-center gap-2">
      <img src={logo} alt="" className="h-8 w-8" width={32} height={32} />
      <span className="font-display text-base font-semibold tracking-tight">CTI-Network</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[color:var(--brand-soft)]/40">
      {/* Sidebar — always mounted so switching animates smoothly */}
      <aside
        aria-hidden={!side}
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-background/95 backdrop-blur transition-[width,transform,opacity] duration-300 ease-out md:flex",
          mini ? "w-[76px]" : "w-64",
          side ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-full opacity-0",
        )}
      >
        <div className={cn("flex h-16 items-center transition-all duration-300", mini ? "justify-center px-2" : "px-5")}>
          {mini ? (
            <Link to="/dashboard" aria-label="CTI-Network">
              <img src={logo} alt="" className="h-8 w-8" width={32} height={32} />
            </Link>
          ) : (
            brand
          )}
        </div>
        <div className={cn("px-3 pb-2 transition-opacity duration-200", mini && "opacity-0")}>
          <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
            Navigation
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              title={mini ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground",
                mini ? "justify-center px-0" : "px-3",
              )}
            >
              <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r-full bg-[color:var(--brand-accent)] transition-all group-data-[status=active]:h-5" />
              <item.icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "truncate transition-all duration-200",
                  mini && "w-0 opacity-0",
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-border p-3">
          <button
            onClick={toggleCollapsed}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg py-2 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
              mini ? "justify-center px-0" : "px-3",
            )}
            title={mini ? "Étendre la sidebar" : "Réduire la sidebar"}
          >
            {mini ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!mini && "Réduire la sidebar"}
          </button>
          <button
            onClick={toggleMode}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg py-2 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
              mini ? "justify-center px-0" : "px-3",
            )}
            title="Navigation en haut"
          >
            <PanelTop className="h-4 w-4" />
            {!mini && "Navigation en haut"}
          </button>
        </div>
      </aside>

      <div
        className={cn(
          "transition-[padding] duration-300 ease-out",
          side ? (mini ? "md:pl-[76px]" : "md:pl-64") : "md:pl-0",
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div
            className={cn(
              "flex h-16 items-center gap-6 px-6 transition-all duration-300",
              side ? "" : "mx-auto max-w-[1400px]",
            )}
          >
            <div className={cn(side && "md:hidden")}>{brand}</div>

            <nav
              className={cn(
                "hidden items-center gap-1 transition-all duration-300 md:flex",
                side && "pointer-events-none w-0 -translate-x-2 overflow-hidden opacity-0",
              )}
            >
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {toolbar}
          </div>

          {mobileNav}
        </header>

        <main className="mx-auto max-w-[1400px] px-6 py-8 transition-all duration-300 ease-out">
          <Outlet />
        </main>
      </div>

      <ChatWidget />
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
