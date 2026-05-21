import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Revamp UG" },
      {
        name: "description",
        content:
          "Begin a consultation with The Revamp UG. Visit our Kyanja studio in Kampala, message us on WhatsApp, or request a private catalog.",
      },
      { property: "og:title", content: "Contact — The Revamp UG" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="pt-16 pb-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-12">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-gilded" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gilded">
                Inquire
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-medium leading-[1.05] text-balance">
              Begin your <span className="italic">consultation</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md">
              Share a few details about your project. We respond within two business days, by
              appointment only.
            </p>
          </div>

          <div className="space-y-8 border-t border-border pt-10">
            <div>
              <h6 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gilded mb-3">
                Studio
              </h6>
              <p className="text-foreground leading-relaxed">
                Plot 185, Kyanja
                <br />
                Kampala, Uganda
              </p>
              <p className="text-sm text-muted-foreground mt-2">By appointment</p>
            </div>
            <div>
              <h6 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gilded mb-3">
                Direct
              </h6>
              <p className="text-foreground leading-relaxed">
                therevampug@gmail.com
                <br />
                +256 703 861 668
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/256703861668"
                target="_blank"
                rel="noreferrer"
                className="bg-obsidian text-canvas py-3 px-7 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 inline-flex items-center gap-2"
              >
                WhatsApp Studio
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </a>
              <a
                href="https://www.instagram.com/therevamp_ug"
                target="_blank"
                rel="noreferrer"
                className="border border-border text-foreground py-3 px-7 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-muted"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="bg-white rounded-md p-8 md:p-12 ring-1 ring-border space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" />
              <Field label="Location" name="location" placeholder="e.g. Kololo, Kampala" />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-3 block">
                Nature of project
              </label>
              <div className="flex flex-wrap gap-2">
                {["Full residence", "Single room", "Single piece", "Commercial", "Other"].map(
                  (opt) => (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm cursor-pointer hover:border-foreground transition-colors has-[input:checked]:bg-obsidian has-[input:checked]:text-canvas has-[input:checked]:border-obsidian"
                    >
                      <input type="radio" name="scope" value={opt} className="sr-only" />
                      {opt}
                    </label>
                  ),
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-3 block"
              >
                Tell us about your vision
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full bg-transparent border-b border-input pb-2 focus:outline-none focus:border-gilded resize-none text-base"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {submitted
                  ? "Thank you — we will be in touch shortly."
                  : "Replies within 48 hours."}
              </p>
              <button
                type="submit"
                disabled={submitted}
                className="bg-obsidian text-canvas py-3 px-10 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
              >
                {submitted ? "Sent" : "Send inquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2 block"
      >
        {label} {required && <span className="text-gilded">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-input pb-2 focus:outline-none focus:border-gilded text-base"
      />
    </div>
  );
}
