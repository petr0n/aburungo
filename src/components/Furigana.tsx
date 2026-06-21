import { splitFurigana } from "@/lib/furigana";

type Props = {
  japanese: string;
  reading: string;
  /** Classes for the wrapping inline element (size, color, weight). */
  className?: string;
};

/**
 * Renders a Japanese word with furigana above its kanji using <ruby>.
 * Falls back to plain text when there is nothing to annotate (pure kana).
 * The reading sits over the kanji core; shared kana (okurigana, honorific
 * prefixes) render inline at full size. See src/lib/furigana.ts.
 */
export function Furigana({ japanese, reading, className }: Props) {
  const segments = splitFurigana(japanese, reading);

  return (
    <span
      lang="ja"
      className={className}
      style={{ fontFamily: "var(--font-jp)" }}
    >
      {segments.map((seg, i) =>
        seg.ruby !== undefined ? (
          <ruby key={i}>
            {seg.text}
            <rt className="font-normal opacity-60">{seg.ruby}</rt>
          </ruby>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </span>
  );
}
