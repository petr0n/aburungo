/**
 * "Today's session" — the guided N5 daily loop (Phase 1 slice, Units 1-3).
 *
 * Sequences: review (due items from already-seen units) -> new unit intro ->
 * produce (type what you just learned) -> recognition pass -> close.
 * Reuses existing presentational cards (FlashCard, WordLearnCard,
 * FillBlankCard, RecognitionPass) driven by local queue state, the same
 * pattern WordsPage/KanaPracticePage already use — the daily-loop
 * orchestrator (src/srs/dailyLoop.ts) only decides *what* goes in the queues.
 *
 * Scope note: review-step ratings persist to local Leitner state only (no
 * server sync yet) — full FSRS source-of-truth for signed-in users is
 * tracked separately in docs/todo.md. Kanji introduced by a unit are shown
 * informationally only, not yet scheduled through SRS (see
 * docs/plans/01-overarching-plan.md open decision #5).
 */
import { useEffect, useState } from "react";
import type { Phrase, ReviewRating, Unit, Word } from "@/types";
import { useAuth, useUserTier } from "@/store/auth";
import { n5Units } from "@/content/units";
import { wordsForTier } from "@/content/vocabulary";
import { phrasesForTier } from "@/content";
import { getPathProgress, markUnitSeen } from "@/db/pathProgressStore";
import { getAll, getOne, upsert } from "@/db/reviewStore";
import { schedule } from "@/srs/leitner";
import { buildDailySession, type DailySession } from "@/srs/dailyLoop";
import { PageShell } from "@/components/PageShell";
import { FlashCard, type FlashCardPhase } from "@/components/FlashCard";
import { WordLearnCard } from "@/components/WordLearnCard";
import { FillBlankCard } from "@/components/FillBlankCard";
import { RecognitionPass } from "@/components/RecognitionPass";
import { Furigana } from "@/components/Furigana";
import { LoadingPlaceholder, EmptyState, ProgressBar } from "aburungo-design-system";

const PATH_ID = "n5";

type Step = "loading" | "review" | "new-unit" | "produce" | "recognition" | "close" | "nothing-due";

// ── Review step — flip cards for already-seen items that are due ───────────────

function ReviewStep({ items, onDone }: { items: Array<Phrase | Word>; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<FlashCardPhase>("entering");
  const [staged, setStaged] = useState<Phrase | Word | null>(null);
  const [pendingRating, setPendingRating] = useState<ReviewRating | null>(null);

  const current = staged ?? items[index] ?? null;

  function handleRate(rating: ReviewRating) {
    setStaged(items[index] ?? null);
    setPendingRating(rating);
    setPhase("exiting");
  }

  async function handleExited() {
    const item = items[index];
    if (item !== undefined) {
      const existing = await getOne(item.id);
      const next = schedule(existing, pendingRating ?? "didnt", Date.now(), item.id);
      await upsert(next);
    }
    setPendingRating(null);
    setStaged(null);
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onDone();
      return;
    }
    setIndex(nextIndex);
    setPhase("entering");
  }

  if (current === null) return null;

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
        onExited={() => void handleExited()}
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

function NewUnitStep({ unit, words, phrases, onDone }: { unit: Unit; words: Word[]; phrases: Phrase[]; onDone: () => void }) {
  const [stage, setStage] = useState<"intro" | "words" | "phrases">("intro");
  const [index, setIndex] = useState(0);
  const currentPhrase = stage === "phrases" ? phrases[index] : undefined;

  useEffect(() => {
    // Defensive only: real unit content always has at least one phrase, so
    // this only fires if a unit is authored with an empty phraseIds list.
    if (stage === "phrases" && currentPhrase === undefined) onDone();
  }, [stage, currentPhrase, onDone]);

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
              setStage("phrases");
              if (phrases.length === 0) onDone();
            } else {
              setIndex(next);
            }
          }}
        />
      </div>
    );
  }

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
            onDone();
          } else {
            setIndex(next);
          }
        }}
      />
    </div>
  );
}

// ── Produce step — type what you just learned, forgiving feedback ──────────────

function ProduceStep({ items, onDone }: { items: Array<Phrase | Word>; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const current = items[index];

  async function handleNext(correct: boolean) {
    const existing = await getOne(current.id);
    const next = schedule(existing, correct ? "got-it" : "didnt", Date.now(), current.id);
    await upsert(next);
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      onDone();
      return;
    }
    setIndex(nextIndex);
  }

  if (current === undefined) return null;

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

// ── Close step ───────────────────────────────────────────────────────────────

function CloseStep({ session }: { session: DailySession }) {
  const learnedCount = session.newWords.length + session.newPhrases.length;
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

  useEffect(() => {
    // Re-runs on tier/userId change (e.g. guest -> signed-in on sign-up mid-session).
    let cancelled = false;
    async function load() {
      const [progress, reviewStates] = await Promise.all([getPathProgress(PATH_ID), getAll()]);
      if (cancelled) return;
      const words = wordsForTier(tier);
      const phrases = phrasesForTier(tier);
      const built = buildDailySession(n5Units, progress, words, phrases, reviewStates, Date.now());
      setSession(built);
      if (built.reviewItems.length > 0) {
        setStep("review");
      } else if (built.unit !== null) {
        setStep("new-unit");
      } else {
        setStep("nothing-due");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [tier, userId]);

  async function finishUnitAndClose() {
    if (session?.unit != null) {
      await markUnitSeen(PATH_ID, session.unit.id);
    }
    setStep("close");
  }

  function afterReview() {
    setStep(session?.unit !== null ? "new-unit" : "close");
  }

  function afterNewUnit() {
    if (session === null) return;
    const produceItems = [...session.newWords, ...session.newPhrases];
    if (produceItems.length > 0) {
      setStep("produce");
    } else if (session.newWords.length > 0) {
      setStep("recognition");
    } else {
      void finishUnitAndClose();
    }
  }

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
      <NewUnitStep unit={session.unit} words={session.newWords} phrases={session.newPhrases} onDone={afterNewUnit} />
    );
  } else if (step === "produce") {
    content = <ProduceStep items={[...session.newWords, ...session.newPhrases]} onDone={afterProduce} />;
  } else if (step === "recognition") {
    content = (
      <RecognitionPass
        queue={session.newWords}
        pool={wordsForTier(tier)}
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
