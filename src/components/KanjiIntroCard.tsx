import type { Kanji, KanjiPiece } from "@/types";
import { KunReadings } from "./KanjiDrillCard";

type Props = { kanji: Kanji; pieces?: readonly KanjiPiece[] };

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
 *
 * The component row is additive: a kanji with no components (KRADFILE gives 水
 * only itself) renders no row at all. Its heading claims visual presence, not
 * composition — one keyword serves every kanji using a glyph, and KRADFILE is
 * a radical lookup file, so 鳥's ⺣ "fire" is really tail feathers. A *new*
 * piece carries no label: its keyword is the introduction, and a "new" badge
 * would be noise on the one thing the learner is here to learn.
 */
export function KanjiIntroCard({ kanji, pieces }: Props) {
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
      {pieces !== undefined && pieces.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <p className="text-caption font-medium uppercase tracking-wider text-fg-subtle">
            Shapes in this kanji
          </p>
          <ul className="flex flex-col gap-1">
            {pieces.map((p) => (
              <li key={p.glyph} className="flex flex-wrap items-baseline gap-x-2 text-body-sm">
                <span lang="ja" className="text-body text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                  {p.glyph}
                </span>
                <span className="text-fg">{p.keyword}</span>
                {p.state === "taught" && <span className="text-caption text-fg-subtle">you know this</span>}
                {p.state === "met" && <span className="text-caption text-fg-subtle">you've seen this</span>}
                {p.note !== undefined && <span className="text-caption text-fg-subtle">{p.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
