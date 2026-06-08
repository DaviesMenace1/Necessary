import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getPublicSettings,
  updateBrandSettings,
  updateContactSettings,
  type BrandSettings,
  type ContactSettings,
} from "@/lib/settings.functions";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const fetchSettings = useServerFn(getPublicSettings);
  const saveContact = useServerFn(updateContactSettings);
  const saveBrand = useServerFn(updateBrandSettings);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchSettings(),
  });

  return (
    <div className="px-10 py-12 max-w-3xl">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">Configure</p>
      <h1 className="font-serif text-4xl mb-10">Settings</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-12">
          <ContactCard
            initial={data?.contact ?? null}
            onSave={async (v) => {
              await saveContact({ data: v });
              await refetch();
            }}
          />
          <BrandCard
            initial={data?.brand ?? null}
            onSave={async (v) => {
              await saveBrand({ data: v });
              await refetch();
            }}
          />
        </div>
      )}
    </div>
  );
}

function ContactCard({
  initial,
  onSave,
}: {
  initial: ContactSettings | null;
  onSave: (v: ContactSettings) => Promise<void>;
}) {
  const [form, setForm] = useState<ContactSettings>({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    instagram: "",
  });
  useEffect(() => {
    if (initial) setForm({ instagram: "", ...initial });
  }, [initial]);

  const mut = useMutation({ mutationFn: onSave });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate(form);
      }}
      className="border border-border rounded-lg p-8 space-y-6"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-1">Section</p>
        <h2 className="font-serif text-2xl">Contact information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Shown in the site footer and on the Contact page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          label="Email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          type="email"
          required
        />
        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          required
        />
        <Field
          label="WhatsApp (digits only)"
          value={form.whatsapp}
          onChange={(v) => setForm({ ...form, whatsapp: v })}
          placeholder="256703861668"
          required
        />
        <Field
          label="Instagram URL"
          value={form.instagram ?? ""}
          onChange={(v) => setForm({ ...form, instagram: v })}
          placeholder="https://instagram.com/…"
        />
      </div>
      <Field
        label="Studio address"
        value={form.address}
        onChange={(v) => setForm({ ...form, address: v })}
        required
      />
      <SaveRow pending={mut.isPending} error={mut.error} success={mut.isSuccess} />
    </form>
  );
}

function BrandCard({
  initial,
  onSave,
}: {
  initial: BrandSettings | null;
  onSave: (v: BrandSettings) => Promise<void>;
}) {
  const [form, setForm] = useState<BrandSettings>({ tagline: "", about_short: "" });
  useEffect(() => {
    if (initial) setForm({ tagline: "", about_short: "", ...initial });
  }, [initial]);

  const mut = useMutation({ mutationFn: onSave });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate(form);
      }}
      className="border border-border rounded-lg p-8 space-y-6"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-1">Section</p>
        <h2 className="font-serif text-2xl">Brand</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Optional copy used in marketing surfaces and meta tags.
        </p>
      </div>
      <Field
        label="Tagline"
        value={form.tagline ?? ""}
        onChange={(v) => setForm({ ...form, tagline: v })}
        placeholder="Curated interiors, collected by appointment."
      />
      <div>
        <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2 block">
          Short about
        </label>
        <textarea
          rows={4}
          value={form.about_short ?? ""}
          onChange={(e) => setForm({ ...form, about_short: e.target.value })}
          className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-gilded"
        />
      </div>
      <SaveRow pending={mut.isPending} error={mut.error} success={mut.isSuccess} />
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border border-border rounded-md p-2.5 text-sm focus:outline-none focus:border-gilded"
      />
    </div>
  );
}

function SaveRow({
  pending,
  error,
  success,
}: {
  pending: boolean;
  error: Error | null;
  success: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground">
        {error ? (
          <span className="text-red-600">{error.message}</span>
        ) : success ? (
          <span className="text-emerald-700">Saved.</span>
        ) : (
          "Changes apply immediately."
        )}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="bg-obsidian text-canvas px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
