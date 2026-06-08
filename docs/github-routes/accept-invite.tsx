import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { acceptInvite, getInviteByToken } from "@/lib/team.functions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const Search = z.object({ token: z.string().min(8).max(128).optional() });

export const Route = createFileRoute("/accept-invite")({
  validateSearch: (s) => Search.parse(s),
  head: () => ({
    meta: [
      { title: "Accept invite — The Revamp UG" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const { token } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const accept = useServerFn(acceptInvite);
  const lookup = useServerFn(getInviteByToken);

  const inviteQ = useQuery({
    queryKey: ["invite-lookup", token],
    queryFn: () => lookup({ data: { token: token! } }),
    enabled: !!token,
    staleTime: 60_000,
  });

  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const invite = inviteQ.data;
  const inviteEmail = invite?.found ? invite.email : null;

  useEffect(() => {
    if (!user) {
      setVerifiedEmail(null);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setVerifiedEmail(data.user?.email ?? null);
    });
  }, [user?.id]);

  useEffect(() => {
    if (loading || !user || !token || status !== "idle") return;
    if (!inviteEmail) return;
    if (!verifiedEmail) return;
    if (verifiedEmail.toLowerCase() !== inviteEmail.toLowerCase()) return;
    setStatus("working");
    accept({ data: { token } })
      .then(() => {
        setStatus("done");
        setTimeout(() => navigate({ to: "/admin" }), 1200);
      })
      .catch((e: unknown) => {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Failed to accept invite.");
      });
  }, [loading, user, token, status, accept, navigate, inviteEmail, verifiedEmail]);

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    setAuthError(null);
    setAuthBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: inviteEmail,
          password,
          options: {
            emailRedirectTo: window.location.href,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: inviteEmail,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAuthBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-canvas px-6 py-20">
      <div className="w-full max-w-md">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gilded mb-3 text-center">
          Team invite
        </p>

        {!token ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl">No invite token.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Use the full link your admin sent you.
            </p>
          </div>
        ) : inviteQ.isLoading ? (
          <p className="text-sm text-muted-foreground text-center">Loading invite…</p>
        ) : !invite?.found ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl">Invite not found.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              This link is invalid or has been revoked.
            </p>
          </div>
        ) : invite.used ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl">Invite already used.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Sign in to your account to continue.
            </p>
            <Link
              to="/login"
              className="inline-block mt-6 bg-obsidian text-canvas px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90"
            >
              Go to sign in
            </Link>
          </div>
        ) : invite.expired ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl">Invite expired.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Ask your admin to send a new invite.
            </p>
          </div>
        ) : status === "done" ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl">You're in.</h1>
            <p className="mt-4 text-sm text-muted-foreground">Redirecting to admin…</p>
          </div>
        ) : status === "error" ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl">Couldn't accept invite.</h1>
            <p className="mt-4 text-sm text-red-600">{message}</p>
          </div>
        ) : loading ? (
          <p className="text-sm text-muted-foreground text-center">Loading…</p>
        ) : user && verifiedEmail && verifiedEmail.toLowerCase() !== inviteEmail!.toLowerCase() ? (
          <div className="text-center">
            <h1 className="font-serif text-3xl">Wrong account.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              This invite is for <span className="text-foreground">{inviteEmail}</span> but
              you're signed in as <span className="text-foreground">{verifiedEmail}</span>.
            </p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setVerifiedEmail(null);
              }}
              className="inline-block mt-6 text-xs uppercase tracking-[0.2em] text-gilded hover:underline"
            >
              Sign out and try again
            </button>
          </div>
        ) : user ? (
          <p className="text-sm text-muted-foreground text-center">Accepting invite…</p>
        ) : (
          <>
            <h1 className="font-serif text-3xl text-center">
              {mode === "signup" ? "Create your account" : "Sign in to accept"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground text-center">
              You've been invited as <span className="text-foreground">{invite.role}</span>{" "}
              with the email <span className="text-foreground">{inviteEmail}</span>.
            </p>

            <form onSubmit={submitAuth} className="space-y-4 mt-8">
              {mode === "signup" && (
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full border border-border bg-transparent px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-gilded"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={inviteEmail!}
                  disabled
                  className="mt-1 w-full border border-border bg-muted/30 px-4 py-3 rounded-md text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border border-border bg-transparent px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-gilded"
                />
              </div>

              {authError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authBusy}
                className="w-full bg-obsidian text-canvas py-3.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
              >
                {authBusy
                  ? "Please wait…"
                  : mode === "signup"
                    ? "Create account & accept"
                    : "Sign in & accept"}
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                {mode === "signup"
                  ? "Already have an account? Sign in"
                  : "New here? Create an account"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
