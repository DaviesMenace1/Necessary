import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — The Revamp UG" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && user) {
    setTimeout(() => navigate({ to: isAdmin ? "/admin" : "/" }), 0);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/admin",
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-canvas">
      <div className="w-full max-w-md">
        <Link to="/" className="text-[10px] uppercase tracking-[0.3em] text-gilded">
          ← Back to site
        </Link>
        <h1 className="font-serif text-4xl mt-6 mb-2">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {mode === "signin"
            ? "Access the Revamp admin panel."
            : "Create your admin account. Only invited emails get admin access."}
        </p>

        <form onSubmit={submit} className="space-y-4">
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-border bg-transparent px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-gilded"
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

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-obsidian text-canvas py-3.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-obsidian/90 disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin"
              ? "Don't have an account? Create one"
              : "Already registered? Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
