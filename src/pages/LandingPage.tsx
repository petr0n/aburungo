import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/store/auth";

export function LandingPage() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const signIn = useAuth((s) => s.signIn);
  const signUp = useAuth((s) => s.signUp);
  const requestPasswordReset = useAuth((s) => s.requestPasswordReset);
  const updatePassword = useAuth((s) => s.updatePassword);
  const isRecovery = useAuth((s) => s.isRecovery);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user !== null) {
      void navigate("/practice", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-body-sm text-fg-subtle">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center gap-8 px-4 py-12">

      {/* Brand */}
      <div className="tile-sm on-cream flex w-full flex-col items-center gap-6 rounded-2xl p-10 text-center">
        <span className="ctype">
          <span className="hanko" style={{ fontSize: 80 }} />
          <h1 className="wm lg">
            aburungo
            <span className="maru" />
          </h1>
          <span className="rule" />
          <span className="kata-vert" style={{ fontSize: 14 }}>
            アブルンゴ
          </span>
        </span>
        <p className="text-body text-fg-subtle">Practical Japanese for real life.</p>
      </div>

      {/* Primary CTA */}
      <div className="flex w-full flex-col items-center gap-3">
        <Link
          to="/practice"
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Start learning — it&apos;s free
        </Link>
      </div>

      {/* Tier overview */}
      <section className="on-warm w-full rounded-2xl p-5">
        <div className="grid grid-cols-3 divide-x divide-border text-center">
          <div className="px-3">
            <p className="text-body font-semibold text-fg">Free</p>
            <p className="mt-0.5 text-body-sm text-fg-subtle">N5 content</p>
            <p className="mt-0.5 text-body-sm text-fg-subtle">No account needed</p>
          </div>
          <div className="px-3">
            <p className="text-body font-semibold text-fg">Sign up</p>
            <p className="mt-0.5 text-body-sm text-fg-subtle">N5 + N4 content</p>
            <p className="mt-0.5 text-body-sm text-fg-subtle">Progress sync</p>
          </div>
          <div className="px-3">
            <p className="text-body font-semibold text-fg">Paid</p>
            <p className="mt-0.5 text-body-sm text-fg-subtle">All levels</p>
            <p className="mt-0.5 text-body-sm text-fg-subtle">AI conversation</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="on-warm w-full rounded-2xl p-6">
        <h2 className="mb-4 text-heading-sm font-semibold text-fg">How it works</h2>
        <ol className="flex flex-col gap-3">
          {[
            {
              step: "1",
              title: "See an English phrase",
              body: "Each card shows a real-life situation — ordering food, asking directions, checking into a hotel.",
            },
            {
              step: "2",
              title: "Type or speak the Japanese",
              body: "Type the reading in hiragana, katakana, or romaji — or tap Speak to use your microphone.",
            },
            {
              step: "3",
              title: "Get spaced repetition",
              body: "Cards you know well come back less often. Cards you struggle with come back sooner.",
            },
          ].map(({ step, title, body }) => (
            <li key={step} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-body-sm font-bold text-white">
                {step}
              </span>
              <div>
                <p className="text-body font-medium text-fg">{title}</p>
                <p className="text-body-sm text-fg-subtle">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Auth form — for returning users */}
      <div className="w-full">
        <p className="mb-4 text-center text-body-sm text-fg-subtle">
          Already have an account?{" "}
          <span className="font-medium text-fg">Sign in below.</span>
        </p>
        <AuthForm
          onSignIn={signIn}
          onSignUp={signUp}
          onForgotPassword={requestPasswordReset}
          onUpdatePassword={updatePassword}
          isRecovery={isRecovery}
          loading={loading}
        />
      </div>

    </main>
  );
}
