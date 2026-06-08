import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  deletePageSection,
  listAllPageSections,
  upsertPageSection,
  type PageSection,
} from "@/lib/pages.functions";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPages,
});

const KNOWN_PAGES = ["home", "about", "services", "architecture", "catalog"];

// Reference for editors — keys the public pages actually read.
const SECTION_HINTS: Record<string, string> = {
  home: "hero (title + body), feature (title + body, 1 img), ethos (title + body, 2 imgs). Add extra blocks with key block_1, block_2… each renders image + title + body.",
  architecture: "hero (1 img), showcase (3 imgs: main, plan, sketch)",
  about: "gallery (2+ imgs). The studio album below is managed under Admin → Studio.",
  services: "gallery (one image per service row)",
  catalog: "(no images consumed yet)",
};

function AdminPages() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(listAllPageSections);
  const upsertFn = useServerFn(upsertPageSection);
  const delFn = useServerFn(deletePageSection);

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["page-sections"],
    queryFn: () => fetchAll(),
  });

  const [page, setPage] = useState("home");
  const [editing, setEditing] = useState<Partial<PageSection> | null>(null);

  const visible = useMemo(
    () => sections.filter((s) => s.page === page),
    [sections, page],
  );

  const upsertMut = useMutation({
    mutationFn: (vars: Partial<PageSection>) =>
      upsertFn({
        data: {
          id: vars.id,
          page: vars.page!,
          section_key: vars.section_key!,
          title: vars.title ?? null,
          body: vars.body ?? null,
          gallery: vars.gallery ?? [],
          sort_order: vars.sort_order ?? 0,
        },
      }),
    onSuccess: () => {
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["page-sections"] });
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["page-sections"] }),
  });

  return (
    <div className="px-10 py-12 max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">Editor</p>
          <h1 className="font-serif text-4xl">Pages</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            Sections are scoped to a page. Add a section here, then reference it in the
            corresponding page component by its <code>section_key</code>.
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              page,
              section_key: "",
              title: "",
              body: "",
              gallery: [],
              sort_order: visible.length * 10,
            })
          }
          className="bg-obsidian text-canvas px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 inline-flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> New section
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {KNOWN_PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded ${
              page === p
                ? "bg-obsidian text-canvas"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {p} ({sections.filter((s) => s.page === p).length})
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-6 -mt-4">
        On <span className="font-medium text-foreground">{page}</span> the public site reads:{" "}
        <code className="text-foreground">{SECTION_HINTS[page] ?? "—"}</code>
      </p>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center text-sm text-muted-foreground">
          No sections for <span className="font-medium text-foreground">{page}</span> yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((s) => (
            <li
              key={s.id}
              className="border border-border rounded-lg p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-gilded">
                  {s.section_key} · order {s.sort_order}
                </p>
                <p className="font-serif text-lg truncate">{s.title || "(no title)"}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {s.body ? s.body.slice(0, 120) : "—"}
                  {s.gallery.length > 0 && ` · ${s.gallery.length} image(s)`}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditing(s)}
                  className="border border-border rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest hover:bg-muted"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete section "${s.section_key}"?`)) delMut.mutate(s.id);
                  }}
                  className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditorModal
          value={editing}
          onClose={() => setEditing(null)}
          onSave={(v) => upsertMut.mutate(v)}
          pending={upsertMut.isPending}
          error={upsertMut.error}
        />
      )}
    </div>
  );
}

function EditorModal({
  value,
  onClose,
  onSave,
  pending,
  error,
}: {
  value: Partial<PageSection>;
  onClose: () => void;
  onSave: (v: Partial<PageSection>) => void;
  pending: boolean;
  error: Error | null;
}) {
  const [v, setV] = useState(value);
  const [uploading, setUploading] = useState(false);
  const gallery = v.gallery ?? [];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${v.page || "page"}/${v.section_key || "section"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("pages").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("pages").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setV({ ...v, gallery: [...gallery, ...urls] });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(idx: number) {
    setV({ ...v, gallery: gallery.filter((_, i) => i !== idx) });
  }

  function moveImage(idx: number, dir: -1 | 1) {
    const next = [...gallery];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setV({ ...v, gallery: next });
  }

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-6">
      <div className="bg-canvas rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <h2 className="font-serif text-2xl mb-6">
          {value.id ? "Edit section" : "New section"}
        </h2>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Page"
              value={v.page ?? ""}
              onChange={(x) => setV({ ...v, page: x })}
            />
            <Input
              label="Section key"
              value={v.section_key ?? ""}
              onChange={(x) => setV({ ...v, section_key: x })}
              placeholder="hero, intro, feature_1…"
            />
          </div>
          <Input
            label="Title"
            value={v.title ?? ""}
            onChange={(x) => setV({ ...v, title: x })}
          />
          <div>
            <L>Body</L>
            <textarea
              rows={6}
              value={v.body ?? ""}
              onChange={(e) => setV({ ...v, body: e.target.value })}
              className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-gilded"
            />
          </div>
          <div>
            <L>Images (first is primary; drag order = display order)</L>
            <div className="flex items-center gap-3 mb-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-xs cursor-pointer hover:bg-muted">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading…" : "Upload images"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
              <span className="text-xs text-muted-foreground">{gallery.length} image(s)</span>
            </div>
            {gallery.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {gallery.map((url, i) => (
                  <div key={url + i} className="relative group">
                    <img
                      src={url}
                      alt=""
                      className="w-full aspect-square object-cover rounded border border-border"
                    />
                    <span className="absolute top-1 left-1 bg-obsidian text-canvas text-[9px] px-1.5 py-0.5 rounded">
                      {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        disabled={i === 0}
                        className="bg-obsidian/80 text-canvas text-xs w-6 h-6 rounded disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === gallery.length - 1}
                        className="bg-obsidian/80 text-canvas text-xs w-6 h-6 rounded disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Input
            label="Sort order"
            type="number"
            value={String(v.sort_order ?? 0)}
            onChange={(x) => setV({ ...v, sort_order: parseInt(x || "0", 10) })}
          />
          {error && <p className="text-sm text-red-600">{error.message}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
          <button
            onClick={onClose}
            className="border border-border rounded-full px-5 py-2 text-[11px] uppercase tracking-widest hover:bg-muted"
          >
            Cancel
          </button>
          <button
            disabled={pending}
            onClick={() => onSave(v)}
            className="bg-obsidian text-canvas px-6 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function L({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2 block">
      {children}
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <L>{label}</L>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-md p-2.5 text-sm focus:outline-none focus:border-gilded"
      />
    </div>
  );
}
