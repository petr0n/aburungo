import { FlashcardScreen } from "@/components/FlashcardScreen";
import { PageShell, SectionNav } from "@/components/PageShell";

const SECTION_LINKS = [
  { to: "/practice", label: "Fill-In" },
  { to: "/kana", label: "Kana" },
];

export function FlashcardPage() {
  return (
    <PageShell sideNav={<SectionNav links={SECTION_LINKS} />}>
      <FlashcardScreen />
    </PageShell>
  );
}
