/**
 * "Today's session" — the guided N5 daily loop.
 *
 * Sequences: review (due items from already-seen lessons, including due
 * grammar patterns interleaved by due date) -> new lesson intro (words,
 * phrases, then the lesson's grammar pattern if it has one) -> produce (type
 * what you just learned, including the freshly-taught pattern) ->
 * recognition pass -> close. Reuses existing presentational cards
 * (FlashCard, WordLearnCard, FillBlankCard, GrammarClozeCard,
 * RecognitionPass) driven by local queue state, the same pattern
 * WordsPage/KanaPracticePage already use — the daily-loop orchestrator
 * (src/srs/dailyLoop.ts) only decides *what* goes in the queues.
 *
 * Scope note: review-step ratings persist to local Leitner state only (no
 * server sync yet) — full FSRS source-of-truth for signed-in users is
 * tracked separately in docs/todo.md. Kanji introduced by a lesson are
 * shown on KanjiIntroCard in the new-lesson step and come back through the
 * review step on KanjiDrillCard, recognition only.
 */
import { useCallback, useEffect, useState } from "react";
import type { Book, GrammarPattern, Kanji, Phrase, ReviewRating, Lesson, Word } from "@/types";
import { isGrammarPattern, isKanji } from "@/types";
import { useAuth, useUserTier } from "@/store/auth";
import { bookOne, priorBooks } from "@/content/books";
import { chapterLabel, placeInChapter } from "@/content/chapters";
import { phrasesForTier, wordsForTier } from "@/content/access";
import { findPhrase } from "@/content";
import { getPathProgress, markLessonSeen } from "@/db/pathProgressStore";
import { buildCanDoScope, buildCrossSituationScope, canDoMarkerId, taughtSituations, verifiedCanDos } from "@/srs/canDo";
import { getOne, upsertSynced, hydrateFromServer, recordRating, recordReview } from "@/db/reviewStore";
import { schedule } from "@/srs/leitner";
import { buildDailySession, type DailySession } from "@/srs/dailyLoop";
import { allGrammarPatterns } from "@/content/grammar";
import { allKanji } from "@/content/kanji";
import { PageShell } from "@/components/PageShell";
import { FlashCard, type FlashCardPhase } from "@/components/FlashCard";
import { WordLearnCard } from "@/components/WordLearnCard";
import { FillBlankCard } from "@/components/FillBlankCard";
import { GrammarClozeCard } from "@/components/GrammarClozeCard";
import { RecognitionPass } from "@/components/RecognitionPass";
import { RecognitionCheckpoint } from "@/components/RecognitionCheckpoint";
import { ProductionCheckpoint } from "@/components/ProductionCheckpoint";
import { LessonConversation } from "@/components/LessonConversation";
import { CanDoCheckpoint } from "@/components/CanDoCheckpoint";
import { Furigana } from "@/components/Furigana";
import { KanjiIntroCard } from "@/components/KanjiIntroCard";
import { KanjiDrillCard } from "@/components/KanjiDrillCard";
import { LoadingPlaceholder, EmptyState, ProgressBar } from "aburungo-design-system";

type Step =
  | "loading"
  | "review"
  | "new-lesson"
  | "checkpoint"
  | "production"
  | "conversation"
  | "can-do"
  | "produce"
  | "recognition"
  | "close"
  | "nothing-due";

/** Which step a checkpoint lesson routes to. Non-checkpoint lessons go to "new-lesson". */
const CHECKPOINT_STEP = {
  recognition: "checkpoint",
  production: "production",
  conversation: "conversation",
  "can-do": "can-do",
} as const;

function stepForLesson(lesson: Lesson): Step {
  return lesson.checkpoint === undefined ? "new-lesson" : CHECKPOINT_STEP[lesson.checkpoint];
}

/**
 * Whether this session runs with the per-book difficulty shift (03 §0b) —
 * recall as the review gate and the romaji cut. The third behavior §0b names,
 * the production-first produce beat, waits on authored frames (see ProduceStep).
 *
 * A book carries the shift as a field. In dev builds `?shift=1` forces it on,
 * so the Book Two behaviors are provable against Book One content before any
 * Book Two content exists. Dev-only by design: production knows no override.
 */
function isShifted(book: Book): boolean {
  if (book.stage !== "foundation") return true;
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get("shift") === "1";
}

// ── Review step — flip cards for already-seen items that are due ───────────────

/**
 * Exported for direct testing — see LearnPage.review.dom.test.tsx.
 *
 * `shifted` swaps the default gate from recognition to recall (03 §2): instead
 * of flip-and-self-rate, the learner types the item from its English, and the
 * checked result feeds the same Leitner rating the flip card's buttons do.
 */
export function ReviewStep({
  items,
  shifted = false,
  onDone,
}: {
  items: Array<Phrase | Word | GrammarPattern | Kanji>;
  shifted?: boolean;
  onDone: () => void;
}) {
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
      setStaged(!isGrammarPattern(item) && !isKanji(item) ? item : null);
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

  /**
   * Recognition only (DR-024, spec decision 4): the learner reads the
   * character and judges their own recall. There is no path here that asks
   * them to produce one.
   */
  function handleKanjiNext(correct: boolean) {
    const item = items[index];
    if (item !== undefined) void recordReview(item.id, correct, signedIn);
    advance();
  }

  /** The recall gate: a checked typed answer maps onto the same binary rating. */
  function handleRecallNext(correct: boolean) {
    const item = items[index];
    if (item !== undefined) void recordRating(item.id, correct ? "got-it" : "didnt", signedIn);
    advance();
  }

  if (current === null) return null;

  if (isKanji(current)) {
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Review · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <KanjiDrillCard
          key={current.id}
          kanji={current}
          phase={phase}
          onReveal={() => setPhase("revealed")}
          onRate={(correct) => handleKanjiNext(correct)}
          onEntered={() => setPhase("idle")}
          onExited={() => {}}
        />
      </div>
    );
  }

  if (isGrammarPattern(current)) {
    const phrase = findPhrase(current.phraseId);
    if (phrase === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Review · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <GrammarClozeCard
          key={current.id}
          pattern={current}
          phrase={phrase}
          showRomaji={!shifted}
          onNext={(correct) => void handleGrammarNext(correct)}
        />
      </div>
    );
  }

  if (shifted) {
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        <p className="text-body-sm text-fg-subtle">
          Review · {index + 1} / {items.length}
        </p>
        <ProgressBar value={(index + 1) / items.length} />
        <FillBlankCard key={current.id} card={current} showRomaji={false} onNext={(correct) => void handleRecallNext(correct)} />
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

// ── New lesson step — grammar note, kanji, then each word/phrase in turn ─────────

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

function NewLessonStep({
  book,
  lesson,
  words,
  phrases,
  pattern,
  newKanji,
  shifted,
  onDone,
}: {
  book: Book;
  lesson: Lesson;
  words: Word[];
  phrases: Phrase[];
  pattern: GrammarPattern | null;
  newKanji: Kanji[];
  shifted: boolean;
  onDone: () => void;
}) {
  const [stage, setStage] = useState<"intro" | "words" | "phrases" | "grammar">("intro");
  const [index, setIndex] = useState(0);
  const placement = placeInChapter(lesson, book.lessons, book.chapters);
  const currentPhrase = stage === "phrases" ? phrases[index] : undefined;

  useEffect(() => {
    // Defensive only: real lesson content always has at least one phrase, so
    // this only fires if a lesson is authored with an empty phraseIds list.
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
          <p className="text-body-sm font-medium text-brand-700">
            {placement === null ? lesson.situation : `${chapterLabel(placement.chapter)} · ${placement.chapter.title}`}
          </p>
          <p className="text-heading-sm font-semibold text-fg">{lesson.title}</p>
          {placement !== null && placement.lessonNumber !== null && (
            <p className="text-body-sm text-fg-subtle">
              {lesson.situation} · Lesson {placement.lessonNumber} of {placement.lessonCount}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-body text-fg">{lesson.grammarNote}</p>
        </div>
        {newKanji.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm font-medium text-fg-subtle">New kanji today</p>
            <div className="flex flex-col gap-2">
              {newKanji.map((k) => (
                <KanjiIntroCard key={k.id} kanji={k} />
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
          showRomaji={!shifted}
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

/**
 * `shifted` cuts romaji from the produce beat (03 §6). It does *not* yet make
 * the beat production-first: frame-based composition (03 §8) needs frames and
 * their model sentences as **authored content**, which §8 requires and Book Two
 * does not have yet.
 *
 * An earlier revision derived frames at runtime by finding a lesson word inside
 * a phrase's reading and offering same-word-type substitutes. Both halves were
 * wrong. Kana has no word boundaries, so substring matching split きれい in half
 * to slot き (はなは＿れいです). And substituting an unattested word synthesises
 * a sentence nobody verified, which is the fabricated-Japanese rule in CLAUDE.md
 * and the reason §8 calls frames authored content in the first place. Deriving
 * them cannot be made safe; they have to be written down. Restore
 * FrameComposeCard from git history when Book Two authors frames to feed it.
 */
function ProduceStep({
  items,
  shifted,
  onDone,
}: {
  items: Array<Phrase | Word | GrammarPattern>;
  shifted: boolean;
  onDone: () => void;
}) {
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

  const header = (
    <>
      <p className="text-body-sm text-fg-subtle">
        Try it · {index + 1} / {items.length}
      </p>
      <ProgressBar value={(index + 1) / items.length} />
    </>
  );

  if (isGrammarPattern(current)) {
    const phrase = findPhrase(current.phraseId);
    if (phrase === undefined) return null;
    return (
      <div className="flex w-full flex-col gap-4 py-4">
        {header}
        <GrammarClozeCard
          key={current.id}
          pattern={current}
          phrase={phrase}
          showRomaji={!shifted}
          onNext={(correct) => void handleNext(correct)}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      {header}
      <FillBlankCard key={current.id} card={current} showRomaji={!shifted} onNext={(correct) => void handleNext(correct)} />
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

/**
 * How much of the chapter is left, in the chapter's own terms.
 *
 * Describes the work, never the learner: "2 lessons to go" shrinks to zero as
 * you do it, which is the test CLAUDE.md sets for a gate rather than a grade.
 * Nothing here is a score, and there is no way to fall short of it.
 */
function ChapterProgress({ book, lesson }: { book: Book; lesson: Lesson }) {
  const placement = placeInChapter(lesson, book.lessons, book.chapters);
  if (placement === null || placement.lessonNumber === null) return null;

  const { chapter, remaining } = placement;
  return (
    <p className="text-body-sm text-fg-subtle">
      {chapterLabel(chapter)} · {chapter.title} —{" "}
      {remaining === 0 ? (
        <span className="font-medium text-fg">the checkpoint is next</span>
      ) : (
        <>
          {remaining} {remaining === 1 ? "lesson" : "lessons"} to go before the checkpoint
        </>
      )}
    </p>
  );
}

function CloseStep({ book, session }: { book: Book; session: DailySession }) {
  const learnedCount = session.newWords.length + session.newPhrases.length + (session.newGrammarPattern !== null ? 1 : 0);
  return (
    <div className="flex w-full flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-heading font-semibold text-fg">Nice work today.</p>
        {session.lesson !== null && learnedCount > 0 && (
          <p className="text-body text-fg-subtle">
            You worked toward: <span className="font-medium text-fg">{session.lesson.canDo}</span>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
        {session.reviewItems.length > 0 && (
          <p className="text-body-sm text-fg-subtle">Reviewed {session.reviewItems.length} item(s)</p>
        )}
        {learnedCount > 0 && <p className="text-body-sm text-fg-subtle">Learned {learnedCount} new item(s)</p>}
        {session.lesson !== null && <ChapterProgress book={book} lesson={session.lesson} />}
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

/**
 * The book is a prop with Book One as its default (03 §0a): today's single
 * route renders `<LearnPage />` unchanged, and Book Two becomes a call-site
 * decision rather than a rewrite of this file.
 */
export function LearnPage({ book = bookOne }: { book?: Book } = {}) {
  const tier = useUserTier();
  const userId = useAuth((s) => s.user?.id ?? null);
  const shifted = isShifted(book);

  const [step, setStep] = useState<Step>("loading");
  const [session, setSession] = useState<DailySession | null>(null);
  /**
   * The learner's progress list, kept here as well as inside the built session
   * because the two terminal checkpoints read it directly: which situations
   * have been taught, and which can-dos are already verified. Updated
   * optimistically on verification so the remaining count shrinks on screen
   * before the write lands.
   */
  const [seenLessonIds, setSeenUnitIds] = useState<string[]>([]);

  useEffect(() => {
    // Re-runs on tier/userId change (e.g. guest -> signed-in on sign-up mid-session).
    let cancelled = false;
    async function load() {
      // Earlier books' progress rides along so their due items keep surfacing
      // here (03 §6) — review is cumulative, new material is not.
      const earlier = priorBooks(book);
      const [progress, reviewStates, ...earlierProgress] = await Promise.all([
        getPathProgress(book.progressKey, userId !== null),
        hydrateFromServer(userId !== null),
        ...earlier.map((b) => getPathProgress(b.progressKey, userId !== null)),
      ]);
      if (cancelled) return;
      setSeenUnitIds(progress.seenLessonIds);
      const words = wordsForTier(tier);
      const phrases = phrasesForTier(tier);
      const prior = earlier.map((b, i) => ({ book: b, progress: earlierProgress[i] }));
      const built = buildDailySession(book, progress, words, phrases, allGrammarPatterns, allKanji, reviewStates, Date.now(), prior);
      setSession(built);
      if (built.reviewItems.length > 0) {
        setStep("review");
      } else if (built.lesson !== null) {
        setStep(stepForLesson(built.lesson));
      } else {
        setStep("nothing-due");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [book, tier, userId]);

  const finishUnitAndClose = useCallback(async () => {
    if (session?.lesson != null) {
      await markLessonSeen(book.progressKey, session.lesson.id, userId !== null);
    }
    setStep("close");
  }, [book.progressKey, session, userId]);

  function afterReview() {
    const lesson = session?.lesson ?? null;
    if (lesson === null) {
      setStep("close");
      return;
    }
    setStep(stepForLesson(lesson));
  }

  // Stable identity: NewLessonStep depends on this in a useEffect (see below),
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
    content = <ReviewStep items={session.reviewItems} shifted={shifted} onDone={afterReview} />;
  } else if (step === "new-lesson" && session.lesson !== null) {
    content = (
      <NewLessonStep
        book={book}
        lesson={session.lesson}
        words={session.newWords}
        phrases={session.newPhrases}
        pattern={session.newGrammarPattern}
        newKanji={session.newKanji}
        shifted={shifted}
        onDone={afterNewUnit}
      />
    );
  } else if (step === "checkpoint" && session.lesson !== null) {
    // Everything taught *before* this checkpoint, not every word in the tier.
    // Identical today, since lesson 42 sits last — but a checkpoint inserted
    // mid-ladder later must never quiz material the learner has not met.
    const taughtIds = new Set(
      book.lessons.filter((u) => u.order < (session.lesson?.order ?? 0)).flatMap((u) => u.wordIds),
    );
    content = (
      <RecognitionCheckpoint
        lesson={session.lesson}
        words={wordsForTier(tier).filter((w) => taughtIds.has(w.id))}
        onMissed={(word) => void demoteMissedWord(word.id, userId !== null)}
        onDone={() => void finishUnitAndClose()}
      />
    );
  } else if (step === "production" && session.lesson !== null) {
    // Words *and* phrases, both scoped to what was taught before this lesson.
    const before = book.lessons.filter((u) => u.order < (session.lesson?.order ?? 0));
    const taughtWordIds = new Set(before.flatMap((u) => u.wordIds));
    const taughtPhraseIds = new Set(before.flatMap((u) => u.phraseIds));
    content = (
      <ProductionCheckpoint
        lesson={session.lesson}
        words={wordsForTier(tier).filter((w) => taughtWordIds.has(w.id))}
        phrases={phrasesForTier(tier).filter((p) => taughtPhraseIds.has(p.id))}
        showRomaji={!shifted}
        onMissed={(item) => void demoteMissedWord(item.id, userId !== null)}
        onDone={() => void finishUnitAndClose()}
      />
    );
  } else if (step === "conversation" && session.lesson !== null) {
    content = (
      <LessonConversation
        lesson={session.lesson}
        scope={buildCrossSituationScope(book.lessons, seenLessonIds, wordsForTier(tier))}
        signedIn={userId !== null}
        onDone={() => void finishUnitAndClose()}
      />
    );
  } else if (step === "can-do" && session.lesson !== null) {
    const words = wordsForTier(tier);
    content = (
      <CanDoCheckpoint
        lesson={session.lesson}
        situations={taughtSituations(book.lessons, seenLessonIds)}
        verified={verifiedCanDos(seenLessonIds)}
        scopeFor={(situation) => buildCanDoScope(book.lessons, situation, words)}
        signedIn={userId !== null}
        onVerified={(situation) => {
          const marker = canDoMarkerId(situation);
          setSeenUnitIds((prev) => (prev.includes(marker) ? prev : [...prev, marker]));
          void markLessonSeen(book.progressKey, marker, userId !== null);
        }}
        onComplete={() => void finishUnitAndClose()}
        // Deliberately does NOT mark the lesson seen. This is the last lesson on the
        // ladder, so finishing it with can-dos outstanding would leave the
        // learner at "All caught up" with no route back to the ones they left.
        onLater={() => setStep("close")}
      />
    );
  } else if (step === "produce") {
    content = (
      <ProduceStep
        items={[...session.newWords, ...session.newPhrases, ...(session.newGrammarPattern ? [session.newGrammarPattern] : [])]}
        shifted={shifted}
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
    content = <CloseStep book={book} session={session} />;
  }

  return <PageShell>{content}</PageShell>;
}
