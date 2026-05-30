import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/store/auth";
import { useProgress } from "@/store/progress";
import { PageShell } from "@/components/PageShell";
import { KANA_PRACTICE_CARDS } from "@/lib/kanaData";
import type { KanaScript } from "@/types";

const MASTERY_THRESHOLD = 3;

const TOTAL_KANA: Record<KanaScript, number> = {
  hiragana: [...new Set(KANA_PRACTICE_CARDS.filter((c) => c.script === "hiragana").map((c) => c.kana))].length,
  katakana: [...new Set(KANA_PRACTICE_CARDS.filter((c) => c.script === "katakana").map((c) => c.kana))].length,
};

function GuestView() {
  return (
    <div className="w-full py-16">
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

function TwoToneBar({ reviewed, mastered, total }: { reviewed: number; mastered: number; total: number }) {
  if (total === 0) return null;
  const reviewedPct = Math.min(reviewed / total, 1) * 100;
  const masteredPct = Math.min(mastered / total, reviewed / total) * 100;
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
      <div className="absolute inset-y-0 left-0 rounded-full bg-brand-200 transition-all" style={{ width: `${reviewedPct}%` }} />
      <div className="absolute inset-y-0 left-0 rounded-full bg-brand-600 transition-all" style={{ width: `${masteredPct}%` }} />
    </div>
  );
}

function ResetConfirm({
  label,
  onConfirm,
  onCancel,
}: {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-body-sm text-fg-subtle">Reset {label}?</p>
      <button
        type="button"
        onClick={onConfirm}
        className="rounded-lg px-3 py-1 text-body-sm font-medium text-error-fg active:bg-error-bg"
      >
        Yes, reset
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg px-3 py-1 text-body-sm text-fg-muted active:bg-surface-2"
      >
        Cancel
      </button>
    </div>
  );
}

function SignedInView() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const stats = useProgress((s) => s.stats);
  const kanaProgress = useProgress((s) => s.kanaProgress);
  const resetKana = useProgress((s) => s.resetKana);

  const [resetting, setResetting] = useState<KanaScript | "all" | null>(null);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Account";

  const kanaStats = {
    hiragana: {
      recognized: kanaProgress.filter((e) => e.script === "hiragana" && e.recognizedCount >= MASTERY_THRESHOLD).length,
      recalled: kanaProgress.filter((e) => e.script === "hiragana" && e.recalledCount >= MASTERY_THRESHOLD).length,
      seen: kanaProgress.filter((e) => e.script === "hiragana").length,
    },
    katakana: {
      recognized: kanaProgress.filter((e) => e.script === "katakana" && e.recognizedCount >= MASTERY_THRESHOLD).length,
      recalled: kanaProgress.filter((e) => e.script === "katakana" && e.recalledCount >= MASTERY_THRESHOLD).length,
      seen: kanaProgress.filter((e) => e.script === "katakana").length,
    },
  };

  function handleReset(script: KanaScript | "all") {
    void resetKana(user?.id ?? null, script).then(() => setResetting(null));
  }

  return (
    <div className="w-full py-8">
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

        {/* Streak + totals */}
        {stats && (
          <section className="grid grid-cols-3 gap-3">
            {[
              { label: "Day streak", value: stats.streak },
              { label: "Reviewed today", value: stats.reviewedToday },
              { label: "Total reviewed", value: stats.totalReviewed },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-surface py-4">
                <p className="text-heading font-semibold text-fg">{value}</p>
                <p className="text-caption text-fg-subtle">{label}</p>
              </div>
            ))}
          </section>
        )}

        {/* Phrase progress */}
        {stats && Object.keys(stats.phrases).length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-heading-sm font-semibold text-fg">Phrases</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(stats.phrases)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([level, s]) => (
                  <div key={level} className="flex flex-col gap-2 rounded-2xl border border-border bg-surface px-5 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-body font-medium text-fg">N{level} Phrases</p>
                      <p className="text-body-sm text-fg-subtle">{s.mastered} mastered / {s.reviewed} seen</p>
                    </div>
                    <TwoToneBar reviewed={s.reviewed} mastered={s.mastered} total={s.reviewed} />
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Kana progress */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-semibold text-fg">Kana</h2>
            {(kanaStats.hiragana.seen > 0 || kanaStats.katakana.seen > 0) && (
              resetting === "all" ? (
                <ResetConfirm label="all kana" onConfirm={() => handleReset("all")} onCancel={() => setResetting(null)} />
              ) : (
                <button type="button" onClick={() => setResetting("all")} className="text-body-sm text-fg-faint active:text-fg-muted">
                  Reset all
                </button>
              )
            )}
          </div>

          <div className="flex flex-col gap-3">
            {(["hiragana", "katakana"] as KanaScript[]).map((script) => {
              const s = kanaStats[script];
              const total = TOTAL_KANA[script];
              return (
                <div key={script} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-body font-medium text-fg capitalize">{script}</p>
                    <p className="text-body-sm text-fg-subtle">{s.recalled} recalled / {total} total</p>
                  </div>
                  {s.seen > 0 ? (
                    <>
                      <TwoToneBar reviewed={s.recognized} mastered={s.recalled} total={total} />
                      <div className="flex items-center justify-between">
                        <p className="text-caption text-fg-faint">
                          {s.recognized} recognized &middot; {s.recalled} recalled
                        </p>
                        {resetting === script ? (
                          <ResetConfirm label={script} onConfirm={() => handleReset(script)} onCancel={() => setResetting(null)} />
                        ) : (
                          <button type="button" onClick={() => setResetting(script)} className="text-caption text-fg-faint active:text-fg-muted">
                            Reset
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-body-sm text-fg-faint">Not started yet</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Kanji progress */}
        {stats && Object.keys(stats.kanji).length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-heading-sm font-semibold text-fg">Kanji</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(stats.kanji)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([level, s]) => (
                  <div key={level} className="flex flex-col gap-2 rounded-2xl border border-border bg-surface px-5 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-body font-medium text-fg">N{level} Kanji</p>
                      <p className="text-body-sm text-fg-subtle">{s.mastered} mastered / {s.reviewed} seen</p>
                    </div>
                    <TwoToneBar reviewed={s.reviewed} mastered={s.mastered} total={s.reviewed} />
                  </div>
                ))}
            </div>
          </section>
        )}

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
