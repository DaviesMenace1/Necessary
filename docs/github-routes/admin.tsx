import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Package, Inbox, FileText, Users, Settings, LogOut, Images } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — The Revamp UG" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/catalog", label: "Catalog", icon: Package },
  { to: "/admin/studio", label: "Studio", icon: Images },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { user, loading, isAdmin, roles } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const canAccessAdmin = isAdmin || roles.includes("editor");
  const adminOnlyPaths = ["/admin/inquiries", "/admin/team", "/admin/settings"];

  useEffect(() => {
    if (!loading && canAccessAdmin && !isAdmin && adminOnlyPaths.some((path) => pathname.startsWith(path))) {
      navigate({ to: "/admin" });
    }
  }, [loading, canAccessAdmin, isAdmin, pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-canvas">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) {
    throw redirect({ to: "/login" });
  }

  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-canvas px-6">
        <div className="max-w-md text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-3">Access denied</p>
          <h1 className="font-serif text-3xl">You don't have team access.</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Signed in as <span className="font-medium">{user.email}</span>. Ask the top admin to
            invite you.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
            className="mt-6 text-xs uppercase tracking-[0.2em] text-gilded hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex">
      <aside className="w-64 shrink-0 border-r border-border bg-background sticky top-0 h-screen flex flex-col">
        <div className="px-6 py-6 border-b border-border">
          <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-gilded">
            The Revamp UG
          </Link>
          <p className="font-serif text-xl mt-1">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.filter((item) => isAdmin || !adminOnlyPaths.includes(item.to)).map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: !!exact }}
              activeProps={{ className: "bg-muted text-foreground" }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-border">
          <div className="px-3 pb-3 text-xs text-muted-foreground truncate">{user.email}</div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
