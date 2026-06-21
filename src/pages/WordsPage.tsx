import { useState, useRef, useEffect, type ReactNode } from "react";
import type { Word } from "@/types";
import { useUserTier } from "@/store/auth";
import { wordsForTier } from "@/content/vocabulary";
import { WordDrillCard, type DrillPhase } from "@/components/WordDrillCard";
import { WordLearnCard } from "@/components/WordLearnCard";
import { Furigana } from "@/components/Furigana";
import { RecognitionPass } from "@/components/RecognitionPass";
import { PageShell, SectionNav } from "@/components/PageShell";
import { ProgressWidget } from "@/components/ProgressWidget";
import { LoadingPlaceholder, ProgressBar, ScoreCard } from "aburungo-design-system";

type Screen = "browse" | "learn" | "recognition" | "drill" | "result";

const SECTION_LINKS = [
  { to: "/flashcard", label: "Flashcards" },
  { to: "/practice", label: "Fill-In" },
  { to: "/kana", label: "Kana" },
];

const THEME_LABELS: Record<string, string> = {
  basics: "Basics",
  people: "People",
  places: "Places",
  food: "Food & Drink",
  objects: "Everyday Objects",
  time: "Time",
  "daily-life": "Daily Life",
  movement: "Movement",
  communication: "Communication",
  other: "Other",
  size: "Size",
  price: "Price",
  quality: "Quality",
  temperature: "Temperature",
};

function themeLabel(theme: string): string {
  return THEME_LABELS[theme] ?? theme.charAt(0).toUpperCase() + theme.slice(1);
}

// ── Browse screen ─────────────────────────────────────────────────────────────

type BrowseScreenProps = {
  words: Word[];
  selected: Word | null;
  onSelect: (w: Word) => void;
  onStartDrill: () => void;
};

function BrowseScreen({ words, selected, onSelect, onStartDrill }: BrowseScreenProps) {
  const grouped = new Map<string, Word[]>();
  for (const w of words) {
    const theme = w.theme ?? "other";
    const existing = grouped.get(theme);
    if (existing !== undefined) {
      existing.push(w);
    } else {
      grouped.set(theme, [w]);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 py-4">
      {selected !== null && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <div className="flex items-start gap-4">
            <Furigana
              japanese={selected.japanese}
              reading={selected.reading}
              className="text-jp-lg font-medium text-fg lg:text-jp-display"
            />
            <div className="flex flex-col">
              <p lang="ja" className="text-body-sm text-fg-muted" style={{ fontFamily: "var(--font-jp)" }}>
                {selected.reading}
              </p>
              <p className="text-body-sm text-fg-subtle">{selected.romaji}</p>
            </div>
          </div>
          <p className="mt-2 text-body font-semibold text-fg">{selected.english}</p>
          {selected.notes != null && <p className="mt-1 text-body-sm text-fg-subtle">{selected.notes}</p>}
        </div>
      )}

      {Array.from(grouped.entries()).map(([theme, group]) => (
        <section key={theme}>
          <h2 className="mb-3 text-caption font-semibold uppercase tracking-widest text-fg-faint">
            {themeLabel(theme)}
          </h2>
          <div className="flex flex-wrap gap-2">
            {group.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelect(w)}
                className={[
                  "flex min-h-[44px] items-center rounded-xl border px-3 py-2 transition-colors",
                  selected?.id === w.id
                    ? "border-brand-500 bg-brand-600 text-white"
                    : "border-border bg-surface text-fg active:bg-surface-2",
                ].join(" ")}
                style={{ fontFamily: "var(--font-jp)" }}
              >
                <Furigana japanese={w.japanese} reading={w.reading} />
              </button>
            ))}
          </div>
        </section>
      ))}

      <div className="pb-4">
        <button
          type="button"
          onClick={onStartDrill}
          disabled={words.length === 0}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-40"
        >
          Learn words
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function WordsPage() {
  const tier = useUserTier();
  const words = wordsForTier(tier);

  const [screen, setScreen] = useState<Screen>("browse");
  const [selected, setSelected] = useState<Word | null>(null);

  const [queue, setQueue] = useState<Word[]>([]);
  const [learnIndex, setLearnIndex] = useState(0);
  const [recognitionQueue, setRecognitionQueue] = useState<Word[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [phase, setPhase] = useState<DrillPhase>("entering");
  const [stagedWord, setStagedWord] = useState<Word | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);

  const advanceRef = useRef<() => void>(() => {});

  function startLearn() {
    const q = [...words].slice(0, 10);
    setQueue(q);
    setLearnIndex(0);
    setCorrectCount(0);
    setMissed([]);
    setScreen("learn");
  }

  function advanceLearn() {
    const next = learnIndex + 1;
    if (next >= queue.length) {
      setRecognitionQueue(queue.slice(0, Math.min(5, queue.length)));
      setScreen("recognition");
    } else {
      setLearnIndex(next);
    }
  }

  function startTest(q: Word[]) {
    setQueue(q);
    setQueueIndex(0);
    setCorrectCount(0);
    setMissed([]);
    setStagedWord(null);
    setPhase("entering");
    setScreen("drill");
  }

  function handleReveal() {
    setPhase("revealed");
  }

  function handleRate(correct: boolean) {
    const current = queue[queueIndex];
    if (current === undefined) return;
    if (correct) {
      setCorrectCount((n) => n + 1);
    } else {
      setMissed((m) => [...m, current]);
    }
    setPhase("exiting");
  }

  function advance() {
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      setScreen("result");
      return;
    }
    setStagedWord(null);
    setQueueIndex(nextIndex);
    setPhase("entering");
  }

  function retestMissed() {
    startTest(missed.length > 0 ? missed : queue);
  }

  useEffect(() => {
    advanceRef.current = advance;
  });

  function handleEntered() {
    setPhase("idle");
  }

  function handleExited() {
    advanceRef.current();
  }

  const displayWord = stagedWord ?? queue[queueIndex] ?? null;

  let content: ReactNode;

  if (words.length === 0) {
    content = <LoadingPlaceholder label="Loading vocabulary…" />;
  } else if (screen === "learn") {
    const word = queue[learnIndex];
    content =
      word !== undefined ? (
        <div className="flex w-full flex-col gap-4 py-4">
          <ProgressBar value={(learnIndex + 1) / queue.length} />
          <WordLearnCard key={word.id} word={word} index={learnIndex} total={queue.length} onNext={advanceLearn} />
        </div>
      ) : null;
  } else if (screen === "recognition") {
    content = (
      <RecognitionPass
        queue={recognitionQueue}
        pool={words}
        onDone={() => setScreen("browse")}
      />
    );
  } else if (screen === "result") {
    content = (
      <div className="flex flex-col gap-6 py-4">
        <ScoreCard correct={correctCount} total={queue.length} label="recalled">
          {missed.length > 0 && (
            <section>
              <p className="mb-3 text-body-sm font-medium text-fg-subtle">Worth another look · {missed.length}</p>
              <div className="flex flex-col gap-2">
                {missed.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <span lang="ja" className="text-jp font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                      {w.japanese}
                    </span>
                    <span className="text-body-sm text-fg-subtle">{w.english}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </ScoreCard>
        <div className="flex flex-col gap-3 pb-8">
          {missed.length > 0 && (
            <button
              type="button"
              onClick={retestMissed}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Review again ({missed.length})
            </button>
          )}
          <button
            type="button"
            onClick={startLearn}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg active:bg-surface-2"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={() => setScreen("browse")}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-border bg-surface text-body-sm font-medium text-fg-subtle active:bg-surface-2"
          >
            Back to browse
          </button>
        </div>
      </div>
    );
  } else if (screen === "drill") {
    content = (
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => setScreen("browse")}
            className="flex min-h-[44px] items-center text-body-sm text-fg-subtle active:text-fg"
          >
            ✕ Quit
          </button>
          <p className="text-body-sm text-fg-subtle">
            {queueIndex + 1} / {queue.length}
          </p>
          <div className="w-14" />
        </div>
        <ProgressBar value={(queueIndex + 1) / queue.length} />
        <div className="flex w-full flex-col justify-center py-6">
          {displayWord !== null && (
            <WordDrillCard
              key={displayWord.id}
              word={displayWord}
              phase={phase}
              onReveal={handleReveal}
              onRate={handleRate}
              onEntered={handleEntered}
              onExited={handleExited}
            />
          )}
        </div>
      </div>
    );
  } else {
    content = <BrowseScreen words={words} selected={selected} onSelect={setSelected} onStartDrill={startLearn} />;
  }

  return (
    <PageShell
      sideNav={
        <div className="flex flex-col gap-6">
          <SectionNav links={SECTION_LINKS} />
          <ProgressWidget section="practice" />
        </div>
      }
    >
      {content}
    </PageShell>
  );
}
