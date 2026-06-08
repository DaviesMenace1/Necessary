import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import heroVilla from "@/assets/hero-villa.jpg";
import process1 from "@/assets/process-1.jpg";
import { usePageContent } from "@/lib/page-content";
import { listStudio } from "@/lib/studio.functions";

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
  const { image } = usePageContent("about");
  const img1 = image("gallery", 0, heroVilla);
  const img2 = image("gallery", 1, process1);
  const fetchStudio = useServerFn(listStudio);
  const { data: album = [] } = useQuery({
    queryKey: ["public-studio"],
    queryFn: () => fetchStudio(),
    staleTime: 30_000,
  });
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
            src={img1}
            alt="Kampala residence interior"
            loading="lazy"
            className="w-full aspect-[3/4] object-cover rounded-md md:col-span-2"
          />
          <img
            src={img2}
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

      {album.length > 0 && (
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded mb-3">
                  The Album
                </p>
                <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance">
                  From the studio.
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Moments, projects and pieces we have lived with — an evolving record of the work.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {album.map((it) => (
                <article key={it.id}>
                  {it.image_url && (
                    <div className="overflow-hidden rounded-md bg-muted mb-5">
                      <img
                        src={it.image_url}
                        alt={it.title}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-2xl font-medium leading-tight">{it.title}</h3>
                  {it.blurb && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {it.blurb}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
