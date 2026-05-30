import { useState } from "react";
import { Button, TextInput } from "aburungo-design-system";

type Mode = "sign-in" | "sign-up" | "forgot-password" | "set-new-password";

type Props = {
  onSignIn: (email: string, password: string) => Promise<string | null>;
  onSignUp: (email: string, password: string) => Promise<string | null>;
  onGoogleSignIn: () => Promise<string | null>;
  onForgotPassword: (email: string) => Promise<string | null>;
  onUpdatePassword: (newPassword: string) => Promise<string | null>;
  isRecovery: boolean;
  loading: boolean;
};

export function AuthForm(props: Props) {
  const { onSignIn, onSignUp, onGoogleSignIn, onForgotPassword, onUpdatePassword, isRecovery, loading } = props;

  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Derive the active mode from the prop — avoids setState-in-effect lint error.
  // When isRecovery is true (Supabase PASSWORD_RECOVERY event), always show the
  // set-new-password form regardless of what mode state holds.
  const effectiveMode: Mode = isRecovery ? "set-new-password" : mode;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (effectiveMode === "sign-in") {
      const err = await onSignIn(email.trim(), password);
      if (err !== null) setError(err);
    } else if (effectiveMode === "sign-up") {
      const err = await onSignUp(email.trim(), password);
      if (err !== null) setError(err);
    } else if (effectiveMode === "forgot-password") {
      const err = await onForgotPassword(email.trim());
      if (err !== null) {
        setError(err);
      } else {
        setResetSent(true);
      }
    } else if (effectiveMode === "set-new-password") {
      const err = await onUpdatePassword(password);
      if (err !== null) {
        setError(err);
      } else {
        setPasswordUpdated(true);
        setPassword("");
        setMode("sign-in");
      }
    }
  }

  function toggleMode() {
    setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"));
    setError(null);
    setResetSent(false);
  }

  const isSignIn = effectiveMode === "sign-in";

  if (effectiveMode === "forgot-password") {
    return (
      <div className="mx-auto w-full max-w-sm">
        {resetSent ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-body text-fg">Check your email for a reset link.</p>
            <button
              type="button"
              onClick={() => {
                setMode("sign-in");
                setResetSent(false);
                setEmail("");
              }}
              className="min-h-[44px] text-body-sm font-medium text-brand-500 underline-offset-2"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            noValidate
            className="flex flex-col gap-4"
          >
            <p className="text-body-sm text-fg-subtle">Enter your email and we'll send you a reset link.</p>
            <TextInput
              id="reset-email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              disabled={loading}
              placeholder="you@example.com"
            />
            {error !== null && (
              <p role="alert" className="rounded-lg bg-error-bg px-3 py-2 text-body-sm text-error-fg">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={email.trim() === ""}
              loading={loading}
              fullWidth
              className="bg-brand-500 text-fg-inverse active:opacity-80"
            >
              Send reset link
            </Button>
            <button
              type="button"
              onClick={() => {
                setMode("sign-in");
                setError(null);
              }}
              className="min-h-[44px] text-center text-body-sm font-medium text-brand-500 underline-offset-2"
            >
              Back to sign in
            </button>
          </form>
        )}
      </div>
    );
  }

  if (effectiveMode === "set-new-password") {
    return (
      <div className="mx-auto w-full max-w-sm">
        {passwordUpdated ? (
          <p className="text-center text-body text-fg">Password updated. You can now sign in.</p>
        ) : (
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            noValidate
            className="flex flex-col gap-4"
          >
            <p className="text-body-sm text-fg-subtle">Choose a new password.</p>
            <TextInput
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              disabled={loading}
              placeholder="New password"
            />
            {error !== null && (
              <p role="alert" className="rounded-lg bg-error-bg px-3 py-2 text-body-sm text-error-fg">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={password === ""}
              loading={loading}
              fullWidth
              className="bg-brand-500 text-fg-inverse active:opacity-80"
            >
              Set new password
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      {passwordUpdated && (
        <p className="mb-4 rounded-lg bg-success-bg px-3 py-2 text-center text-body-sm text-success-fg">
          Password updated. Sign in with your new password.
        </p>
      )}

      <button
        type="button"
        onClick={() => { void onGoogleSignIn().then((err) => { if (err !== null) setError(err); }); }}
        disabled={loading}
        className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-lg border border-line bg-paper px-4 py-2.5 text-body-sm font-medium text-fg shadow-key active:opacity-80 disabled:opacity-50"
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
        <span className="h-px flex-1 bg-line" />
        <span className="text-body-sm text-fg-faint">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        <TextInput
          id="auth-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          disabled={loading}
          placeholder="you@example.com"
        />

        <TextInput
          id="auth-password"
          label="Password"
          type="password"
          autoComplete={isSignIn ? "current-password" : "new-password"}
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          disabled={loading}
          placeholder={isSignIn ? "Your password" : "Choose a password"}
        />

        {error !== null ? (
          <p role="alert" className="rounded-lg bg-error-bg px-3 py-2 text-body-sm text-error-fg">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={email.trim() === "" || password === ""}
          loading={loading}
          fullWidth
          className="bg-brand-500 text-fg-inverse active:opacity-80"
        >
          {isSignIn ? "Sign in" : "Create account"}
        </Button>
      </form>

      {isSignIn && (
        <p className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              setMode("forgot-password");
              setError(null);
            }}
            disabled={loading}
            className="min-h-[44px] text-body-sm text-fg-subtle underline-offset-2 hover:text-fg disabled:opacity-50"
          >
            Forgot password?
          </button>
        </p>
      )}

      <p className="mt-2 text-center text-body-sm text-fg-subtle">
        {isSignIn ? "New here?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={toggleMode}
          disabled={loading}
          className="min-h-[44px] font-medium text-brand-500 underline-offset-2 active:opacity-80 disabled:opacity-50"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
