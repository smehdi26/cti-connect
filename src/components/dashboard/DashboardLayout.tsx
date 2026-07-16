import { Link, Outlet, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Ticket, Cpu, LogOut, Bell, Search } from "lucide-react";
import logo from "@/assets/cti-logo.png";

const nav = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/clients", label: "Clients", icon: Building2, exact: false },
  { to: "/dashboard/tickets", label: "Tickets", icon: Ticket, exact: false },
  { to: "/dashboard/equipements", label: "Équipements", icon: Cpu, exact: false },
] as const;

export function DashboardLayout() {
  const router = useRouter();

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
            <button className="relative rounded-lg border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--brand-accent)]" />
            </button>
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              AB
            </div>
            <button
              onClick={() => router.navigate({ to: "/login" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
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
