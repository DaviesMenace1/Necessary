import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-20 pb-20 border-b border-border">
          <div className="lg:w-1/2">
            <h2 className="font-serif text-5xl md:text-6xl mb-10 leading-[1.05]">
              Define your space.
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-[40ch] leading-relaxed">
              Schedule a private viewing at our Kyanja studio or request a tailored digital catalog
              for your project.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                to="/contact"
                className="bg-obsidian text-canvas py-4 px-10 rounded-full text-xs font-semibold uppercase tracking-widest ring-1 ring-obsidian transition-transform hover:-translate-y-0.5"
              >
                Private Consultation
              </Link>
              <a
                href="https://wa.me/256703861668"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-xs font-semibold uppercase tracking-widest py-4"
              >
                Message on WhatsApp
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12 lg:w-1/3">
            <div className="space-y-6">
              <h6 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gilded">
                Studio
              </h6>
              <p className="text-sm text-muted-foreground leading-loose">
                Plot 185, Kyanja
                <br />
                Kampala, Uganda
              </p>
            </div>
            <div className="space-y-6">
              <h6 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gilded">
                Contact
              </h6>
              <p className="text-sm text-muted-foreground leading-loose underline decoration-border underline-offset-4">
                therevampug@gmail.com
                <br />
                +256 703 861 668
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} The Revamp Uganda. Curated Excellence.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-medium">
            <a
              href="https://www.instagram.com/therevamp_ug"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gilded transition-colors"
            >
              Instagram
            </a>
            <Link to="/about" className="hover:text-gilded transition-colors">
              The Studio
            </Link>
            <Link to="/architecture" className="hover:text-gilded transition-colors">
              Architecture
            </Link>
            <Link to="/catalog" className="hover:text-gilded transition-colors">
              Archives
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
