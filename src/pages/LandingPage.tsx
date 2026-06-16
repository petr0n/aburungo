import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/store/auth";

export function LandingPage() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const signIn = useAuth((s) => s.signIn);
  const signUp = useAuth((s) => s.signUp);
  const signInWithGoogle = useAuth((s) => s.signInWithGoogle);
  const requestPasswordReset = useAuth((s) => s.requestPasswordReset);
  const updatePassword = useAuth((s) => s.updatePassword);
  const isRecovery = useAuth((s) => s.isRecovery);
  const navigate = useNavigate();
  const [hashError] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (!params.has("error")) return null;
    if (params.get("error_code") === "otp_expired") return "That reset link has expired. Request a new one below.";
    return params.get("error_description")?.replace(/\+/g, " ") ?? "Something went wrong. Please try again.";
  });
  const [initialMode] = useState<"forgot-password" | undefined>(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    return params.get("error_code") === "otp_expired" ? "forgot-password" : undefined;
  });

  useEffect(() => {
    if (window.location.hash.includes("error=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!loading && user !== null && !isRecovery) {
      void navigate("/practice", { replace: true });
    }
  }, [user, loading, isRecovery, navigate]);

  if (loading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-body-sm text-fg-subtle">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center px-4 py-10 gap-6">

      {/* Brand */}
      <div className="flex w-full flex-col items-center gap-2 pt-2 text-center">
        <span className="ctype">
          <span className="hanko" style={{ fontSize: 64 }} />
          <h1 className="wm lg">
            aburungo
            <span className="maru" />
          </h1>
          <span className="rule" />
          <span className="kata-vert" style={{ fontSize: 13 }}>
            アブルンゴ
          </span>
        </span>
        <p className="text-body-sm text-fg-subtle">Practical Japanese for real life.</p>
      </div>

      {/* Auth form */}
      <div className="w-full">
        {hashError !== null && (
          <p role="alert" className="mb-4 rounded-lg bg-error-bg px-3 py-2 text-center text-body-sm text-error-fg">
            {hashError}
          </p>
        )}
        <AuthForm
          onSignIn={signIn}
          onSignUp={signUp}
          onGoogleSignIn={signInWithGoogle}
          onForgotPassword={requestPasswordReset}
          onUpdatePassword={updatePassword}
          isRecovery={isRecovery}
          loading={loading}
          initialMode={initialMode}
        />
      </div>

      {/* Skip to practice */}
      <div className="flex w-full flex-col items-center gap-2">
        <p className="text-body-sm text-fg-subtle">No account?</p>
        <Link
          to="/words"
          className="flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-border text-body font-medium text-fg active:bg-surface-hover"
        >
          Try it free — no sign-up needed
        </Link>
      </div>

    </main>
  );
}
