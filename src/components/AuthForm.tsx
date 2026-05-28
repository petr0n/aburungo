import { useState } from "react";
import { Button, TextInput } from "aburungo-design-system";

type Mode = "sign-in" | "sign-up" | "forgot-password" | "set-new-password";

type Props = {
  onSignIn: (email: string, password: string) => Promise<string | null>;
  onSignUp: (email: string, password: string) => Promise<string | null>;
  onForgotPassword: (email: string) => Promise<string | null>;
  onUpdatePassword: (newPassword: string) => Promise<string | null>;
  isRecovery: boolean;
  loading: boolean;
};

export function AuthForm(props: Props) {
  const { onSignIn, onSignUp, onForgotPassword, onUpdatePassword, isRecovery, loading } = props;

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
