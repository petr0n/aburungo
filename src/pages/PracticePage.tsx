import { useState } from "react";
import { FillBlankScreen } from "@/components/FillBlankScreen";
import { FeedbackSheet } from "@/components/FeedbackSheet";
import { PageShell, SectionNav } from "@/components/PageShell";

const SECTION_LINKS = [
  { to: "/flashcard", label: "Flashcards" },
  { to: "/kana", label: "Kana" },
];

export function PracticePage() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <PageShell
      onFeedback={() => setFeedbackOpen(true)}
      sideNav={<SectionNav links={SECTION_LINKS} />}
    >
      <FillBlankScreen />
      {feedbackOpen && <FeedbackSheet onClose={() => setFeedbackOpen(false)} />}
    </PageShell>
  );
}
