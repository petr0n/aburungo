import { useState } from "react";
import type { ConversationScope, Lesson } from "@/types";
import { assessCanDo, createSession } from "@/api/conversation";
import { HanaChat } from "./HanaChat";

type Props = {
  lesson: Lesson;
  /** Every situation the learner has been taught, in ladder order. */
  situations: string[];
  /** Situations already verified on a previous visit. */
  verified: Set<string>;
  scopeFor: (situation: string) => ConversationScope | null;
  /** Conversation is an authenticated route. Guests get a prompt, not an error. */
  signedIn: boolean;
  /** Persist a newly verified can-do. */
  onVerified: (situation: string) => void;
  /** Every can-do verified — the level is finished. */
  onComplete: () => void;
  /** Leave with work outstanding. The lesson must stay on the ladder. */
  onLater: () => void;
};

type Screen = "list" | "chat" | "assessing" | "result";

/**
 * Learner turns before "Finish and check" appears.
 *
 * Deliberately lower than the scope's turn budget. Someone who handles the
 * situation in three lines should not have to pad the conversation to be
 * allowed to check it — the assessor judges whether the exchange worked, so
 * length is its problem, not the button's.
 */
const MIN_TURNS_BEFORE_CHECK = 2;

type Result = { situation: string; verified: boolean; note: string };

/**
 * Lesson 45 — the can-do checkpoint (DR-022).
 *
 * The learner picks a situation, plays it through with Hana, and a separate
 * assessor reads the transcript afterwards and decides whether the exchange
 * actually worked. Two agents, because a conversation partner who is also
 * grading you is not a conversation partner.
 *
 * A gate, not a grade, by the test in CLAUDE.md: the number on screen is how
 * many can-dos are left, it only ever shrinks, retries are unlimited and
 * nothing is tallied. A situation that is not verified simply stays on the
 * list. There is no total, no ratio, and no record of how many attempts a
 * can-do took.
 *
 * Leaving early does not finish the lesson — `onLater` deliberately does not mark
 * it seen, so the checkpoint is still there tomorrow. Finishing it any other
 * way would strand a learner one can-do short with no route back.
 */
export function CanDoCheckpoint({
  lesson,
  situations,
  verified,
  scopeFor,
  signedIn,
  onVerified,
  onComplete,
  onLater,
}: Props) {
  const [screen, setScreen] = useState<Screen>("list");
  const [active, setActive] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [failed, setFailed] = useState(false);
  /**
   * Verified in this sitting, tracked here as well as handed to the parent.
   *
   * Persistence is the parent's job and it is asynchronous, so waiting for the
   * `verified` prop to come back would make the screen's own state depend on a
   * round-trip it does not control — a slow or failed write would leave the
   * last can-do looking outstanding right after the learner earned it.
   */
  const [justVerified, setJustVerified] = useState<Set<string>>(new Set());

  const done = new Set([...verified, ...justVerified]);
  const remaining = situations.filter((s) => !done.has(s));

  async function handlePick(situation: string) {
    const scope = scopeFor(situation);
    if (scope === null || !signedIn) return;

    setActive(situation);
    setFailed(false);
    try {
      const { sessionId: sid } = await createSession("N5", scope);
      setSessionId(sid);
      setScreen("chat");
    } catch {
      setFailed(true);
    }
  }

  async function handleCheck() {
    if (sessionId === null || active === null) return;
    setScreen("assessing");
    try {
      const scope = scopeFor(active);
      const outcome = await assessCanDo(sessionId, scope?.canDo ?? active, active);
      if (outcome.verified) {
        setJustVerified((prev) => new Set(prev).add(active));
        onVerified(active);
      }
      setResult({ situation: active, ...outcome });
    } catch {
      // Never strand the learner on a spinner because the assessor was
      // unreachable. Unverified is the safe direction — the situation stays on
      // the list and can be run again for free.
      setResult({
        situation: active,
        verified: false,
        note: "Could not check that one just now — give it another go when you are ready.",
      });
    } finally {
      setScreen("result");
      setSessionId(null);
    }
  }

  if (screen === "chat" && sessionId !== null && active !== null) {
    return (
      <HanaChat
        sessionId={sessionId}
        title={active}
        onEnd={() => {
          setScreen("list");
          setSessionId(null);
        }}
        endLabel="← Back"
        turnLimit={MIN_TURNS_BEFORE_CHECK}
        onFinish={() => void handleCheck()}
        finishLabel="Finish and check"
      />
    );
  }

  if (screen === "assessing") {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-16">
        <p className="text-body text-fg-subtle">Reading back your conversation…</p>
      </div>
    );
  }

  if (screen === "result" && result !== null) {
    const allDone = remaining.length === 0;
    return (
      <div className="flex w-full flex-col gap-6 py-8">
        <div className="flex flex-col gap-2">
          <p className="text-body-sm uppercase tracking-widest text-fg-faint">{result.situation}</p>
          <p className="text-heading font-semibold text-fg">{result.verified ? "That worked." : "Not yet."}</p>
          <p className="text-body text-fg-subtle">{result.note}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            if (allDone) onComplete();
            else setScreen("list");
          }}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          {allDone ? "Finish" : "Back to the list"}
        </button>
      </div>
    );
  }

  if (remaining.length === 0 && situations.length > 0) {
    return (
      <div className="flex w-full flex-col gap-6 py-8">
        <div className="flex flex-col gap-2">
          <p className="text-heading font-semibold text-fg">Every situation checked off.</p>
          <p className="text-body text-fg-subtle">
            You have held a conversation in each one, unaided. That is the whole of N5 done.
          </p>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Finish
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-body-sm uppercase tracking-widest text-fg-faint">{lesson.situation}</p>
        <p className="text-heading font-semibold text-fg">{lesson.title}</p>
        <p className="text-body-sm text-fg-subtle">{lesson.grammarNote}</p>
      </div>

      {!signedIn && (
        // Soft prompt, not a redirect (CLAUDE.md). Distinct from the outage
        // message below: one is something the learner can act on, the other
        // reads as the app being broken.
        <p className="text-body-sm text-fg-subtle">
          Checking off a situation needs an account, because it runs on a paid AI service. Everything
          else on the ladder stays free.
        </p>
      )}

      {signedIn && failed && (
        <p className="text-body-sm text-fg-subtle">
          Hana is not reachable right now. Nothing is lost — the ones you have checked off stay checked off.
        </p>
      )}

      <p className="text-body-sm text-fg-subtle">
        {remaining.length === 1 ? "1 situation to go" : `${remaining.length} situations to go`}
      </p>

      <div className="flex flex-col gap-2">
        {situations.map((situation) => {
          const checked = done.has(situation);
          return (
            <button
              key={situation}
              type="button"
              // Disabled for guests too: an enabled button that silently does
              // nothing is worse than an obviously unavailable one.
              disabled={checked || !signedIn}
              onClick={() => void handlePick(situation)}
              className={[
                "flex min-h-[52px] w-full items-center justify-between rounded-2xl border px-4 text-body",
                checked
                  ? "border-border bg-surface-2 text-fg-subtle"
                  : "border-border bg-surface text-fg active:bg-surface-2",
              ].join(" ")}
            >
              <span>{situation}</span>
              <span aria-hidden>{checked ? "✓" : "→"}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onLater}
        className="flex min-h-[44px] w-full items-center justify-center text-body-sm text-fg-subtle active:text-fg"
      >
        Come back to this later
      </button>
    </div>
  );
}
