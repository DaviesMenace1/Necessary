import { createFileRoute, Link } from "@tanstack/react-router";
import heroVilla from "@/assets/hero-villa.jpg";
import featureConsole from "@/assets/feature-console.jpg";
import { CATALOG } from "@/data/catalog";
import { usePageContent } from "@/lib/page-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Revamp UG — Luxury Interior Sourcing & Architecture in Kampala" },
      {
        name: "description",
        content:
          "Uganda's premier gateway to European master-craftsmanship and bespoke architecture. Sourcing, importing, installing and designing iconic interiors from Boca do Lobo, Fendi Casa, D&G Casa and more.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = CATALOG.slice(1, 4);
  const { image, title, body, blocks } = usePageContent("home");
  const heroImg = image("hero", 0, heroVilla);
  const featureImg = image("feature", 0, featureConsole);
  const ethos1 = image("ethos", 0, featureConsole);
  const ethos2 = image("ethos", 1, heroVilla);
  const customBlocks = blocks("block");

  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end gap-16">
            <div className="w-full lg:w-3/5">
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="h-px w-8 bg-gilded" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
                  Sourcing Excellence
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl leading-[1.05] text-balance mb-8 font-medium whitespace-pre-line">
                {title(
                  "hero",
                  "The architecture\nof refined living.",
                )}
              </h1>
              <p className="max-w-[48ch] text-lg md:text-xl text-muted-foreground text-pretty mb-12 whitespace-pre-line">
                {body(
                  "hero",
                  "Uganda's premier gateway to European master-craftsmanship and bespoke architecture. We source, design, import and install the extraordinary.",
                )}
              </p>
              <div className="flex items-center gap-8">
                <Link
                  to="/catalog"
                  className="group flex items-center gap-3 text-sm font-medium border-b border-border pb-1 hover:border-gilded transition-colors"
                >
                  Explore the Catalog
                  <svg
                    className="size-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
                <Link
                  to="/services"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Our services →
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-2/5">
              <div className="relative">
                <img
                  src={heroImg}
                  alt="A minimalist luxury villa interior in Kampala with warm light and stone walls"
                  width={1080}
                  height={1344}
                  className="w-full aspect-[3/4] object-cover rounded-md"
                />
                <div className="absolute -bottom-6 -left-6 bg-obsidian text-canvas p-8 hidden md:block rounded-sm ring-1 ring-white/10 max-w-xs">
                  <p className="font-serif text-2xl italic leading-tight">
                    "A new standard for East African luxury."
                  </p>
                  <p className="text-[10px] uppercase tracking-widest mt-4 opacity-50">
                    Private Client, Kololo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand marquee */}
      <section className="py-10 border-y border-border bg-white/40">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <div className="flex items-center justify-between gap-12 opacity-50 hover:opacity-80 transition-opacity duration-700">
            {["Dolce & Gabbana", "Boca do Lobo", "Fendi Casa", "Versace Home", "Visionnaire"].map(
              (b, i) => (
                <span
                  key={b}
                  className={`font-serif text-sm lg:text-lg tracking-[0.3em] uppercase whitespace-nowrap ${
                    i > 2 ? "hidden sm:inline" : ""
                  } ${i > 3 ? "hidden lg:inline" : ""}`}
                >
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Featured collection */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            <aside className="w-full lg:w-48 shrink-0">
              <div className="space-y-6">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gilded">
                  This Season
                </h3>
                <p className="font-serif text-2xl leading-snug">
                  A handful of pieces newly arrived in our private holding.
                </p>
                <Link
                  to="/catalog"
                  className="inline-block text-[11px] uppercase tracking-[0.2em] font-medium border-b border-foreground pb-0.5"
                >
                  See full catalog
                </Link>
              </div>
            </aside>

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-20">
                <div className="group cursor-pointer sm:col-span-2">
                  <div className="relative overflow-hidden mb-8 rounded-md">
                    <img
                      src={featureImg}
                      alt="Boca do Lobo Newton Console Gold"
                      width={1600}
                      height={896}
                      loading="lazy"
                      className="w-full aspect-[16/9] lg:aspect-[21/9] object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                    />
                    <div className="absolute bottom-8 left-8">
                      <span className="bg-canvas px-4 py-2 text-[10px] font-bold uppercase tracking-widest ring-1 ring-border">
                        Limited Edition
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gilded mb-2">
                        {title("feature", "Boca do Lobo")}
                      </p>
                      <h4 className="font-serif text-3xl font-medium">
                        {body("feature", "Newton Console Gold")}
                      </h4>
                    </div>
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      Bespoke commission only
                    </span>
                  </div>
                </div>

                {featured.map((item) => (
                  <Link to="/catalog" key={item.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden mb-6 rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={800}
                        height={1000}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gilded mb-2">
                        {item.manufacturer}
                      </p>
                      <h4 className="font-serif text-2xl font-medium">{item.name}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service ethos */}
      <section className="bg-obsidian text-canvas py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-balance whitespace-pre-line">
                {title(
                  "ethos",
                  "We do not just import furniture; we curate legacies.",
                )}
              </h2>
              {body("ethos") && (
                <p className="text-canvas/60 text-lg max-w-[50ch] leading-relaxed whitespace-pre-line">
                  {body("ethos")}
                </p>
              )}
              <div className="space-y-10">
                {[
                  [
                    "01",
                    "The Global Search",
                    "Bypassing standard retail to secure premium architectural pieces from exclusive global design houses.",
                  ],
                  [
                    "02",
                    "White-Glove Logistics",
                    "Custom-crated freight, customs handling and temperature-controlled transit to Kampala.",
                  ],
                  [
                    "03",
                    "Atelier Installation",
                    "Trained installers position, level and style each piece for the architecture it lives in.",
                  ],
                ].map(([n, title, body]) => (
                  <div key={n} className="flex gap-6 group">
                    <div className="flex-none w-10 h-10 rounded-full border border-gilded/30 flex items-center justify-center text-gilded text-sm group-hover:bg-gilded group-hover:text-obsidian transition-colors duration-500">
                      {n}
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-lg font-medium tracking-wide">{title}</h5>
                      <p className="text-canvas/55 text-base max-w-[40ch] text-pretty leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium border-b border-canvas/30 pb-1 hover:border-gilded transition-colors"
              >
                The full service ethos
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={ethos1}
                alt="Gilded craftsmanship detail"
                width={600}
                height={800}
                loading="lazy"
                className="w-full aspect-[3/4] object-cover rounded-sm"
              />
              <img
                src={ethos2}
                alt="Interior styling moodboard"
                width={600}
                height={800}
                loading="lazy"
                className="w-full aspect-[3/4] object-cover rounded-sm mt-12"
              />
            </div>
          </div>
        </div>
      </section>

      {customBlocks.length > 0 && (
        <section className="py-24 px-6 lg:px-12 bg-canvas">
          <div className="max-w-7xl mx-auto space-y-24">
            {customBlocks.map((b, idx) => (
              <div
                key={b.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {b.gallery[0] ? (
                  <img
                    src={b.gallery[0]}
                    alt={b.title ?? ""}
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover rounded-md"
                  />
                ) : (
                  <div />
                )}
                <div className="space-y-6">
                  {b.title && (
                    <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">
                      {b.title}
                    </h2>
                  )}
                  {b.body && (
                    <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
                      {b.body}
                    </p>
                  )}
                  {b.gallery.length > 1 && (
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      {b.gallery.slice(1, 7).map((g) => (
                        <img
                          key={g}
                          src={g}
                          alt=""
                          loading="lazy"
                          className="w-full aspect-square object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
