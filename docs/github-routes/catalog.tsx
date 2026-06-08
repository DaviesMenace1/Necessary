import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CATALOG,
  CATEGORIES,
  MANUFACTURERS,
  type Category,
  type Manufacturer,
  type CatalogItem,
} from "@/data/catalog";
import { listCatalog, type CatalogRow } from "@/lib/catalog.functions";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Collections — The Revamp UG" },
      {
        name: "description",
        content:
          "Browse our curated catalog of luxury furniture and lighting. Filter by category or by maison — Boca do Lobo, Fendi Casa, Dolce & Gabbana Casa, Versace Home and more.",
      },
      { property: "og:title", content: "Collections — The Revamp UG" },
      {
        property: "og:description",
        content: "Curated pieces from the world's most storied design houses.",
      },
    ],
  }),
  component: CatalogPage,
});

type DisplayItem = CatalogItem & { dbId?: string };

function rowsToItems(rows: CatalogRow[]): DisplayItem[] {
  return rows.map((r) => ({
    id: r.slug,
    dbId: r.id,
    name: r.name,
    manufacturer: r.manufacturer,
    category: r.category,
    image: r.image_url ?? "",
    blurb: r.blurb,
    status: r.status,
    price: r.price ?? null,
    feature: r.featured,
  }));
}

function CatalogPage() {
  const fetchCatalog = useServerFn(listCatalog);
  const { data: rows } = useQuery({
    queryKey: ["public-catalog"],
    queryFn: () => fetchCatalog(),
  });

  const items: DisplayItem[] = useMemo(() => {
    if (rows && rows.length > 0) return rowsToItems(rows);
    return CATALOG as DisplayItem[];
  }, [rows]);

  const [category, setCategory] = useState<Category>("All Artifacts");
  const [manufacturer, setManufacturer] = useState<Manufacturer>("All Ateliers");
  const [active, setActive] = useState<DisplayItem | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (category === "All Artifacts" || i.category === category) &&
          (manufacturer === "All Ateliers" || i.manufacturer === manufacturer),
      ),
    [items, category, manufacturer],
  );

  return (
    <>
      <section className="pt-16 pb-12 px-6 lg:px-12 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-gilded" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
              The Archive
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[1.05] text-balance max-w-4xl">
            Every piece, <span className="italic">individually</span> sourced.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg">
            A rotating selection from our atelier partners across Italy, Portugal and France. Each
            item is available to commission, import, and install.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-56 shrink-0">
            <div className="sticky top-28 space-y-12">
              <div className="space-y-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gilded">
                  By Category
                </h3>
                <div className="flex flex-wrap lg:flex-col gap-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`text-sm text-left transition-colors ${
                        category === c
                          ? "text-foreground font-medium border-b-2 border-gilded pb-0.5 self-start"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gilded">
                  The Ateliers
                </h3>
                <div className="flex flex-wrap lg:flex-col gap-3">
                  {MANUFACTURERS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setManufacturer(m)}
                      className={`text-sm text-left transition-colors ${
                        manufacturer === m
                          ? "text-foreground font-medium border-b-2 border-gilded pb-0.5 self-start"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {(category !== "All Artifacts" || manufacturer !== "All Ateliers") && (
                <button
                  onClick={() => {
                    setCategory("All Artifacts");
                    setManufacturer("All Ateliers");
                  }}
                  className="text-[11px] uppercase tracking-[0.2em] text-gilded hover:text-foreground transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-end justify-between mb-10 border-b border-border pb-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {filtered.length} piece{filtered.length === 1 ? "" : "s"}
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {category} <span className="text-gilded">/</span> {manufacturer}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="py-32 text-center">
                <p className="font-serif text-3xl italic mb-3">Nothing matches that pairing.</p>
                <p className="text-muted-foreground text-sm">
                  Try clearing a filter, or request a bespoke source.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filtered.map((item) => (
                  <article
                    key={item.dbId ?? item.id}
                    className="group cursor-pointer text-left"
                    onClick={() => setActive(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="relative overflow-hidden mb-6 rounded-md bg-muted">
                      <img
                        src={item.image}
                        alt={`${item.name} by ${item.manufacturer}`}
                        width={800}
                        height={1000}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-canvas/95 backdrop-blur px-3 py-1 text-[9px] font-semibold uppercase tracking-widest ring-1 ring-border">
                          {item.status}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-colors flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                        <span className="bg-canvas text-obsidian px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full">
                          View details
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gilded mb-1.5">
                          {item.manufacturer}
                        </p>
                        <h3 className="font-serif text-xl font-medium leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {item.blurb}
                        </p>
                        {item.price && (
                          <p className="text-sm font-medium text-foreground mt-3">
                            {item.price}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {item.category}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ProductDialog item={active} onClose={() => setActive(null)} />
    </>
  );
}

function ProductDialog({ item, onClose }: { item: DisplayItem | null; onClose: () => void }) {
  const specs = item ? buildSpecs(item) : [];
  const waText = item
    ? encodeURIComponent(
        `Hello Revamp — I'd like to inquire about the ${item.name} by ${item.manufacturer} (ref: ${item.id}).`,
      )
    : "";

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-canvas border-border max-h-[92vh] overflow-y-auto">
        {item && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative bg-muted">
              <img
                src={item.image}
                alt={`${item.name} by ${item.manufacturer}`}
                className="w-full h-full object-cover aspect-[4/5] md:aspect-auto md:min-h-[600px]"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-canvas/95 backdrop-blur px-3 py-1 text-[9px] font-semibold uppercase tracking-widest ring-1 ring-border">
                  {item.status}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-3">
                {item.manufacturer}
              </p>
              <DialogTitle className="font-serif text-3xl md:text-4xl font-medium leading-tight">
                {item.name}
              </DialogTitle>
              <DialogDescription className="mt-4 text-base text-muted-foreground leading-relaxed">
                {item.blurb}
              </DialogDescription>

              <div className="mt-8 border-t border-border pt-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded mb-4">
                  Specifications
                </h4>
                <dl className="divide-y divide-border">
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 py-2.5">
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="text-sm text-foreground text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8 bg-muted/60 rounded-md p-4 text-xs text-muted-foreground leading-relaxed">
                Lead times: 8–16 weeks for available pieces, 16–28 weeks for bespoke commissions.
                White-glove import, delivery and installation included within Kampala.
              </div>

              <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  search={{
                    item: item.dbId ?? undefined,
                    name: item.name,
                    maker: item.manufacturer,
                  }}
                  onClick={onClose}
                  className="flex-1 bg-obsidian text-canvas py-3.5 px-6 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 text-center"
                >
                  Request this piece
                </Link>
                <a
                  href={`https://wa.me/256703861668?text=${waText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 border border-border text-foreground py-3.5 px-6 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-muted text-center inline-flex items-center justify-center gap-2"
                >
                  WhatsApp
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function buildSpecs(item: DisplayItem): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Atelier", item.manufacturer],
    ["Category", item.category],
    ["Reference", item.id.toUpperCase()],
    ["Origin", originFor(item.manufacturer)],
    ["Availability", item.status],
    [
      "Customisation",
      item.status === "Bespoke commission" ? "Made to order" : "Finishes on request",
    ],
  ];
  if (item.price) rows.splice(4, 0, ["Price", item.price]);
  return rows;
}

function originFor(m: string): string {
  switch (m) {
    case "Boca do Lobo":
      return "Porto, Portugal";
    case "Bentley Home":
      return "Cantù, Italy";
    case "Visionnaire":
    case "Minotti":
    case "Fendi Casa":
    case "Versace Home":
    case "Roberto Cavalli Home":
    case "Dolce & Gabbana Casa":
      return "Italy";
    default:
      return "Europe";
  }
}
