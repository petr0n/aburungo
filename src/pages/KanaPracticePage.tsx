import { useState, useRef, useEffect, type ReactNode } from "react";
import { ProgressBar, ScoreCard } from "aburungo-design-system";
import { KANA_PRACTICE_CARDS, type KanaPracticeCard } from "@/lib/kanaData";
import { PageShell, SectionNav } from "@/components/PageShell";
import { ProgressWidget } from "@/components/ProgressWidget";

type PracticeMode = "multiple-choice" | "type-romaji";
type SetKey = "basic" | "voiced" | "combos";
type ScriptKey = "hiragana" | "katakana";
type Screen = "setup" | "practice" | "result";
type AnswerResult = "correct" | "wrong";

const SET_META: Record<SetKey, { label: string; count: number }> = {
  basic: { label: "Basic", count: 46 },
  voiced: { label: "Voiced + semi-voiced", count: 25 },
  combos: { label: "Combinations", count: 33 },
};

const SCRIPT_META: Record<ScriptKey, { label: string; sub: string }> = {
  hiragana: { label: "Hiragana", sub: "あいう" },
  katakana: { label: "Katakana", sub: "アイウ" },
};

const SECTION_LINKS = [
  { to: "/kana", label: "Learn" },
  { to: "/flashcard", label: "Flashcards" },
  { to: "/practice", label: "Fill-In" },
];

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeChoices(card: KanaPracticeCard, pool: KanaPracticeCard[]): string[] {
  const distractors = shuffle(pool.filter((c) => c.romaji !== card.romaji))
    .slice(0, 3)
    .map((c) => c.romaji);
  return shuffle([card.romaji, ...distractors]);
}

function checkAnswer(input: string, card: KanaPracticeCard): boolean {
  const norm = input.trim().toLowerCase();
  return norm === card.romaji || (card.alts ?? []).includes(norm);
}

export function KanaPracticePage() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("multiple-choice");
  const [selectedSets, setSelectedSets] = useState<Set<SetKey>>(new Set<SetKey>(["basic"]));
  const [selectedScripts, setSelectedScripts] = useState<Set<ScriptKey>>(new Set<ScriptKey>(["hiragana"]));

  const [queue, setQueue] = useState<KanaPracticeCard[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<KanaPracticeCard[]>([]);

  const [choices, setChoices] = useState<string[]>([]);
  const [answered, setAnswered] = useState<AnswerResult | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [typeInput, setTypeInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const advanceRef = useRef<() => void>(() => {});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentCard = queue[queueIndex] ?? null;

  function advance() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      setScreen("result");
      return;
    }
    const next = queue[nextIndex];
    setQueueIndex(nextIndex);
    setAnswered(null);
    setSelectedChoice(null);
    setTypeInput("");
    if (practiceMode === "multiple-choice") {
      setChoices(makeChoices(next, queue));
    }
  }
  useEffect(() => {
    advanceRef.current = advance;
  });

  useEffect(() => {
    if (screen === "practice" && practiceMode === "type-romaji") {
      inputRef.current?.focus();
    }
  }, [screen, queueIndex, practiceMode]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function startSession() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const pool = KANA_PRACTICE_CARDS.filter((c) => selectedSets.has(c.group) && selectedScripts.has(c.script));
    const q = shuffle(pool);
    setQueue(q);
    setQueueIndex(0);
    setCorrectCount(0);
    setMissed([]);
    setAnswered(null);
    setSelectedChoice(null);
    setTypeInput("");
    if (practiceMode === "multiple-choice" && q.length > 0) {
      setChoices(makeChoices(q[0], q));
    }
    setScreen("practice");
  }

  function handleChoice(choice: string) {
    if (answered !== null || !currentCard) return;
    const isCorrect = choice === currentCard.romaji;
    setSelectedChoice(choice);
    setAnswered(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrectCount((n) => n + 1);
    } else {
      setMissed((m) => [...m, currentCard]);
    }
    timerRef.current = setTimeout(() => advanceRef.current(), 800);
  }

  function handleTypeSubmit() {
    if (answered !== null || !currentCard || !typeInput.trim()) return;
    const isCorrect = checkAnswer(typeInput, currentCard);
    setAnswered(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrectCount((n) => n + 1);
      timerRef.current = setTimeout(() => advanceRef.current(), 700);
    } else {
      setMissed((m) => [...m, currentCard]);
    }
  }

  function toggleSet(key: SetKey) {
    setSelectedSets((prev) => {
      if (prev.has(key) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleScript(key: ScriptKey) {
    setSelectedScripts((prev) => {
      if (prev.has(key) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const totalSelected = KANA_PRACTICE_CARDS.filter(
    (c) => selectedSets.has(c.group) && selectedScripts.has(c.script),
  ).length;

  // ── Screen content ──────────────────────────────────────────────────────

  let content: ReactNode;

  if (screen === "setup") {
    content = (
      <div className="w-full">
        <h2 className="mb-6 text-heading-sm font-semibold text-fg">Kana Practice</h2>
        <div className="flex flex-col gap-6">
          <section>
            <p className="mb-3 text-body-sm font-medium text-fg-subtle">Mode</p>
            <div className="grid grid-cols-2 gap-2">
              {(["multiple-choice", "type-romaji"] as PracticeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPracticeMode(mode)}
                  className={[
                    "flex min-h-[60px] flex-col items-center justify-center rounded-2xl border px-3 text-body-sm font-medium transition-colors",
                    practiceMode === mode
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-border bg-surface text-fg active:bg-surface-2",
                  ].join(" ")}
                >
                  {mode === "multiple-choice" ? "Multiple choice" : "Type romaji"}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-body-sm font-medium text-fg-subtle">Script</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SCRIPT_META) as ScriptKey[]).map((key) => {
                const { label, sub } = SCRIPT_META[key];
                const checked = selectedScripts.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleScript(key)}
                    className={[
                      "flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-2xl border px-3 transition-colors",
                      checked ? "border-brand-500 bg-brand-50" : "border-border bg-surface active:bg-surface-2",
                    ].join(" ")}
                  >
                    <span className={`text-body font-medium ${checked ? "text-brand-700" : "text-fg"}`}>{label}</span>
                    <span className="text-body-sm text-fg-subtle" style={{ fontFamily: "var(--font-jp)" }}>
                      {sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-3 text-body-sm font-medium text-fg-subtle">Sets</p>
            <div className="flex flex-col gap-2">
              {(Object.keys(SET_META) as SetKey[]).map((key) => {
                const { label, count } = SET_META[key];
                const checked = selectedSets.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSet(key)}
                    className={[
                      "flex min-h-[56px] items-center justify-between rounded-2xl border px-4 transition-colors",
                      checked ? "border-brand-500 bg-brand-50" : "border-border bg-surface active:bg-surface-2",
                    ].join(" ")}
                  >
                    <span className={`text-body font-medium ${checked ? "text-brand-700" : "text-fg"}`}>{label}</span>
                    <span className="text-body-sm text-fg-subtle">{count}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <button
            type="button"
            onClick={startSession}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
          >
            Start — {totalSelected} kana
          </button>
        </div>
      </div>
    );
  } else if (screen === "result") {
    content = (
      <div className="w-full">
        <div className="flex flex-col gap-6">
          <ScoreCard correct={correctCount} total={queue.length}>
            {missed.length > 0 && (
              <section>
                <p className="mb-3 text-body-sm font-medium text-fg-subtle">Missed — {missed.length}</p>
                <div className="grid grid-cols-3 gap-2">
                  {missed.map((card, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface py-3"
                    >
                      <span className="text-jp-lg font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                        {card.kana}
                      </span>
                      <span className="text-caption text-fg-subtle">{card.romaji}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </ScoreCard>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={startSession}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Practice again
            </button>
            <button
              type="button"
              onClick={() => setScreen("setup")}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg active:bg-surface-2"
            >
              Change settings
            </button>
          </div>
        </div>
      </div>
    );
  } else if (currentCard !== null) {
    const cardBorderClass =
      answered === "correct"
        ? "border-success-500 bg-success-bg"
        : answered === "wrong"
          ? "border-error-500 bg-error-bg"
          : "border-border bg-surface";

    content = (
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              setScreen("setup");
            }}
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

        <div className="flex flex-col items-center gap-8 py-4">
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-3xl border-2 transition-colors duration-150 ${cardBorderClass}`}
          >
            <span className="text-jp-display-lg" style={{ fontFamily: "var(--font-jp)" }}>
              {currentCard.kana}
            </span>
          </div>

          {practiceMode === "multiple-choice" ? (
            <div className="grid w-full grid-cols-2 gap-3">
              {choices.map((choice) => {
                let cls = "border-border bg-surface text-fg active:bg-surface-2";
                if (answered !== null) {
                  if (choice === currentCard.romaji) {
                    cls = "border-success-500 bg-success-bg text-success-fg";
                  } else if (choice === selectedChoice) {
                    cls = "border-error-500 bg-error-bg text-error-fg";
                  }
                }
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => handleChoice(choice)}
                    disabled={answered !== null}
                    className={`flex min-h-[60px] items-center justify-center rounded-2xl border text-body font-medium transition-colors ${cls}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex w-full flex-col gap-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTypeSubmit();
                  }}
                  disabled={answered !== null}
                  placeholder="type romaji…"
                  className={[
                    "min-h-[52px] flex-1 rounded-2xl border px-4 text-body outline-none transition-colors",
                    answered === "correct"
                      ? "border-success-500 bg-success-bg text-success-fg"
                      : answered === "wrong"
                        ? "border-error-500 bg-error-bg text-error-fg"
                        : "border-border bg-surface text-fg focus:border-brand-500",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={handleTypeSubmit}
                  disabled={answered !== null || !typeInput.trim()}
                  className="flex min-h-[52px] items-center justify-center rounded-2xl bg-brand-600 px-5 text-body font-semibold text-white disabled:opacity-40 active:bg-brand-700"
                >
                  Go
                </button>
              </div>

              {answered === "wrong" && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-body-sm text-error-fg">
                    Answer: <span className="font-semibold">{currentCard.romaji}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => advanceRef.current()}
                    className="flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg active:bg-surface-2"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    content = null;
  }

  return (
    <PageShell
      sideNav={
        <div className="flex flex-col gap-6">
          <SectionNav links={SECTION_LINKS} />
          <ProgressWidget section="kana" />
        </div>
      }
    >
      {content}
    </PageShell>
  );
}
