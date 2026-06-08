import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listCatalog, upsertCatalogItem, deleteCatalogItem, type CatalogRow } from "@/lib/catalog.functions";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Upload, Star } from "lucide-react";

export const Route = createFileRoute("/admin/catalog")({
  component: AdminCatalog,
});

type Editing = Partial<CatalogRow> | null;

function AdminCatalog() {
  const qc = useQueryClient();
  const fetchCatalog = useServerFn(listCatalog);
  const upsertFn = useServerFn(upsertCatalogItem);
  const deleteFn = useServerFn(deleteCatalogItem);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-catalog"],
    queryFn: () => fetchCatalog(),
  });

  const [editing, setEditing] = useState<Editing>(null);

  const saveMut = useMutation({
    mutationFn: (row: CatalogRow) => upsertFn({ data: row }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-catalog"] });
      setEditing(null);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-catalog"] }),
  });

  return (
    <div className="px-10 py-12 max-w-7xl">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">The Archive</p>
          <h1 className="font-serif text-4xl">Catalog</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {items.length} piece{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              slug: "",
              name: "",
              manufacturer: "Fendi Casa",
              category: "Lounge Seating",
              blurb: "",
              status: "Available",
              price: "",
              image_url: null,
              gallery: [],
              specs: {},
              featured: false,
              sort_order: items.length,
            })
          }
          className="inline-flex items-center gap-2 bg-obsidian text-canvas px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90"
        >
          <Plus className="w-4 h-4" /> New piece
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 w-16"></th>
                <th className="text-left px-4 py-3">Piece</th>
                <th className="text-left px-4 py-3">Atelier</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Feat.</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    {it.image_url ? (
                      <img
                        src={it.image_url}
                        alt=""
                        className="w-10 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-12 rounded bg-muted" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.slug}</div>
                  </td>
                  <td className="px-4 py-3">{it.manufacturer}</td>
                  <td className="px-4 py-3">{it.category}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-widest bg-muted px-2 py-1 rounded">
                      {it.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {it.featured && <Star className="w-4 h-4 fill-gilded text-gilded" />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(it)}
                      className="p-2 hover:bg-muted rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${it.name}"?`)) delMut.mutate(it.id);
                      }}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground">
                    No pieces yet. Click "New piece" or seed from the Dashboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditorDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(row) => saveMut.mutate(row)}
        saving={saveMut.isPending}
        error={saveMut.error instanceof Error ? saveMut.error.message : null}
      />
    </div>
  );
}

function EditorDialog({
  editing,
  onClose,
  onSave,
  saving,
  error,
}: {
  editing: Editing;
  onClose: () => void;
  onSave: (row: CatalogRow) => void;
  saving: boolean;
  error: string | null;
}) {
  const [row, setRow] = useState<Partial<CatalogRow>>(editing ?? {});
  const [uploading, setUploading] = useState(false);

  // Re-init when editing changes
  if (editing && row !== editing && row.id !== editing.id) {
    setRow(editing);
  }

  function update<K extends keyof CatalogRow>(k: K, v: CatalogRow[K]) {
    setRow((r) => ({ ...r, [k]: v }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, asCover: boolean) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${row.slug || crypto.randomUUID()}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("catalog").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (error) throw error;
        const { data } = supabase.storage.from("catalog").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      if (asCover) update("image_url", urls[0]);
      update("gallery", [...(row.gallery ?? []), ...urls]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogTitle className="font-serif text-2xl">
          {editing?.id ? "Edit piece" : "New piece"}
        </DialogTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <Field label="Name">
            <input
              className="input"
              value={row.name ?? ""}
              onChange={(e) => update("name", e.target.value)}
            />
          </Field>
          <Field label="Slug (lowercase, hyphens)">
            <input
              className="input"
              value={row.slug ?? ""}
              onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            />
          </Field>
          <Field label="Atelier">
            <input
              className="input"
              value={row.manufacturer ?? ""}
              onChange={(e) => update("manufacturer", e.target.value)}
              placeholder="e.g. Fendi Casa"
            />
          </Field>
          <Field label="Category">
            <input
              className="input"
              value={row.category ?? ""}
              onChange={(e) => update("category", e.target.value)}
              placeholder="e.g. Lounge Seating"
            />
          </Field>
          <Field label="Status">
            <input
              className="input"
              value={row.status ?? ""}
              onChange={(e) => update("status", e.target.value)}
              placeholder="Available, Bespoke commission, Sold…"
            />
          </Field>
          <Field label="Price (free-form, e.g. $4,500 or POA)">
            <input
              className="input"
              value={row.price ?? ""}
              onChange={(e) => update("price", e.target.value)}
              placeholder="$4,500"
            />
          </Field>
          <Field label="Sort order">
            <input
              type="number"
              className="input"
              value={row.sort_order ?? 0}
              onChange={(e) => update("sort_order", parseInt(e.target.value || "0", 10))}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Blurb (short description)">
              <textarea
                className="input min-h-[80px]"
                value={row.blurb ?? ""}
                onChange={(e) => update("blurb", e.target.value)}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!row.featured}
                onChange={(e) => update("featured", e.target.checked)}
              />
              Featured piece
            </label>
          </div>

          <div className="md:col-span-2 border-t border-border pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Photos
            </p>
            <div className="flex gap-3 items-center">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-xs cursor-pointer hover:bg-muted">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading…" : "Upload (first becomes cover)"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, !row.image_url)}
                  disabled={uploading}
                />
              </label>
            </div>
            {row.image_url && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Cover</p>
                <img src={row.image_url} className="w-32 h-40 object-cover rounded" />
              </div>
            )}
            {(row.gallery ?? []).length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Gallery</p>
                <div className="flex gap-2 flex-wrap">
                  {(row.gallery ?? []).map((url) => (
                    <div key={url} className="relative group">
                      <img src={url} className="w-20 h-24 object-cover rounded" />
                      <button
                        onClick={() => {
                          update(
                            "gallery",
                            (row.gallery ?? []).filter((u) => u !== url),
                          );
                          if (row.image_url === url) update("image_url", null);
                        }}
                        className="absolute -top-1 -right-1 bg-obsidian text-canvas rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                      {row.image_url !== url && (
                        <button
                          onClick={() => update("image_url", url)}
                          className="absolute bottom-1 left-1 text-[9px] bg-canvas/90 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100"
                        >
                          Set cover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-xs uppercase tracking-[0.2em]">
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={() => onSave(row as CatalogRow)}
            className="bg-obsidian text-canvas px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
