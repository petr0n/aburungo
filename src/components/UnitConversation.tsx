import { useState } from "react";
import type { ConversationScope, Unit } from "@/types";
import { createSession } from "@/api/conversation";
import { HanaChat } from "./HanaChat";

type Props = {
  unit: Unit;
  /** Null when the ladder has not taught two situations yet. */
  scope: ConversationScope | null;
  /** Conversation is an authenticated route. Guests get a prompt, not an error. */
  signedIn: boolean;
  onDone: () => void;
};

/**
 * Unit 44 — one unscripted exchange spanning two taught situations (DR-022).
 *
 * The only checkpoint in the app with no right answer on screen. Everything up
 * to here has a card with an answer behind it; this asks the learner to keep a
 * conversation going across a scene change, which is the thing all the cards
 * were for.
 *
 * Nothing is recorded and nothing is judged — Hana never evaluates mid-session
 * by design. Having the conversation is the whole of it. Judging is what unit
 * 45 does, once, afterwards, with a different agent.
 */
export function UnitConversation({ unit, scope, signedIn, onDone }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleStart() {
    if (scope === null) return;
    setStarting(true);
    try {
      const { sessionId: sid } = await createSession("N5", scope);
      setSessionId(sid);
    } catch {
      // Offline, server down, or no API budget. The ladder must not dead-end on
      // any of those, so this degrades to a continue affordance.
      setFailed(true);
    } finally {
      setStarting(false);
    }
  }

  if (sessionId !== null) {
    return (
      <HanaChat
        sessionId={sessionId}
        title={unit.title}
        onEnd={onDone}
        endLabel="← Finish"
        turnLimit={scope?.maxTurns ?? 6}
        onFinish={onDone}
        finishLabel="Finish session"
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-body-sm uppercase tracking-widest text-fg-faint">{unit.situation}</p>
        <p className="text-heading font-semibold text-fg">{unit.title}</p>
        <p className="text-body text-fg-subtle">{unit.canDo}</p>
      </div>

      {scope !== null && !failed && signedIn && (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-body-sm text-fg-subtle">Today's scene</p>
          <p className="text-body text-fg">{scope.situation}</p>
        </div>
      )}

      <p className="text-body-sm text-fg-subtle">{unit.grammarNote}</p>

      {!signedIn && (
        // Soft prompt, not a redirect (CLAUDE.md). Distinguishing this from an
        // outage matters: "sign in" is something the learner can act on,
        // "unreachable" reads as the app being broken.
        <p className="text-body-sm text-fg-subtle">
          Talking with Hana needs an account, because it runs on a paid AI service. Everything else on
          the ladder stays free.
        </p>
      )}

      {signedIn && failed && (
        <p className="text-body-sm text-fg-subtle">
          Hana is not reachable right now. Nothing is lost — you can pick this up next time.
        </p>
      )}

      <button
        type="button"
        onClick={() => (!signedIn || scope === null || failed ? onDone() : void handleStart())}
        disabled={starting}
        className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-60"
      >
        {starting ? "Starting…" : !signedIn || scope === null || failed ? "Continue" : "Start conversation"}
      </button>
    </div>
  );
}
