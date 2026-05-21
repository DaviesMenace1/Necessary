import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Collections" },
  { to: "/services", label: "Services" },
  { to: "/architecture", label: "Architecture" },
  { to: "/about", label: "The Studio" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-xl border-b border-border px-6 py-4 lg:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-2xl tracking-tighter font-medium flex items-center gap-2"
        >
          The Revamp <span className="text-gilded font-normal italic">UG</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-medium">
          {nav.slice(1, 5).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="hover:text-gilded transition-colors"
              activeProps={{ className: "text-gilded" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="bg-obsidian text-canvas py-2 pr-4 pl-3 inline-flex items-center gap-2 rounded-full ring-1 ring-obsidian transition-colors hover:bg-obsidian/90"
          >
            <svg
              className="size-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
            Inquire
          </Link>
        </div>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2"
        >
          <div className="w-6 h-px bg-obsidian mb-1.5" />
          <div className="w-6 h-px bg-obsidian" />
        </button>
      </div>
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] font-medium border-t border-border pt-4">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="hover:text-gilded transition-colors"
              activeProps={{ className: "text-gilded" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
