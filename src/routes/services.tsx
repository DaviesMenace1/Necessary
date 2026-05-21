import { createFileRoute, Link } from "@tanstack/react-router";
import process1 from "@/assets/process-1.jpg";
import process2 from "@/assets/process-2.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — The Revamp UG" },
      {
        name: "description",
        content:
          "End-to-end concierge for luxury interiors and architecture: sourcing, importing, white-glove installation, styling and architectural services for residences in Uganda.",
      },
      { property: "og:title", content: "Services — The Revamp UG" },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    n: "01",
    title: "Global Sourcing",
    body: "Direct relationships with European maisons grant our clients access to limited editions, archival re-issues and bespoke commissions usually reserved for trade-only showrooms in Milan, Paris and Porto.",
    bullets: [
      "Maison-direct negotiation",
      "Archival & limited-edition access",
      "Private moodboards",
    ],
  },
  {
    n: "02",
    title: "Import & Logistics",
    body: "Customs documentation, freight insurance, climate-controlled crating and last-mile handling — all managed under one roof so each piece arrives in pristine condition.",
    bullets: [
      "Customs & duties handling",
      "Insured air & sea freight",
      "Bonded warehousing in Kampala",
    ],
  },
  {
    n: "03",
    title: "White-Glove Installation",
    body: "Our trained installation team positions, levels and assembles every piece on-site, treating fragile finishes and one-of-a-kind objects with the reverence they deserve.",
    bullets: ["On-site assembly", "Mounting & rigging", "Protective transit & placement"],
  },
  {
    n: "04",
    title: "Interior Styling",
    body: "Beyond the object: art direction across lighting, textiles and accessories to ensure each acquisition resonates with the architecture and life of your home.",
    bullets: ["Room composition", "Lighting & textile direction", "Final styling photography"],
  },
  {
    n: "05",
    title: "Project Management",
    body: "For full residences and developments, we coordinate timelines and on-site contractors so the interior arrives in step with the build.",
    bullets: ["Programme alignment", "Vendor coordination", "Phased delivery"],
  },
  {
    n: "06",
    title: "Architecture & Spatial Design",
    body: "From concept sketches to construction documentation, our architectural practice shapes spaces that honour both context and ambition. We design new residences, reimagine existing structures, and deliver interiors born from unified vision.",
    bullets: [
      "Residential concept design",
      "Interior architecture",
      "Planning & permitting support",
    ],
  },
] as const;

function ServicesPage() {
  return (
    <>
      <section className="pt-16 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-gilded" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
              An End-to-End Concierge
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[1.05] text-balance max-w-4xl mb-10">
            From the atelier floor <span className="italic">to your foyer</span>.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            We handle every stage of the journey — so that owning extraordinary furniture in Uganda
            feels as simple as choosing it.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-7xl mx-auto space-y-24">
          {SERVICES.map((s, i) => (
            <div
              key={s.n}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${
                i % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="lg:col-span-5">
                <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                  <img
                    src={i % 2 ? process2 : process1}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 lg:pt-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gilded font-semibold">
                  {s.n}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl font-medium mt-4 mb-6 leading-tight">
                  {s.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-[50ch] leading-relaxed mb-8">
                  {s.body}
                </p>
                <ul className="space-y-3 border-t border-border pt-6">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-4 text-sm text-foreground/80">
                      <span className="size-1 rounded-full bg-gilded" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-7xl mx-auto bg-obsidian text-canvas rounded-md p-12 md:p-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <h3 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
              Begin a project with us.
            </h3>
            <p className="text-canvas/60 max-w-md">
              Share your vision; we will return with sourcing options within seven days.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-canvas text-obsidian py-4 px-10 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-gilded hover:text-obsidian transition-colors"
          >
            Request Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
