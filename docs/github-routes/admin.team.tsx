import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  createInvite,
  listInvites,
  listTeam,
  removeRole,
  revokeInvite,
} from "@/lib/team.functions";
import { Copy, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/team")({
  component: AdminTeam,
});

function AdminTeam() {
  const qc = useQueryClient();
  const fetchTeam = useServerFn(listTeam);
  const fetchInvites = useServerFn(listInvites);
  const createFn = useServerFn(createInvite);
  const revokeFn = useServerFn(revokeInvite);
  const removeFn = useServerFn(removeRole);

  const { data: members = [], isLoading: lm } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => fetchTeam(),
  });
  const { data: invites = [], isLoading: li } = useQuery({
    queryKey: ["admin-invites-list"],
    queryFn: () => fetchInvites(),
  });

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const createMut = useMutation({
    mutationFn: (vars: { email: string; role: "admin" | "editor" }) =>
      createFn({ data: vars }),
    onSuccess: () => {
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-invites-list"] });
    },
  });
  const revokeMut = useMutation({
    mutationFn: (id: string) => revokeFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-invites-list"] }),
  });
  const removeRoleMut = useMutation({
    mutationFn: (vars: { user_id: string; role: "admin" | "editor" }) =>
      removeFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-team"] }),
  });

  function inviteLink(token: string) {
    return `${window.location.origin}/accept-invite?token=${token}`;
  }

  return (
    <div className="px-10 py-12 max-w-5xl">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-2">Access</p>
          <h1 className="font-serif text-4xl">Team</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            Invite admins and editors. Invitees sign up with the email you invited, then open
            the invite link to gain access.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-obsidian text-canvas px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 inline-flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> Invite
        </button>
      </div>

      <section className="mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-4">Members</h2>
        {lm ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members yet.</p>
        ) : (
          <ul className="border border-border rounded-lg divide-y divide-border">
            {members.map((m) => (
              <li key={m.user_id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{m.full_name || m.email || m.user_id}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {m.roles.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest bg-muted px-2.5 py-1 rounded"
                    >
                      {r}
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${r} role from ${m.email}?`))
                            removeRoleMut.mutate({ user_id: m.user_id, role: r });
                        }}
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-4">
          Pending invites
        </h2>
        {li ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : invites.filter((i) => !i.accepted_at).length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending invites.</p>
        ) : (
          <ul className="border border-border rounded-lg divide-y divide-border">
            {invites
              .filter((i) => !i.accepted_at)
              .map((i) => {
                const expired = new Date(i.expires_at).getTime() < Date.now();
                const link = inviteLink(i.token);
                return (
                  <li
                    key={i.id}
                    className="px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{i.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.role} · expires {new Date(i.expires_at).toLocaleDateString()}
                        {expired && <span className="text-red-600 ml-2">expired</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(link);
                          setCopied(i.id);
                          setTimeout(() => setCopied(null), 1500);
                        }}
                        className="border border-border rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest hover:bg-muted inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3 h-3" />
                        {copied === i.id ? "Copied!" : "Copy link"}
                      </button>
                      <button
                        onClick={() => revokeMut.mutate(i.id)}
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      {open && (
        <InviteModal
          onClose={() => setOpen(false)}
          onCreate={(v) => createMut.mutate(v)}
          pending={createMut.isPending}
          error={createMut.error}
        />
      )}
    </div>
  );
}

function InviteModal({
  onClose,
  onCreate,
  pending,
  error,
}: {
  onClose: () => void;
  onCreate: (v: { email: string; role: "admin" | "editor" }) => void;
  pending: boolean;
  error: Error | null;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({ email, role });
        }}
        className="bg-canvas rounded-lg max-w-md w-full p-8 space-y-6"
      >
        <h2 className="font-serif text-2xl">Invite teammate</h2>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2 block">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-md p-2.5 text-sm focus:outline-none focus:border-gilded"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2 block">
            Role
          </label>
          <div className="flex gap-2">
            {(["editor", "admin"] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 text-[11px] uppercase tracking-widest py-2.5 rounded-md ${
                  role === r
                    ? "bg-obsidian text-canvas"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Editors manage catalog & pages. Admins additionally manage team & settings.
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error.message}</p>}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="border border-border rounded-full px-5 py-2 text-[11px] uppercase tracking-widest hover:bg-muted"
          >
            Cancel
          </button>
          <button
            disabled={pending}
            className="bg-obsidian text-canvas px-6 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
          >
            {pending ? "Creating…" : "Create invite"}
          </button>
        </div>
      </form>
    </div>
  );
}
