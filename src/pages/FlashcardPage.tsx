import { FlashcardScreen } from "@/components/FlashcardScreen";
import { PageShell, SectionNav } from "@/components/PageShell";
import { ProgressWidget } from "@/components/ProgressWidget";

const SECTION_LINKS = [
  { to: "/practice", label: "Fill-In" },
  { to: "/kana", label: "Kana" },
];

export function FlashcardPage() {
  return (
    <PageShell
      sideNav={
        <div className="flex flex-col gap-6">
          <SectionNav links={SECTION_LINKS} />
          <ProgressWidget section="practice" />
        </div>
      }
    >
      <FlashcardScreen />
    </PageShell>
  );
}
