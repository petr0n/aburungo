import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/store/auth";

function isAdminUser(user: { app_metadata?: unknown } | null): boolean {
  if (user === null) return false;
  return (user.app_metadata as Record<string, unknown> | undefined)?.role === "admin";
}

export function AdminLoginPage() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const signIn = useAuth((s) => s.signIn);
  const signInWithGoogle = useAuth((s) => s.signInWithGoogle);
  const signOut = useAuth((s) => s.signOut);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = isAdminUser(user);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err !== null) setError(err);
  }

  async function handleGoogle() {
    setError(null);
    const err = await signInWithGoogle();
    if (err !== null) setError(err);
  }

  if (loading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-body-sm text-fg-subtle">Loading…</p>
      </main>
    );
  }

  // Logged in as admin — show deliberate gate, no auto-redirect
  if (user !== null && isAdmin) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-6 px-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="ctype" style={{ gap: 10 }}>
            <span className="hanko" style={{ fontSize: 48 }} />
            <span className="wm" style={{ fontSize: 36 }}>
              aburungo
              <span className="maru" />
            </span>
          </span>
          <p className="text-body-sm font-medium text-fg-subtle">Admin access</p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <p className="text-center text-body-sm text-fg-subtle">
            Signed in as <span className="font-medium text-fg">{user.email}</span>
          </p>
          <button
            type="button"
            onClick={() => { void navigate("/admin/users"); }}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
          >
            Enter admin area
          </button>
          <button
            type="button"
            onClick={() => { void signOut(); }}
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-border px-5 text-body-sm text-fg-muted active:bg-surface-2"
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  // Logged in but not an admin
  if (user !== null && !isAdmin) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-6 px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body font-medium text-fg">Not authorized</p>
          <p className="text-body-sm text-fg-subtle">
            {user.email} doesn't have admin access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { void signOut(); }}
          className="flex min-h-[44px] items-center rounded-xl border border-border px-5 text-body-sm text-fg-muted active:bg-surface-2"
        >
          Sign out
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-8 px-4 py-12">
      {/* Brand */}
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="ctype" style={{ gap: 10 }}>
          <span className="hanko" style={{ fontSize: 48 }} />
          <span className="wm" style={{ fontSize: 36 }}>
            aburungo
            <span className="maru" />
          </span>
        </span>
        <p className="text-body-sm font-medium text-fg-subtle">Admin access</p>
      </div>

      {/* Google */}
      <div className="w-full">
        <button
          type="button"
          onClick={() => { void handleGoogle(); }}
          disabled={submitting}
          className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-lg border border-border bg-bg px-4 py-2.5 text-body-sm font-medium text-fg shadow-key active:bg-surface disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-body-sm text-fg-faint">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form
          onSubmit={(e) => { void handleSubmit(e); }}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="text-body-sm font-medium text-fg-muted">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              placeholder="admin@example.com"
              className="min-h-[44px] rounded-lg border border-border bg-bg px-3 text-body text-fg placeholder:text-fg-faint focus:border-brand-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-body-sm font-medium text-fg-muted">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              placeholder="Your password"
              className="min-h-[44px] rounded-lg border border-border bg-bg px-3 text-body text-fg placeholder:text-fg-faint focus:border-brand-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {error !== null && (
            <p role="alert" className="rounded-lg bg-error-bg px-3 py-2 text-body-sm text-error-fg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || email.trim() === "" || password === ""}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-40"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
