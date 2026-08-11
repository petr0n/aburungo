import { useState } from "react";
import { Link } from "react-router";
import { createSession, type JlptLevel } from "@/api/conversation";
import { useAuth } from "@/store/auth";
import { PageShell } from "@/components/PageShell";
import { HanaChat } from "@/components/HanaChat";

const JLPT_LEVELS: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export function ConversationPage() {
  const [jlpt, setJlpt] = useState<JlptLevel>("N5");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  async function handleStart() {
    setStarting(true);
    try {
      const { sessionId: sid } = await createSession(jlpt);
      setSessionId(sid);
    } finally {
      setStarting(false);
    }
  }

  // Guest gate — soft prompt, no redirect
  const user = useAuth((s) => s.user);
  const authLoading = useAuth((s) => s.loading);
  if (!authLoading && user === null) {
    return (
      <PageShell>
        <div className="flex w-full flex-col items-center gap-6 py-16 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-heading-sm font-semibold text-fg">Sign in to chat with Hana</p>
            <p className="text-body-sm text-fg-subtle">
              Conversation practice uses AI and is available to signed-in users. Create a free account to get started.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Link
              to="/"
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Sign in or create account
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (sessionId === null) {
    return (
      <PageShell>
        <div className="w-full flex-1">
          <div className="flex flex-col gap-8 py-6">
            <div className="flex flex-col gap-2">
              <p className="text-body text-fg">Practice with Hana, your Japanese conversation partner.</p>
              <p className="text-body-sm text-fg-subtle">
                She'll match your level and gently correct mistakes by modelling the right form inline.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-body-sm font-medium text-fg">Your JLPT level</p>
              <div className="flex gap-2">
                {JLPT_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setJlpt(level)}
                    className={[
                      "flex min-h-[40px] flex-1 items-center justify-center rounded-xl text-body-sm font-medium transition-colors",
                      jlpt === level
                        ? "bg-brand-600 text-white"
                        : "border border-border bg-surface text-fg-subtle active:bg-surface-2",
                    ].join(" ")}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pb-8">
              <button
                type="button"
                onClick={() => void handleStart()}
                disabled={starting}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-60"
              >
                {starting ? "Starting…" : "Start conversation"}
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // Chat screen — needs overflow scrolling, so uses a flex-col that fills remaining height
  return (
    <PageShell>
      <HanaChat sessionId={sessionId} title={`Hana · ${jlpt}`} onEnd={() => setSessionId(null)} />
    </PageShell>
  );
}
