import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listCatalog } from "@/lib/catalog.functions";
import { inquiryStats } from "@/lib/inquiries.functions";
import { seedCatalog } from "@/lib/seed.functions";
import { useAuth } from "@/hooks/use-auth";
import { Package, Inbox, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { isAdmin } = useAuth();
  const fetchCatalog = useServerFn(listCatalog);
  const fetchStats = useServerFn(inquiryStats);
  const runSeed = useServerFn(seedCatalog);
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin-catalog"],
    queryFn: () => fetchCatalog(),
  });
  const { data: stats } = useQuery({
    queryKey: ["admin-inquiry-stats"],
    queryFn: () => fetchStats(),
    enabled: isAdmin,
  });
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  const cards = [
    { label: "Catalog items", value: items.length, icon: Package, to: "/admin/catalog" },
    {
      label: "Featured pieces",
      value: items.filter((i) => i.featured).length,
      icon: Sparkles,
      to: "/admin/catalog",
    },
    ...(isAdmin
      ? [
          { label: "Open inquiries", value: stats?.open ?? "—", icon: Inbox, to: "/admin/inquiries" },
          { label: "Won", value: stats?.won ?? "—", icon: Trophy, to: "/admin/inquiries" },
        ]
      : []),
  ];

  return (
    <div className="px-10 py-12 max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">Overview</p>
          <h1 className="font-serif text-4xl">Dashboard</h1>
        </div>
        {isAdmin && items.length === 0 && (
          <button
            disabled={seeding}
            onClick={async () => {
              setSeeding(true);
              setSeedMsg(null);
              try {
                const r = await runSeed();
                setSeedMsg(`Seeded ${r.inserted} items.`);
                refetch();
              } catch (e) {
                setSeedMsg(e instanceof Error ? e.message : "Failed");
              } finally {
                setSeeding(false);
              }
            }}
            className="bg-obsidian text-canvas px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
          >
            {seeding ? "Seeding…" : "Seed catalog from code"}
          </button>
        )}
      </div>

      {seedMsg && (
        <div className="mb-6 px-4 py-3 rounded-md bg-muted text-sm">{seedMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="block border border-border rounded-lg p-6 hover:bg-muted/40 transition-colors"
          >
            <s.icon className="w-5 h-5 text-gilded mb-4" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {s.label}
            </p>
            <p className="font-serif text-3xl mt-2">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 border border-border rounded-lg p-8">
        <h2 className="font-serif text-2xl mb-2">Get started</h2>
        <ol className="text-sm text-muted-foreground space-y-2 mt-4 list-decimal pl-5">
          <li>
            Run the SQL file in <code className="text-foreground">db/0001_init_admin.sql</code> in
            your Supabase SQL Editor (one-time).
          </li>
          <li>
            Sign up once with <span className="font-medium">daviesmusinguzi@gmail.com</span> — the
            DB trigger promotes that email to admin automatically.
          </li>
          <li>Click "Seed catalog from code" above to import the existing 26 pieces.</li>
          <li>Manage your catalog under Catalog, and check Inquiries as they come in.</li>
        </ol>
      </div>
    </div>
  );
}
