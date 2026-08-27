import type { Kanji } from "@/types";

type Props = { kanji: Kanji };

/**
 * Introduces one kanji in the new-lesson step.
 *
 * Presentation only — no rating. An introduction is not a review; the item's
 * first review arrives on its own schedule via the daily loop. No JLPT level
 * is shown: the learner never reads one (DR-024).
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
          <p className="text-body-sm text-fg-subtle">
            Kun: <span lang="ja" style={{ fontFamily: "var(--font-jp)" }}>{kanji.kun.join("、")}</span>
          </p>
        )}
      </div>
    </div>
  );
}
