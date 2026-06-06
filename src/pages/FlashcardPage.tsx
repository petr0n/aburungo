import { useState, useMemo } from "react";
import { FlashcardScreen } from "@/components/FlashcardScreen";
import { PageShell, SectionNav } from "@/components/PageShell";
import { ProgressWidget } from "@/components/ProgressWidget";
import { phrasesForTier } from "@/content";
import { wordsForTier } from "@/content/vocabulary";
import { useUserTier } from "@/store/auth";

type ContentMode = "words" | "phrases";

const SECTION_LINKS = [
  { to: "/practice", label: "Fill-In" },
  { to: "/kana", label: "Kana" },
];

export function FlashcardPage() {
  const [mode, setMode] = useState<ContentMode>("words");
  const tier = useUserTier();

  const cards = useMemo(
    () => mode === "words" ? wordsForTier(tier) : phrasesForTier(tier),
    [mode, tier],
  );

  return (
    <PageShell
      sideNav={
        <div className="flex flex-col gap-6">
          <SectionNav links={SECTION_LINKS} />
          <ProgressWidget section="practice" />
        </div>
      }
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex rounded-xl border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setMode("words")}
            className={[
              "flex min-h-[44px] flex-1 items-center justify-center rounded-lg text-body-sm font-medium transition-colors",
              mode === "words" ? "bg-bg text-fg shadow-card" : "text-fg-subtle active:bg-surface-2",
            ].join(" ")}
          >
            Words
          </button>
          <button
            type="button"
            onClick={() => setMode("phrases")}
            className={[
              "flex min-h-[44px] flex-1 items-center justify-center rounded-lg text-body-sm font-medium transition-colors",
              mode === "phrases" ? "bg-bg text-fg shadow-card" : "text-fg-subtle active:bg-surface-2",
            ].join(" ")}
          >
            Phrases
          </button>
        </div>
        <FlashcardScreen cards={cards} />
      </div>
    </PageShell>
  );
}
