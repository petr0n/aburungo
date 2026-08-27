import type { Kanji } from "@/types";
import { KunReadings } from "./KanjiDrillCard";

type Props = { kanji: Kanji };

/**
 * Introduces one kanji in the new-lesson step.
 *
 * Presentation only — no rating. An introduction is not a review; the item's
 * first review arrives on its own schedule via the daily loop. No JLPT level
 * is shown: the learner never reads one (DR-024).
 *
 * Kun readings go through the drill card's shared helpers rather than being
 * printed raw. This is the first thing a beginner sees for a new character, on
 * a phone: 生 lists 18 kun readings in KANJIDIC2 notation, which rendered here
 * as a wall of dots and hyphens (`い.きる、…、なま-、-う`). The intro and the
 * review of the same character now read identically.
 */
export function KanjiIntroCard({ kanji }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-4">
        <span
          lang="ja"
          className="text-[4rem] font-medium leading-none text-fg"
          style={{ fontFamily: "var(--font-jp)" }}
        >
          {kanji.character}
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-body font-semibold text-fg">{kanji.meanings.join(", ")}</p>
          {kanji.strokes !== null && (
            <p className="text-caption text-fg-subtle">{kanji.strokes} strokes</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {kanji.on.length > 0 && (
          <p className="text-body-sm text-fg-subtle">
            On: <span lang="ja" style={{ fontFamily: "var(--font-jp)" }}>{kanji.on.join("、")}</span>
          </p>
        )}
        {kanji.kun.length > 0 && (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-body-sm text-fg-subtle">
            <span>Kun:</span>
            <KunReadings kanji={kanji.character} readings={kanji.kun} />
          </div>
        )}
      </div>
    </div>
  );
}
