import { useState, useRef, useEffect, type ReactNode } from "react";
import type { Word } from "@/types";
import { useUserTier } from "@/store/auth";
import { wordsForTier } from "@/content/vocabulary";
import { WordDrillCard, type DrillPhase } from "@/components/WordDrillCard";
import { PageShell, SectionNav } from "@/components/PageShell";
import { ProgressWidget } from "@/components/ProgressWidget";
import { LoadingPlaceholder, ProgressBar, ScoreCard } from "aburungo-design-system";

type Screen = "browse" | "drill" | "result";

const SECTION_LINKS = [
  { to: "/flashcard", label: "Flashcards" },
  { to: "/practice", label: "Fill-In" },
  { to: "/kana", label: "Kana" },
];

const THEME_LABELS: Record<string, string> = {
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
                  "flex min-h-[44px] items-center rounded-xl border px-3 py-2 text-body-sm transition-colors",
                  selected?.id === w.id
                    ? "border-brand-500 bg-brand-600 text-white"
                    : "border-border bg-surface text-fg active:bg-surface-2",
                ].join(" ")}
                style={{ fontFamily: "var(--font-jp)" }}
              >
                {w.japanese}
              </button>
            ))}
          </div>
        </section>
      ))}

      {selected !== null && (
        <div className="sticky bottom-4 rounded-2xl border border-border bg-bg p-4 shadow-card">
          <div className="mb-3 flex items-start gap-3">
            <div>
              <p lang="ja" className="text-jp-lg font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                {selected.japanese}
              </p>
              <p lang="ja" className="text-body-sm text-fg-muted" style={{ fontFamily: "var(--font-jp)" }}>
                {selected.reading}
              </p>
              <p className="text-body-sm text-fg-subtle">{selected.romaji}</p>
            </div>
          </div>
          <p className="mb-1 text-body font-semibold text-fg">{selected.english}</p>
          {selected.notes != null && (
            <p className="text-body-sm text-fg-subtle">{selected.notes}</p>
          )}
        </div>
      )}

      <div className="pb-4">
        <button
          type="button"
          onClick={onStartDrill}
          disabled={words.length === 0}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-40"
        >
          Drill all words
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
  const [queueIndex, setQueueIndex] = useState(0);
  const [phase, setPhase] = useState<DrillPhase>("entering");
  const [stagedWord, setStagedWord] = useState<Word | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);

  const advanceRef = useRef<() => void>(() => {});

  function startDrill() {
    const q = shuffle([...words]).slice(0, 20);
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
  } else if (screen === "result") {
    content = (
      <div className="flex flex-col gap-6 py-4">
        <ScoreCard correct={correctCount} total={queue.length}>
          {missed.length > 0 && (
            <section>
              <p className="mb-3 text-body-sm font-medium text-fg-subtle">Missed — {missed.length}</p>
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
          <button
            type="button"
            onClick={startDrill}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
          >
            Drill again
          </button>
          <button
            type="button"
            onClick={() => setScreen("browse")}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg active:bg-surface-2"
          >
            Back to browse
          </button>
        </div>
      </div>
    );
  } else if (screen === "drill") {
    content = (
      <div className="flex flex-col">
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
        <div className="flex flex-col justify-center py-6">
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
    content = (
      <BrowseScreen
        words={words}
        selected={selected}
        onSelect={setSelected}
        onStartDrill={startDrill}
      />
    );
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
