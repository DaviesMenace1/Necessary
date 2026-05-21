import { createFileRoute } from "@tanstack/react-router";
import heroVilla from "@/assets/hero-villa.jpg";
import process1 from "@/assets/process-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Studio — The Revamp UG" },
      {
        name: "description",
        content:
          "The Revamp UG is Kampala's specialist in luxury European interior sourcing, architecture, importing and installation. Meet the studio behind East Africa's most refined homes.",
      },
      { property: "og:title", content: "The Studio — The Revamp UG" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="pt-16 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-gilded" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
                The Studio
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[1.05] text-balance">
              A quiet practice for <span className="italic">extraordinary</span> interiors.
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Revamp UG was founded in Kampala for collectors who refused to compromise on
              quality, provenance or service. We bridge a private network of European maisons with
              East Africa's most ambitious residences — and design spaces of our own.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2">
          <img
            src={heroVilla}
            alt="Kampala residence interior"
            loading="lazy"
            className="w-full aspect-[3/4] object-cover rounded-md md:col-span-2"
          />
          <img
            src={process1}
            alt="Craftsmanship detail"
            loading="lazy"
            className="w-full aspect-[3/4] object-cover rounded-md mt-12"
          />
        </div>
      </section>

      <section className="bg-obsidian text-canvas py-32 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl leading-tight text-balance mb-16">
            We treat each project as a private commission — discreet, considered, slow.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-canvas/10 pt-16">
            {[
              ["Provenance", "Every piece arrives with documentation from its maison of origin."],
              ["Discretion", "Client relationships are confidential, end to end."],
              ["Permanence", "We curate for inheritance, not for trend cycles."],
            ].map(([t, b]) => (
              <div key={t}>
                <h4 className="font-serif text-2xl mb-3">{t}</h4>
                <p className="text-canvas/60 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl mb-12 text-balance">
            Our partner maisons include
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12 text-lg font-serif">
            {[
              "Dolce & Gabbana Casa",
              "Boca do Lobo",
              "Fendi Casa",
              "Versace Home",
              "Roberto Cavalli Home",
              "Visionnaire",
              "Minotti",
              "Bentley Home",
              "Bocci",
            ].map((m) => (
              <div key={m} className="border-b border-border pb-3">
                {m}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
