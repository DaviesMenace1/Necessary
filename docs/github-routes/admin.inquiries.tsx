import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  listInquiries,
  updateInquiry,
  deleteInquiry,
  type InquiryRow,
} from "@/lib/inquiries.functions";
import { Trash2, Mail, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

const STATUSES: InquiryRow["status"][] = [
  "new",
  "in_progress",
  "quoted",
  "won",
  "archived",
];

const STATUS_STYLES: Record<InquiryRow["status"], string> = {
  new: "bg-emerald-100 text-emerald-800",
  in_progress: "bg-amber-100 text-amber-800",
  quoted: "bg-blue-100 text-blue-800",
  won: "bg-violet-100 text-violet-800",
  archived: "bg-muted text-muted-foreground",
};

function AdminInquiries() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(listInquiries);
  const updateFn = useServerFn(updateInquiry);
  const deleteFn = useServerFn(deleteInquiry);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: () => fetchAll(),
  });

  const [filter, setFilter] = useState<"all" | InquiryRow["status"]>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter],
  );

  const active = items.find((i) => i.id === activeId) ?? null;

  const updateMut = useMutation({
    mutationFn: (vars: {
      id: string;
      status?: InquiryRow["status"];
      internal_notes?: string | null;
    }) => updateFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      setActiveId(null);
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
    },
  });

  return (
    <div className="flex h-screen">
      <div className="w-[420px] border-r border-border flex flex-col">
        <div className="px-6 py-6 border-b border-border">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">Inbox</p>
          <h1 className="font-serif text-3xl">Inquiries</h1>
          <div className="mt-5 flex flex-wrap gap-1.5">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              All ({items.length})
            </FilterChip>
            {STATUSES.map((s) => {
              const n = items.filter((i) => i.status === s).length;
              return (
                <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
                  {s.replace("_", " ")} ({n})
                </FilterChip>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No inquiries.</p>
          ) : (
            filtered.map((i) => (
              <button
                key={i.id}
                onClick={() => setActiveId(i.id)}
                className={`block w-full text-left border-b border-border px-6 py-4 hover:bg-muted/40 transition-colors ${
                  activeId === i.id ? "bg-muted/60" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <p className="font-medium truncate">{i.name}</p>
                  <span
                    className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_STYLES[i.status]}`}
                  >
                    {i.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {i.item_name_snapshot ?? i.message.slice(0, 70)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
                  {new Date(i.created_at).toLocaleDateString()} ·{" "}
                  {i.source === "request_this" ? "Request" : "Contact"}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!active ? (
          <div className="h-full grid place-items-center text-muted-foreground text-sm">
            Select an inquiry
          </div>
        ) : (
          <Detail
            key={active.id}
            inquiry={active}
            onChangeStatus={(status) =>
              updateMut.mutate({ id: active.id, status })
            }
            onSaveNotes={(notes) =>
              updateMut.mutate({ id: active.id, internal_notes: notes })
            }
            saving={updateMut.isPending}
            onDelete={() => {
              if (confirm(`Delete inquiry from ${active.name}?`)) delMut.mutate(active.id);
            }}
          />
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded ${
        active ? "bg-obsidian text-canvas" : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );
}

function Detail({
  inquiry,
  onChangeStatus,
  onSaveNotes,
  saving,
  onDelete,
}: {
  inquiry: InquiryRow;
  onChangeStatus: (s: InquiryRow["status"]) => void;
  onSaveNotes: (n: string) => void;
  saving: boolean;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(inquiry.internal_notes ?? "");
  const waPhone = inquiry.phone?.replace(/\D/g, "") || "256703861668";
  const waText = encodeURIComponent(
    `Hi ${inquiry.name}, thank you for your inquiry to The Revamp UG.`,
  );

  return (
    <div className="px-10 py-10 max-w-3xl">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">
            {inquiry.source === "request_this" ? "Piece request" : "Contact form"}
          </p>
          <h1 className="font-serif text-3xl">{inquiry.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(inquiry.created_at).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href={`mailto:${inquiry.email}`}
          className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-xs hover:bg-muted"
        >
          <Mail className="w-3.5 h-3.5" /> {inquiry.email}
        </a>
        {inquiry.phone && (
          <>
            <a
              href={`tel:${inquiry.phone}`}
              className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-xs hover:bg-muted"
            >
              <Phone className="w-3.5 h-3.5" /> {inquiry.phone}
            </a>
            <a
              href={`https://wa.me/${waPhone}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-obsidian text-canvas rounded-full px-4 py-2 text-xs hover:bg-obsidian/90"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </>
        )}
      </div>

      {inquiry.item_name_snapshot && (
        <div className="mb-6 bg-muted/60 border border-border rounded-md p-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-1">
            Piece requested
          </p>
          <p className="font-serif text-lg">{inquiry.item_name_snapshot}</p>
        </div>
      )}

      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Message
        </p>
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
      </div>

      <div className="border-t border-border pt-6 mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onChangeStatus(s)}
              disabled={saving}
              className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded ${
                inquiry.status === s
                  ? "bg-obsidian text-canvas"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Internal notes
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:border-gilded"
          placeholder="Quote sent, follow-up Tuesday…"
        />
        <button
          onClick={() => onSaveNotes(notes)}
          disabled={saving || notes === (inquiry.internal_notes ?? "")}
          className="mt-3 bg-obsidian text-canvas px-5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save notes"}
        </button>
      </div>
    </div>
  );
}
