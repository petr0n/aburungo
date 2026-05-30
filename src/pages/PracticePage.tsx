import { useState } from "react";
import { FillBlankScreen } from "@/components/FillBlankScreen";
import { FeedbackSheet } from "@/components/FeedbackSheet";
import { PageShell, SectionNav } from "@/components/PageShell";
import { ProgressWidget } from "@/components/ProgressWidget";

const SECTION_LINKS = [
  { to: "/flashcard", label: "Flashcards" },
  { to: "/kana", label: "Kana" },
];

export function PracticePage() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <PageShell
      onFeedback={() => setFeedbackOpen(true)}
      sideNav={
        <div className="flex flex-col gap-6">
          <SectionNav links={SECTION_LINKS} />
          <ProgressWidget section="practice" />
        </div>
      }
    >
      <FillBlankScreen />
      {feedbackOpen && <FeedbackSheet onClose={() => setFeedbackOpen(false)} />}
    </PageShell>
  );
}
