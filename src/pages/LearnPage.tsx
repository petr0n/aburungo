/**
 * "Today's session" — the guided N5 daily loop.
 *
 * Sequences: review (due items from already-seen units, including due
 * grammar patterns interleaved by due date) -> new unit intro (words,
 * phrases, then the unit's grammar pattern if it has one) -> produce (type
 * what you just learned, including the freshly-taught pattern) ->
 * recognition pass -> close. Reuses existing presentational cards
 * (FlashCard, WordLearnCard, FillBlankCard, GrammarClozeCard,
 * RecognitionPass) driven by local queue state, the same pattern
 * WordsPage/KanaPracticePage already use — the daily-loop orchestrator
 * (src/srs/dailyLoop.ts) only decides *what* goes in the queues.
 *
 * Scope note: review-step ratings persist to local Leitner state only (no
 * server sync yet) — full FSRS source-of-truth for signed-in users is
 * tracked separately in docs/todo.md. Kanji introduced by a unit are shown
 * informationally only, not yet scheduled through SRS (see
 * docs/plans/01-overarching-plan.md open decision #5).
 */
import { useCallback, useEffect, useState } from "react";
import type { GrammarPattern, Phrase, ReviewRating, Unit, Word } from "@/types";
import { isGrammarPattern } from "@/types";
import { useAuth, useUserTier } from "@/store/auth";
import { n5Units } from "@/content/units";
import { wordsForTier } from "@/content/vocabulary";
import { phrasesForTier } from "@/content";
import { findPhrase } from "@/content";
import { getPathProgress, markUnitSeen } from "@/db/pathProgressStore";
import { buildCanDoScope, buildCrossSituationScope, canDoMarkerId, taughtSituations, verifiedCanDos } from "@/srs/canDo";
import { getOne, upsertSynced, hydrateFromServer, recordRating, recordReview } from "@/db/reviewStore";
import { schedule } from "@/srs/leitner";
import { buildDailySession, type DailySession } from "@/srs/dailyLoop";
import { allGrammarPatterns } from "@/content/grammar";
import { PageShell } from "@/components/PageShell";
import { FlashCard, type FlashCardPhase } from "@/components/FlashCard";
import { WordLearnCard } from "@/components/WordLearnCard";
import { FillBlankCard } from "@/components/FillBlankCard";
import { GrammarClozeCard } from "@/components/GrammarClozeCard";
import { RecognitionPass } from "@/components/RecognitionPass";
import { CheckpointSweep } from "@/components/CheckpointSweep";
import { UnitConversation } from "@/components/UnitConversation";
import { CanDoCheckpoint } from "@/components/CanDoCheckpoint";
import { Furigana } from "@/components/Furigana";
import { LoadingPlaceholder, EmptyState, ProgressBar } from "aburungo-design-system";

const PATH_ID = "n5";

type Step =
  | "loading"
  | "review"
  | "new-unit"
  | "checkpoint"
  | "conversation"
  | "can-do"
  | "produce"
  | "recognition"
  | "close"
  | "nothing-due";

/** Which step a checkpoint unit routes to. Non-checkpoint units go to "new-unit". */
const CHECKPOINT_STEP = { sweep: "checkpoint", conversation: "conversation", "can-do": "can-do" } as const;

function stepForUnit(unit: Unit): Step {
  return unit.checkpoint === undefined ? "new-unit" : CHECKPOINT_STEP[unit.checkpoint];
}

// ── Review step — flip cards for already-seen items that are due ───────────────

/** Exported for direct testing — see LearnPage.review.dom.test.tsx. */
export function ReviewStep({ items, onDone }: { items: Array<Phrase | Word | GrammarPattern>; onDone: () => void }) {
  const signedIn = useAuth((s) => s.user !== null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<FlashCardPhase>("entering");
  const [staged, setStaged] = useState<Phrase | Word | null>(null);

  const current = staged ?? items[index] ?? null;

  /**
   * Persist and advance on the click itself — never from the exit animation.
   *
   * This used to run in onExited, which FlipCard fires from onAnimationEnd. The
   * `animate-card-exit` utility is not generated in this project's Tailwind
   * build (the class is only referenced inside the design system, which the
   * content scan does not reach), so animationName computed to `none`, no
   * animationend ever fired, and the review step deadlocked: the card never
   * advanced and the rating was never saved. Verified 2026-08-09 — supplying
   * the animation by hand made the same flow work, withholding it froze.
   *
   * The animation would also be disabled for anyone with prefers-reduced-motion,
   * so correctness must not depend on it under any circumstances. Exit phase is
   * still set, purely for the visual when the animation does run.
   */
  function handleRate(rating: ReviewRating) {
    const item = items[index];
    if (item !== undefined) {
      setStaged(!isGrammarPattern(item) ? item : null);
      void recordRating(item.id, rating, signedIn);
    }
    advance();
  }

  function advance() {
    setStaged(null);
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onDone();
      return;
    }
    setIndex(nextIndex);
    setPhase("entering");
  }

  function handleGrammarNext(correct: boolean) {
    const item = items[index];
    if (item !== undefined) void recordReview(item.id, correct, signedIn);
    advance();
  }

  if (current === null) return null;

  if (isGrammarPattern(current)) {
    const phrase = findPhrase(current.phraseId);
    if (phrase === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Review · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <GrammarClozeCard key={current.id} pattern={current} phrase={phrase} onNext={(correct) => void handleGrammarNext(correct)} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <p className="text-body-sm text-fg-subtle">
        Review · {index + 1} / {items.length}
      </p>
      <ProgressBar value={(index + 1) / items.length} />
      <FlashCard
        key={current.id}
        card={current}
        phase={phase}
        onReveal={() => setPhase("revealed")}
        onRate={handleRate}
        onEntered={() => setPhase("idle")}
        onExited={() => setPhase("idle")}
      />
    </div>
  );
}

// ── New unit step — grammar note, kanji, then each word/phrase in turn ─────────

function PhraseIntroCard({ phrase, index, total, onNext }: { phrase: Phrase; index: number; total: number; onNext: () => void }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onNext} className="text-body-sm text-fg-subtle active:text-fg">
          Skip
        </button>
        <p className="text-body-sm text-fg-subtle">
          {index + 1} / {total}
        </p>
        <div className="w-10" />
      </div>
      <div className="w-full rounded-2xl border border-border bg-bg shadow-card">
        <div className="flex flex-col items-center gap-3 p-6 py-8">
          <Furigana
            japanese={phrase.japanese}
            reading={phrase.reading}
            className="block text-center text-jp-display font-medium text-fg"
          />
          <p className="text-center text-body font-semibold text-fg">{phrase.english}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
      >
        {index + 1 < total ? "Got it — Next" : "Got it — Continue"}
      </button>
    </div>
  );
}

function NewUnitStep({
  unit,
  words,
  phrases,
  pattern,
  onDone,
}: {
  unit: Unit;
  words: Word[];
  phrases: Phrase[];
  pattern: GrammarPattern | null;
  onDone: () => void;
}) {
  const [stage, setStage] = useState<"intro" | "words" | "phrases" | "grammar">("intro");
  const [index, setIndex] = useState(0);
  const currentPhrase = stage === "phrases" ? phrases[index] : undefined;

  useEffect(() => {
    // Defensive only: real unit content always has at least one phrase, so
    // this only fires if a unit is authored with an empty phraseIds list.
    if (stage === "phrases" && currentPhrase === undefined) {
      if (pattern !== null) {
        // Defensive-only branch (see comment above) — bounded to a single
        // extra render, not a cascading loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStage("grammar");
      } else {
        onDone();
      }
    }
  }, [stage, currentPhrase, pattern, onDone]);

  if (stage === "intro") {
    return (
      <div className="flex w-full flex-col gap-6 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-sm font-medium text-brand-700">{unit.situation}</p>
          <p className="text-heading-sm font-semibold text-fg">{unit.title}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-body text-fg">{unit.grammarNote}</p>
        </div>
        {unit.kanji.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm font-medium text-fg-subtle">New kanji today</p>
            <div className="flex gap-2">
              {unit.kanji.map((k) => (
                <span
                  key={k}
                  lang="ja"
                  className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface text-jp-lg"
                  style={{ fontFamily: "var(--font-jp)" }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setStage(words.length > 0 ? "words" : "phrases")}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Start
        </button>
      </div>
    );
  }

  if (stage === "words") {
    const word = words[index];
    if (word === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <ProgressBar value={(index + 1) / words.length} />
        <WordLearnCard
          key={word.id}
          word={word}
          index={index}
          total={words.length}
          onNext={() => {
            const next = index + 1;
            if (next >= words.length) {
              setIndex(0);
              if (phrases.length > 0) {
                setStage("phrases");
              } else if (pattern !== null) {
                setStage("grammar");
              } else {
                onDone();
              }
            } else {
              setIndex(next);
            }
          }}
        />
      </div>
    );
  }

  if (stage === "phrases") {
    const phrase = currentPhrase;
    if (phrase === undefined) return null;

    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <ProgressBar value={(index + 1) / phrases.length} />
        <PhraseIntroCard
          key={phrase.id}
          phrase={phrase}
          index={index}
          total={phrases.length}
          onNext={() => {
            const next = index + 1;
            if (next >= phrases.length) {
              if (pattern !== null) {
                setStage("grammar");
              } else {
                onDone();
              }
            } else {
              setIndex(next);
            }
          }}
        />
      </div>
    );
  }

  if (stage === "grammar" && pattern !== null) {
    const patternPhrase = findPhrase(pattern.phraseId);
    return (
      <div className="flex w-full flex-col gap-6 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-sm font-medium text-brand-700">Grammar pattern</p>
          <p className="text-heading-sm font-semibold text-fg">{pattern.pattern}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-body text-fg">{pattern.gloss}</p>
        </div>
        {patternPhrase !== undefined && (
          <div className="w-full rounded-2xl border border-border bg-bg shadow-card">
            <div className="flex flex-col items-center gap-3 p-6 py-8">
              <Furigana
                japanese={patternPhrase.japanese}
                reading={patternPhrase.reading}
                className="block text-center text-jp-display font-medium text-fg"
              />
              <p className="text-center text-body font-semibold text-fg">{patternPhrase.english}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onDone}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          Got it — Continue
        </button>
      </div>
    );
  }

  return null;
}

// ── Produce step — type what you just learned, forgiving feedback ──────────────

function ProduceStep({ items, onDone }: { items: Array<Phrase | Word | GrammarPattern>; onDone: () => void }) {
  const signedIn = useAuth((s) => s.user !== null);
  const [index, setIndex] = useState(0);
  const current = items[index];

  async function handleNext(correct: boolean) {
    if (current === undefined) return;
    const existing = await getOne(current.id);
    const next = schedule(existing, correct ? "got-it" : "didnt", Date.now(), current.id);
    await upsertSynced(next, signedIn);
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onDone();
      return;
    }
    setIndex(nextIndex);
  }

  if (current === undefined) return null;

  if (isGrammarPattern(current)) {
    const phrase = findPhrase(current.phraseId);
    if (phrase === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Try it · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <GrammarClozeCard key={current.id} pattern={current} phrase={phrase} onNext={(correct) => void handleNext(correct)} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <p className="text-body-sm text-fg-subtle">
        Try it · {index + 1} / {items.length}
      </p>
      <ProgressBar value={(index + 1) / items.length} />
      <FillBlankCard key={current.id} card={current} onNext={(correct) => void handleNext(correct)} />
    </div>
  );
}

// ── Recognition wiring ───────────────────────────────────────────────────────

/**
 * Drop a word the learner failed to recognise back to box 1, so it returns in
 * tomorrow's review step. This is what makes the recognition pass consequential
 * — until 2026-08-08 its result was discarded and the closing "tricky words
 * will come back sooner" was not true of anything.
 *
 * Demotion only. These words were scheduled by the produce step minutes ago, so
 * also promoting on a hit would move a brand-new word 1 -> 2 -> 3 within one
 * session and skip its short reinforcement intervals.
 */
async function demoteMissedWord(wordId: string, signedIn: boolean): Promise<void> {
  const existing = await getOne(wordId);
  await upsertSynced(schedule(existing, "didnt", Date.now(), wordId), signedIn);
}

// ── Close step ───────────────────────────────────────────────────────────────

function CloseStep({ session }: { session: DailySession }) {
  const learnedCount = session.newWords.length + session.newPhrases.length + (session.newGrammarPattern !== null ? 1 : 0);
  return (
    <div className="flex w-full flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-heading font-semibold text-fg">Nice work today.</p>
        {session.unit !== null && learnedCount > 0 && (
          <p className="text-body text-fg-subtle">
            You worked toward: <span className="font-medium text-fg">{session.unit.canDo}</span>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
        {session.reviewItems.length > 0 && (
          <p className="text-body-sm text-fg-subtle">Reviewed {session.reviewItems.length} item(s)</p>
        )}
        {learnedCount > 0 && <p className="text-body-sm text-fg-subtle">Learned {learnedCount} new item(s)</p>}
      </div>
      <a
        href="/"
        className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
      >
        Done for today
      </a>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function LearnPage() {
  const tier = useUserTier();
  const userId = useAuth((s) => s.user?.id ?? null);

  const [step, setStep] = useState<Step>("loading");
  const [session, setSession] = useState<DailySession | null>(null);
  /**
   * The learner's progress list, kept here as well as inside the built session
   * because the two terminal checkpoints read it directly: which situations
   * have been taught, and which can-dos are already verified. Updated
   * optimistically on verification so the remaining count shrinks on screen
   * before the write lands.
   */
  const [seenUnitIds, setSeenUnitIds] = useState<string[]>([]);

  useEffect(() => {
    // Re-runs on tier/userId change (e.g. guest -> signed-in on sign-up mid-session).
    let cancelled = false;
    async function load() {
      const [progress, reviewStates] = await Promise.all([
        getPathProgress(PATH_ID, userId !== null),
        hydrateFromServer(userId !== null),
      ]);
      if (cancelled) return;
      setSeenUnitIds(progress.seenUnitIds);
      const words = wordsForTier(tier);
      const phrases = phrasesForTier(tier);
      const built = buildDailySession(n5Units, progress, words, phrases, allGrammarPatterns, reviewStates, Date.now());
      setSession(built);
      if (built.reviewItems.length > 0) {
        setStep("review");
      } else if (built.unit !== null) {
        setStep(stepForUnit(built.unit));
      } else {
        setStep("nothing-due");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [tier, userId]);

  const finishUnitAndClose = useCallback(async () => {
    if (session?.unit != null) {
      await markUnitSeen(PATH_ID, session.unit.id, userId !== null);
    }
    setStep("close");
  }, [session, userId]);

  function afterReview() {
    const unit = session?.unit ?? null;
    if (unit === null) {
      setStep("close");
      return;
    }
    setStep(stepForUnit(unit));
  }

  // Stable identity: NewUnitStep depends on this in a useEffect (see below),
  // so an inline function here would re-fire that effect on every render.
  const afterNewUnit = useCallback(() => {
    if (session === null) return;
    const produceItems = [...session.newWords, ...session.newPhrases, ...(session.newGrammarPattern ? [session.newGrammarPattern] : [])];
    if (produceItems.length > 0) {
      setStep("produce");
    } else if (session.newWords.length > 0) {
      setStep("recognition");
    } else {
      void finishUnitAndClose();
    }
  }, [session, finishUnitAndClose]);

  function afterProduce() {
    if (session !== null && session.newWords.length > 0) {
      setStep("recognition");
    } else {
      void finishUnitAndClose();
    }
  }

  let content;
  if (step === "loading" || session === null) {
    content = <LoadingPlaceholder label="Preparing today's session…" />;
  } else if (step === "review") {
    content = <ReviewStep items={session.reviewItems} onDone={afterReview} />;
  } else if (step === "new-unit" && session.unit !== null) {
    content = (
      <NewUnitStep
        unit={session.unit}
        words={session.newWords}
        phrases={session.newPhrases}
        pattern={session.newGrammarPattern}
        onDone={afterNewUnit}
      />
    );
  } else if (step === "checkpoint" && session.unit !== null) {
    // Everything taught *before* this checkpoint, not every word in the tier.
    // Identical today, since unit 42 sits last — but a checkpoint inserted
    // mid-ladder later must never quiz material the learner has not met.
    const taughtIds = new Set(
      n5Units.filter((u) => u.order < (session.unit?.order ?? 0)).flatMap((u) => u.wordIds),
    );
    content = (
      <CheckpointSweep
        unit={session.unit}
        words={wordsForTier(tier).filter((w) => taughtIds.has(w.id))}
        onMissed={(word) => void demoteMissedWord(word.id, userId !== null)}
        onDone={() => void finishUnitAndClose()}
      />
    );
  } else if (step === "conversation" && session.unit !== null) {
    content = (
      <UnitConversation
        unit={session.unit}
        scope={buildCrossSituationScope(n5Units, seenUnitIds, wordsForTier(tier))}
        signedIn={userId !== null}
        onDone={() => void finishUnitAndClose()}
      />
    );
  } else if (step === "can-do" && session.unit !== null) {
    const words = wordsForTier(tier);
    content = (
      <CanDoCheckpoint
        unit={session.unit}
        situations={taughtSituations(n5Units, seenUnitIds)}
        verified={verifiedCanDos(seenUnitIds)}
        scopeFor={(situation) => buildCanDoScope(n5Units, situation, words)}
        signedIn={userId !== null}
        onVerified={(situation) => {
          const marker = canDoMarkerId(situation);
          setSeenUnitIds((prev) => (prev.includes(marker) ? prev : [...prev, marker]));
          void markUnitSeen(PATH_ID, marker, userId !== null);
        }}
        onComplete={() => void finishUnitAndClose()}
        // Deliberately does NOT mark the unit seen. This is the last unit on the
        // ladder, so finishing it with can-dos outstanding would leave the
        // learner at "All caught up" with no route back to the ones they left.
        onLater={() => setStep("close")}
      />
    );
  } else if (step === "produce") {
    content = (
      <ProduceStep
        items={[...session.newWords, ...session.newPhrases, ...(session.newGrammarPattern ? [session.newGrammarPattern] : [])]}
        onDone={afterProduce}
      />
    );
  } else if (step === "recognition") {
    content = (
      <RecognitionPass
        queue={session.newWords}
        pool={wordsForTier(tier)}
        onMissed={(word) => void demoteMissedWord(word.id, userId !== null)}
        onDone={() => void finishUnitAndClose()}
        doneLabel="Finish session"
      />
    );
  } else if (step === "nothing-due") {
    content = <EmptyState message="All caught up!" description="Nothing due right now — check back later." />;
  } else {
    content = <CloseStep session={session} />;
  }

  return <PageShell>{content}</PageShell>;
}
