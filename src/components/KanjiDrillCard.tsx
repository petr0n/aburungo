import { FlipCard } from "aburungo-design-system";
import type { FlipCardPhase } from "aburungo-design-system";

export type DrillPhase = "entering" | "idle" | "revealed" | "exiting";

function toFlipPhase(p: DrillPhase): FlipCardPhase {
  return p === "revealed" ? "idle" : p;
}

/**
 * The minimum a drill card needs, satisfied by both the server's KanjiEntry
 * (src/api/kanji.ts) and the ladder's Kanji (src/types.ts). The two disagree
 * on reading field names, so both are accepted and normalised below.
 *
 * jlptLevel is optional on purpose: ladder content omits it, so the badge
 * disappears without a conditional. The learner never reads a level (DR-024);
 * KanjiPage is the one surface that legitimately shows one.
 */
export type DrillableKanji = {
  character: string;
  meanings: string[];
  onReadings?: string[];
  kunReadings?: string[];
  on?: string[];
  kun?: string[];
  jlptLevel?: number | null;
  strokeCount?: number | null;
  strokes?: number | null;
};

type Props = {
  kanji: DrillableKanji;
  phase: DrillPhase;
  onReveal: () => void;
  onRate: (correct: boolean) => void;
  onEntered: () => void;
  onExited: () => void;
};

/**
 * KANJIDIC2 kun readings are lexicographic notation, not Japanese: a dot splits
 * the reading from its okurigana, and a leading or trailing hyphen marks an
 * affix form. 38 of the 200 ladder entries carry one or the other, and a
 * learner must never be shown either — "なま-" is not a word.
 */
const stripAffix = (raw: string): string => raw.replace(/^-|-$/g, "");

function parseKun(raw: string): { reading: string; okurigana: string } {
  const [reading = "", okurigana = ""] = stripAffix(raw).split(".");
  return { reading, okurigana };
}

/**
 * The readable display slice, shared by the drill card and the intro card.
 *
 * Deduped because stripping the affix marker collapses pairs the dictionary
 * lists separately (生 carries both "なま" and "なま-"), and capped because 生 has
 * 18 kun readings — an uncapped list buries the card on a phone.
 */
function kunDisplay(raw: readonly string[]): string[] {
  return [...new Set(raw.map(stripAffix))].slice(0, 6);
}

type KunReadingProps = { kanji: string; raw: string };

function KunReading({ kanji, raw }: KunReadingProps) {
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

/**
 * The readable kun list, shared by the drill card and the intro card so the
 * introduction and the review of a character read identically.
 *
 * A component rather than a plain helper because that is the only export shape
 * that keeps both surfaces on one implementation without breaking fast refresh.
 * The caller supplies the wrapping layout.
 */
export function KunReadings({ kanji, readings }: { kanji: string; readings: readonly string[] }) {
  return (
    <>
      {kunDisplay(readings).map((r) => (
        <KunReading key={r} kanji={kanji} raw={r} />
      ))}
    </>
  );
}

export function KanjiDrillCard({ kanji, phase, onReveal, onRate, onEntered, onExited }: Props) {
  const isFlipped = phase === "revealed" || phase === "exiting";
  const primaryMeaning = kanji.meanings[0] ?? "";
  const otherMeanings = kanji.meanings.slice(1, 4);
  const onReadings = kanji.onReadings ?? kanji.on ?? [];
  const kunReadings = kanji.kunReadings ?? kanji.kun ?? [];
  const strokeCount = kanji.strokeCount ?? kanji.strokes ?? null;

  return (
    <FlipCard
      flipped={isFlipped}
      phase={toFlipPhase(phase)}
      onEntered={onEntered}
      onExited={onExited}
      front={
        <div className="w-full rounded-2xl border border-border bg-bg shadow-card">
          <div className="flex flex-col gap-5 p-6">
            {kanji.jlptLevel != null && (
              <span className="inline-flex w-fit items-center rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium uppercase tracking-wider text-fg-subtle">
                N{kanji.jlptLevel}
              </span>
            )}
            <div className="flex items-center justify-center py-8">
              <span className="text-[6rem] font-medium leading-none text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                {kanji.character}
              </span>
            </div>
            <button
              type="button"
              onClick={onReveal}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white hover:bg-brand-700 active:bg-brand-700"
            >
              Reveal
            </button>
          </div>
        </div>
      }
      back={
        <div className="flex h-full w-full flex-col rounded-2xl border border-border bg-bg shadow-card">
          <div className="flex flex-1 flex-col gap-4 p-6">
            {kanji.jlptLevel != null && (
              <span className="inline-flex w-fit items-center rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium uppercase tracking-wider text-fg-subtle">
                N{kanji.jlptLevel}
              </span>
            )}
            <div className="flex flex-col items-center gap-1 py-2">
              <span className="text-[3.5rem] font-medium leading-none text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                {kanji.character}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">Meaning</p>
                <p className="text-body font-semibold text-fg">{primaryMeaning}</p>
                {otherMeanings.length > 0 && <p className="text-body-sm text-fg-subtle">{otherMeanings.join(", ")}</p>}
              </div>
              {onReadings.length > 0 && (
                <div>
                  <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">On</p>
                  <p className="text-body text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                    {onReadings.join("、")}
                  </p>
                </div>
              )}
              {kunReadings.length > 0 && (
                <div>
                  <p className="mb-1 text-caption font-medium uppercase tracking-wider text-fg-subtle">Kun</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <KunReadings kanji={kanji.character} readings={kunReadings} />
                  </div>
                </div>
              )}
              {strokeCount !== null && <p className="text-body-sm text-fg-subtle">{strokeCount} strokes</p>}
            </div>
            <div className="mt-auto flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onRate(false)}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg-muted hover:bg-surface-2 active:bg-surface-2"
              >
                Didn't know
              </button>
              <button
                type="button"
                onClick={() => onRate(true)}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white hover:bg-brand-700 active:bg-brand-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}
