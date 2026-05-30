import { useState, useEffect, useRef, type ReactNode } from "react";
import { LoadingPlaceholder, ProgressBar, ScoreCard } from "aburungo-design-system";
import { fetchKanjiList, fetchDueKanji, submitKanjiReview } from "@/api/kanji";
import type { KanjiEntry } from "@/api/kanji";
import { KanjiDrillCard, type DrillPhase } from "@/components/KanjiDrillCard";
import { useUserTier } from "@/store/auth";
import { PageShell } from "@/components/PageShell";

type Screen = "browse" | "drill" | "result";
type JlptFilter = 5 | 4 | 3 | 2 | 1;

const ALL_JLPT_TABS: JlptFilter[] = [5, 4, 3, 2, 1];

const TIER_MAX_JLPT: Record<string, number> = {
  guest: 5,
  free: 4,
  paid: 1,
};

// --- Browse helpers ---

function parseKun(raw: string): { reading: string; okurigana: string } {
  const [reading, okurigana = ""] = raw.split(".");
  return { reading, okurigana };
}

function KunReading({ kanji, raw }: { kanji: string; raw: string }) {
  const { reading, okurigana } = parseKun(raw);
  return (
    <span>
      <ruby style={{ fontFamily: "var(--font-jp)" }}>
        {kanji}
        <rt className="text-caption text-fg-subtle">{reading}</rt>
      </ruby>
      {okurigana && <span style={{ fontFamily: "var(--font-jp)" }}>{okurigana}</span>}
    </span>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Browse screen ---

type BrowseScreenProps = {
  jlpt: JlptFilter;
  onJlptChange: (jlpt: JlptFilter) => void;
  kanji: KanjiEntry[];
  loading: boolean;
  selected: KanjiEntry | null;
  onSelect: (k: KanjiEntry) => void;
  onStartDrill: () => void;
  tabs: JlptFilter[];
};

function BrowseScreen({ jlpt, onJlptChange, kanji, loading, selected, onSelect, onStartDrill, tabs }: BrowseScreenProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onJlptChange(n)}
            className={[
              "shrink-0 rounded-full px-4 py-1.5 text-body-sm font-medium transition-colors",
              jlpt === n
                ? "bg-brand-600 text-white"
                : "border border-border bg-surface text-fg-subtle active:bg-surface-2",
            ].join(" ")}
          >
            N{n}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingPlaceholder label="Loading kanji…" />
      ) : (
        <div className="flex flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
          <div className="grid h-fit grid-cols-8 gap-1 sm:grid-cols-10 lg:grid-cols-8">
            {kanji.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => onSelect(k)}
                className={[
                  "flex aspect-square items-center justify-center rounded-xl text-body-sm transition-colors",
                  selected?.id === k.id
                    ? "bg-brand-600 text-white"
                    : "border border-border bg-surface text-fg active:bg-surface-2",
                ].join(" ")}
                style={{ fontFamily: "var(--font-jp)" }}
              >
                {k.character}
              </button>
            ))}
          </div>

          {selected && (
            <div className="shrink-0 rounded-2xl border border-border bg-surface p-4 lg:w-56">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-jp-display font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                  {selected.character}
                </span>
                <div>
                  <p className="text-body font-medium text-fg">{selected.meanings.slice(0, 2).join(", ")}</p>
                  {selected.jlptLevel != null && (
                    <p className="text-caption text-fg-subtle">N{selected.jlptLevel}</p>
                  )}
                </div>
              </div>
              {selected.onReadings.length > 0 && (
                <div className="mb-1">
                  <span className="text-caption font-medium text-fg-subtle">On: </span>
                  <span className="text-body-sm text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                    {selected.onReadings.join("、")}
                  </span>
                </div>
              )}
              {selected.kunReadings.length > 0 && (
                <div className="mb-3">
                  <span className="text-caption font-medium text-fg-subtle">Kun: </span>
                  <span className="text-body-sm text-fg">
                    {selected.kunReadings.map((r, i) => (
                      <span key={r}>
                        {i > 0 && "、"}
                        <KunReading kanji={selected.character} raw={r} />
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="pb-4">
        <button
          type="button"
          onClick={onStartDrill}
          disabled={kanji.length === 0}
          className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-40"
        >
          Drill N{jlpt} kanji
        </button>
      </div>
    </div>
  );
}

// --- Main component ---

export function KanjiPage() {
  const tier = useUserTier();
  const maxJlpt = TIER_MAX_JLPT[tier] ?? 5;
  const jlptTabs = ALL_JLPT_TABS.filter((n) => n >= maxJlpt);

  const [screen, setScreen] = useState<Screen>("browse");
  const [jlpt, setJlpt] = useState<JlptFilter>(5);
  const [kanjiList, setKanjiList] = useState<KanjiEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<KanjiEntry | null>(null);

  const [queue, setQueue] = useState<KanjiEntry[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [phase, setPhase] = useState<DrillPhase>("entering");
  const [stagedKanji, setStagedKanji] = useState<KanjiEntry | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<KanjiEntry[]>([]);

  const advanceRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!jlptTabs.includes(jlpt)) {
      setJlpt(jlptTabs[0] ?? 5);
    }
  }, [tier]);

  function loadKanji(newJlpt: JlptFilter) {
    setLoading(true);
    setSelected(null);
    fetchKanjiList({ jlpt: newJlpt, limit: 100 })
      .then((first) => {
        if (first.length < 100) {
          setKanjiList(first);
          setLoading(false);
          return;
        }
        return fetchKanjiList({ jlpt: newJlpt, limit: 100, offset: 100 }).then((second) => {
          if (second.length < 100) {
            setKanjiList([...first, ...second]);
            setLoading(false);
            return;
          }
          return fetchKanjiList({ jlpt: newJlpt, limit: 100, offset: 200 }).then((third) => {
            setKanjiList([...first, ...second, ...third]);
            setLoading(false);
          });
        });
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadKanji(jlpt);
  }, [jlpt]);

  function handleJlptChange(newJlpt: JlptFilter) {
    if (newJlpt < maxJlpt) return;
    setJlpt(newJlpt);
  }

  async function startDrill() {
    let q: KanjiEntry[];
    try {
      const due = await fetchDueKanji();
      const dueIds = new Set(due.map((d) => d.kanjiId));
      const dueKanji = kanjiList.filter((k) => dueIds.has(k.id));
      q = dueKanji.length > 0 ? dueKanji : shuffle([...kanjiList]).slice(0, 20);
    } catch {
      q = shuffle([...kanjiList]).slice(0, 20);
    }
    setQueue(q);
    setQueueIndex(0);
    setCorrectCount(0);
    setMissed([]);
    setStagedKanji(null);
    setPhase("entering");
    setScreen("drill");
  }

  function handleReveal() {
    setPhase("revealed");
  }

  function handleRate(correct: boolean) {
    const current = queue[queueIndex];
    if (!current) return;
    if (correct) {
      setCorrectCount((n) => n + 1);
    } else {
      setMissed((m) => [...m, current]);
    }
    void submitKanjiReview(current.id, correct ? "good" : "again", Date.now()).catch(() => {});
    setPhase("exiting");
  }

  function advance() {
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      setScreen("result");
      return;
    }
    setStagedKanji(queue[nextIndex] ?? null);
    setQueueIndex(nextIndex);
    setStagedKanji(null);
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

  const displayKanji = stagedKanji ?? queue[queueIndex] ?? null;

  // ── Screen content ────────────────────────────────────────────────────────

  let content: ReactNode;

  if (screen === "result") {
    content = (
      <div className="flex flex-col gap-6 py-4">
        <ScoreCard correct={correctCount} total={queue.length}>
          {missed.length > 0 && (
            <section>
              <p className="mb-3 text-body-sm font-medium text-fg-subtle">Missed — {missed.length}</p>
              <div className="grid grid-cols-4 gap-2">
                {missed.map((k) => (
                  <div
                    key={k.id}
                    className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface py-3"
                  >
                    <span className="text-jp-lg font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                      {k.character}
                    </span>
                    <span className="px-1 text-center text-[0.65rem] leading-tight text-fg-subtle">
                      {k.meanings[0]}
                    </span>
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
          {displayKanji && (
            <KanjiDrillCard
              key={displayKanji.id}
              kanji={displayKanji}
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
        jlpt={jlpt}
        onJlptChange={handleJlptChange}
        kanji={kanjiList}
        loading={loading}
        selected={selected}
        onSelect={setSelected}
        onStartDrill={startDrill}
        tabs={jlptTabs}
      />
    );
  }

  return <PageShell>{content}</PageShell>;
}
