import { useProgress } from "@/store/progress";
import { useAuth } from "@/store/auth";
import { KANA_PRACTICE_CARDS } from "@/lib/kanaData";
import type { KanaScript } from "@/types";

// Mastery threshold must match the server constant
const MASTERY_THRESHOLD = 3;

const TOTAL_KANA: Record<KanaScript, number> = {
  hiragana: [...new Set(KANA_PRACTICE_CARDS.filter((c) => c.script === "hiragana").map((c) => c.kana))].length,
  katakana: [...new Set(KANA_PRACTICE_CARDS.filter((c) => c.script === "katakana").map((c) => c.kana))].length,
};

type BarProps = {
  reviewedFraction: number;
  masteredFraction: number;
};

function TwoToneBar({ reviewedFraction, masteredFraction }: BarProps) {
  const reviewed = Math.min(reviewedFraction, 1);
  const mastered = Math.min(masteredFraction, reviewed);
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      {/* light = reviewed */}
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-brand-200 transition-all duration-300"
        style={{ width: `${reviewed * 100}%` }}
      />
      {/* dark = mastered */}
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-brand-600 transition-all duration-300"
        style={{ width: `${mastered * 100}%` }}
      />
    </div>
  );
}

type RowProps = {
  label: string;
  reviewed: number;
  mastered: number;
  total: number;
};

function ProgressRow({ label, reviewed, mastered, total }: RowProps) {
  if (total === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-caption text-fg-subtle">{label}</span>
        <span className="text-caption text-fg-faint">{reviewed}/{total}</span>
      </div>
      <TwoToneBar reviewedFraction={reviewed / total} masteredFraction={mastered / total} />
    </div>
  );
}

type Section = "practice" | "kana" | "kanji" | "all";

type ProgressWidgetProps = {
  section: Section;
};

export function ProgressWidget({ section }: ProgressWidgetProps) {
  const user = useAuth((s) => s.user);
  const stats = useProgress((s) => s.stats);
  const kanaProgress = useProgress((s) => s.kanaProgress);

  // Kana mastery from store (works for guests too)
  const kanaStats = {
    hiragana: {
      recognized: kanaProgress.filter(
        (e) => e.script === "hiragana" && e.recognizedCount >= MASTERY_THRESHOLD,
      ).length,
      recalled: kanaProgress.filter(
        (e) => e.script === "hiragana" && e.recalledCount >= MASTERY_THRESHOLD,
      ).length,
      seen: kanaProgress.filter((e) => e.script === "hiragana").length,
    },
    katakana: {
      recognized: kanaProgress.filter(
        (e) => e.script === "katakana" && e.recognizedCount >= MASTERY_THRESHOLD,
      ).length,
      recalled: kanaProgress.filter(
        (e) => e.script === "katakana" && e.recalledCount >= MASTERY_THRESHOLD,
      ).length,
      seen: kanaProgress.filter((e) => e.script === "katakana").length,
    },
  };

  const showPhrases = section === "practice" || section === "all";
  const showKana = section === "kana" || section === "all";
  const showKanji = section === "kanji" || section === "all";

  const hasAnything =
    (showPhrases && stats && Object.keys(stats.phrases).length > 0) ||
    (showKana && (kanaStats.hiragana.seen > 0 || kanaStats.katakana.seen > 0)) ||
    (showKanji && stats && Object.keys(stats.kanji).length > 0);

  if (!hasAnything) return null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-caption font-medium uppercase tracking-wide text-fg-faint">Progress</p>

      <div className="flex flex-col gap-3">
        {/* Phrases by JLPT level */}
        {showPhrases && stats && Object.entries(stats.phrases)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([level, s]) => (
            <ProgressRow
              key={`phrase-${level}`}
              label={`N${level} Phrases`}
              reviewed={s.reviewed}
              mastered={s.mastered}
              total={s.total}
            />
          ))}

        {/* Kana */}
        {showKana && kanaStats.hiragana.seen > 0 && (
          <ProgressRow
            label="Hiragana"
            reviewed={kanaStats.hiragana.recognized}
            mastered={kanaStats.hiragana.recalled}
            total={TOTAL_KANA.hiragana}
          />
        )}
        {showKana && kanaStats.katakana.seen > 0 && (
          <ProgressRow
            label="Katakana"
            reviewed={kanaStats.katakana.recognized}
            mastered={kanaStats.katakana.recalled}
            total={TOTAL_KANA.katakana}
          />
        )}

        {/* Kanji by JLPT level */}
        {showKanji && stats && Object.entries(stats.kanji)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([level, s]) => (
            <ProgressRow
              key={`kanji-${level}`}
              label={`N${level} Kanji`}
              reviewed={s.reviewed}
              mastered={s.mastered}
              total={s.total}
            />
          ))}
      </div>

      {!user && (
        <p className="text-caption text-fg-faint">Sign in to sync progress across devices.</p>
      )}
    </div>
  );
}
