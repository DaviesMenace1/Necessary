import { createFileRoute, Link } from "@tanstack/react-router";
import archPlan from "@/assets/arch-plan.jpg";
import archVilla from "@/assets/arch-render-villa.jpg";
import archSketch from "@/assets/arch-sketch.jpg";
import archInterior from "@/assets/arch-interior-3d.jpg";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — The Revamp UG" },
      {
        name: "description",
        content:
          "Bespoke residential architecture in Uganda. From hand-drawn concept sketches and 3D renders to construction documentation — we design homes born from a unified vision.",
      },
      { property: "og:title", content: "Architecture — The Revamp UG" },
      {
        property: "og:description",
        content:
          "Concept sketches, 3D renders and floor plans for residences across Kampala and East Africa.",
      },
      { property: "og:image", content: archVilla },
    ],
  }),
  component: ArchitecturePage,
});

const PHASES = [
  {
    n: "01",
    title: "Concept & Sketch",
    body: "We begin in pencil — sketching massing, light and circulation against the site. Every project starts as an idea drawn by hand before it becomes a building.",
  },
  {
    n: "02",
    title: "3D Visualisation",
    body: "Photoreal renders let you walk the house before a single block is laid — testing materials, daylight and the spatial drama at full scale.",
  },
  {
    n: "03",
    title: "Floor Plans & Documentation",
    body: "Fully dimensioned drawings, structural coordination and permit-ready packages — the technical backbone of a beautiful build.",
  },
  {
    n: "04",
    title: "Build Supervision",
    body: "We remain on site, in dialogue with contractors, to protect the integrity of the design from foundation to final styling.",
  },
] as const;

function ArchitecturePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={archVilla}
            alt="Photoreal 3D render of a modernist luxury villa at golden hour"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gilded" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
                  The Architectural Practice
                </span>
              </div>
              <h1 className="font-serif text-canvas text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.02] text-balance max-w-5xl">
                Houses drawn <span className="italic">by hand</span>,
                <br className="hidden md:block" />
                built to last <span className="italic">generations</span>.
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
              From sketch to keys
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium mt-6 leading-tight">
              An atelier that designs the <span className="italic">vessel</span> as well as its
              contents.
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Most of our clients arrive asking for furniture. Many discover the rooms themselves
              want reimagining — the proportions, the openings, the play of shadow across a hallway
              in the late afternoon.
            </p>
            <p>
              The Revamp UG operates a full architectural practice alongside its sourcing concierge.
              From the first pencil sketch to the final keys, our studio shapes private residences
              across Kampala and the wider region — with the same reverence for material and craft
              we bring to a Boca do Lobo cabinet.
            </p>
          </div>
        </div>
      </section>

      {/* Visual showcase */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 md:gap-6">
          <figure className="col-span-12 md:col-span-8">
            <div className="overflow-hidden rounded-md bg-muted">
              <img
                src={archInterior}
                alt="3D interior render of a double-height living room with travertine walls and sculptural staircase"
                loading="lazy"
                className="w-full aspect-[4/5] md:aspect-[5/6] object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              3D Render · Private Residence, Naguru
            </figcaption>
          </figure>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:gap-6">
            <figure className="flex-1">
              <div className="overflow-hidden rounded-md bg-muted h-full">
                <img
                  src={archPlan}
                  alt="Architectural floor plan in fine charcoal and gold linework"
                  loading="lazy"
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Floor Plan · Ground Level
              </figcaption>
            </figure>
            <figure className="flex-1">
              <div className="overflow-hidden rounded-md bg-muted h-full">
                <img
                  src={archSketch}
                  alt="Hand-drawn architectural concept sketch in pencil and sepia wash"
                  loading="lazy"
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
              <figcaption className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Concept Sketch · Courtyard Study
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-obsidian text-canvas py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
              The Practice
            </span>
            <h2 className="font-serif text-4xl md:text-6xl mt-6 leading-[1.05] text-balance">
              Four phases, one continuous <span className="italic">conversation</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {PHASES.map((p) => (
              <div key={p.n} className="border-t border-canvas/15 pt-8">
                <div className="flex items-baseline gap-6 mb-4">
                  <span className="font-serif text-gilded text-2xl">{p.n}</span>
                  <h3 className="font-serif text-3xl font-medium">{p.title}</h3>
                </div>
                <p className="text-canvas/60 leading-relaxed max-w-[44ch]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              [
                "New Residences",
                "Ground-up family homes, retreats and pied-à-terres designed in dialogue with the Ugandan landscape.",
              ],
              [
                "Renovations",
                "Reimagining existing structures — opening volumes, restoring proportion, modernising services.",
              ],
              [
                "Interior Architecture",
                "Joinery, stairs, ceilings and built-ins designed as architecture, not decoration.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="space-y-3">
                <h4 className="font-serif text-2xl font-medium">{t}</h4>
                <p className="text-muted-foreground leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-7xl mx-auto bg-obsidian text-canvas rounded-md p-12 md:p-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <h3 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
              Have a site, a plot, or a feeling?
            </h3>
            <p className="text-canvas/60 max-w-md">
              Bring us your plans — or just your aspirations. We will sketch the first moves with
              you.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-canvas text-obsidian py-4 px-10 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-gilded hover:text-obsidian transition-colors"
          >
            Start a Design Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
