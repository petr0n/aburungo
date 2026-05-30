import { Link } from "react-router";
import { useAuth } from "@/store/auth";
import { PageShell } from "@/components/PageShell";

function GuestView() {
  return (
    <div className="mx-auto w-full max-w-sm py-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-heading font-semibold text-fg">Your progress</h2>
          <p className="text-body text-fg-subtle">
            Sign in to track your progress across phrases, kana, and kanji — and pick up exactly where you left off on any device.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
          <p className="text-body-sm font-medium text-fg">What you'll be able to track:</p>
          <ul className="flex flex-col gap-2">
            {[
              "Phrases reviewed and mastered by JLPT level",
              "Hiragana and katakana recognition and recall",
              "Kanji seen and mastered by level",
              "Your review history and daily streak",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-body-sm text-fg-subtle">
                <span className="mt-0.5 shrink-0 text-brand-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
          >
            Sign in or create a free account
          </Link>
          <p className="text-center text-body-sm text-fg-faint">
            Free accounts get N5 + N4 content and progress sync.
          </p>
        </div>
      </div>
    </div>
  );
}

function SignedInView() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Account";

  return (
    <div className="mx-auto w-full max-w-2xl py-8">
      <div className="flex flex-col gap-8">

        {/* Account */}
        <section className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100">
            {avatarUrl !== undefined ? (
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-heading font-semibold text-brand-600">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-body font-semibold text-fg">{displayName}</p>
            <p className="text-body-sm text-fg-subtle">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => { void signOut(); }}
            className="ml-auto flex min-h-[40px] items-center rounded-xl border border-border px-4 text-body-sm text-fg-muted active:bg-surface-2"
          >
            Sign out
          </button>
        </section>

        <hr className="border-border" />

        {/* Progress — placeholder until progress store is built */}
        <section className="flex flex-col gap-4">
          <h2 className="text-heading-sm font-semibold text-fg">Your progress</h2>

          <div className="flex flex-col gap-3">
            {[
              { label: "N5 Phrases", sub: "Fill-in & Flashcards" },
              { label: "Hiragana", sub: "Recognition & recall" },
              { label: "Katakana", sub: "Recognition & recall" },
              { label: "N5 Kanji", sub: "Browse & drill" },
            ].map(({ label, sub }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4"
              >
                <div>
                  <p className="text-body font-medium text-fg">{label}</p>
                  <p className="text-body-sm text-fg-subtle">{sub}</p>
                </div>
                <p className="text-body-sm text-fg-faint">Coming soon</p>
              </div>
            ))}
          </div>

          <p className="text-body-sm text-fg-faint">
            Detailed progress tracking is being built. Your reviews are already being saved.
          </p>
        </section>

      </div>
    </div>
  );
}

export function ProfilePage() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);

  return (
    <PageShell>
      {loading ? null : user === null ? <GuestView /> : <SignedInView />}
    </PageShell>
  );
}
