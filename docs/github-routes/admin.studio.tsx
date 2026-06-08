import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import {
  listStudio,
  upsertStudioItem,
  deleteStudioItem,
  type StudioItem,
} from "@/lib/studio.functions";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/studio")({
  component: AdminStudio,
});

type Editing = Partial<StudioItem> | null;

function AdminStudio() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(listStudio);
  const upsertFn = useServerFn(upsertStudioItem);
  const delFn = useServerFn(deleteStudioItem);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-studio"],
    queryFn: () => fetchAll(),
  });
  const [editing, setEditing] = useState<Editing>(null);

  const saveMut = useMutation({
    mutationFn: (row: StudioItem) => upsertFn({ data: row }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-studio"] });
      setEditing(null);
    },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-studio"] }),
  });

  return (
    <div className="px-10 py-12 max-w-7xl">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">The Album</p>
          <h1 className="font-serif text-4xl">Studio</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {items.length} entr{items.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              title: "",
              blurb: "",
              image_url: null,
              gallery: [],
              sort_order: items.length,
            })
          }
          className="inline-flex items-center gap-2 bg-obsidian text-canvas px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90"
        >
          <Plus className="w-4 h-4" /> New entry
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-16 text-center text-sm text-muted-foreground">
          No studio entries yet. Click “New entry” to start your album.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.id} className="group border border-border rounded-lg overflow-hidden">
              {it.image_url ? (
                <img
                  src={it.image_url}
                  alt={it.title}
                  className="w-full aspect-[4/5] object-cover"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-muted grid place-items-center text-muted-foreground text-xs">
                  No cover
                </div>
              )}
              <div className="p-4">
                <p className="font-serif text-lg leading-tight">{it.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.blurb}</p>
                <div className="flex justify-between mt-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    order {it.sort_order}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(it)} className="p-1.5 hover:bg-muted rounded">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${it.title}"?`)) delMut.mutate(it.id);
                      }}
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Editor
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(r) => saveMut.mutate(r)}
        saving={saveMut.isPending}
        error={saveMut.error instanceof Error ? saveMut.error.message : null}
      />
    </div>
  );
}

function Editor({
  editing,
  onClose,
  onSave,
  saving,
  error,
}: {
  editing: Editing;
  onClose: () => void;
  onSave: (r: StudioItem) => void;
  saving: boolean;
  error: string | null;
}) {
  const [row, setRow] = useState<Partial<StudioItem>>(editing ?? {});
  const [uploading, setUploading] = useState(false);

  if (editing && row !== editing && row.id !== editing.id) setRow(editing);

  function update<K extends keyof StudioItem>(k: K, v: StudioItem[K]) {
    setRow((r) => ({ ...r, [k]: v }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `studio/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("pages").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("pages").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      const next = [...(row.gallery ?? []), ...urls];
      update("gallery", next);
      if (!row.image_url) update("image_url", urls[0]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Dialog open={!!editing} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogTitle className="font-serif text-2xl">
          {editing?.id ? "Edit entry" : "New entry"}
        </DialogTitle>

        <div className="space-y-5 mt-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Title
            </span>
            <input
              className="input mt-1"
              value={row.title ?? ""}
              onChange={(e) => update("title", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Blurb
            </span>
            <textarea
              className="input mt-1 min-h-[100px]"
              value={row.blurb ?? ""}
              onChange={(e) => update("blurb", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Sort order
            </span>
            <input
              type="number"
              className="input mt-1"
              value={row.sort_order ?? 0}
              onChange={(e) => update("sort_order", parseInt(e.target.value || "0", 10))}
            />
          </label>

          <div className="border-t border-border pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Photos
            </p>
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
            {(row.gallery ?? []).length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {(row.gallery ?? []).map((url, i) => (
                  <div key={url + i} className="relative group">
                    <img src={url} alt="" className="w-full aspect-square object-cover rounded" />
                    {row.image_url === url ? (
                      <span className="absolute top-1 left-1 bg-gilded text-obsidian text-[9px] px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    ) : (
                      <button
                        onClick={() => update("image_url", url)}
                        className="absolute bottom-1 left-1 text-[9px] bg-canvas/90 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100"
                      >
                        Set cover
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const next = (row.gallery ?? []).filter((u) => u !== url);
                        update("gallery", next);
                        if (row.image_url === url) update("image_url", next[0] ?? null);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
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
            onClick={() => onSave(row as StudioItem)}
            className="bg-obsidian text-canvas px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
