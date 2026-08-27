import { useEffect, useState } from "react";
import type { Chapter } from "@/types";

type Props = {
  /** Remounted per book (keyed on book id in App), so chapters never change mid-life. */
  chapters: readonly Chapter[];
};

const sectionId = (chapter: Chapter) => `ch-${chapter.order}`;

/**
 * The floating chapter rail — fixed to the right edge, one jump target per
 * chapter, the one in view highlighted. Highlighting watches a band near the
 * top of the viewport, so the active entry is the chapter whose header last
 * crossed it; jsdom has no IntersectionObserver, so the effect degrades to a
 * static rail there.
 */
export function ChapterNav({ chapters }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    for (const chapter of chapters) {
      const el = document.getElementById(sectionId(chapter));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [chapters]);

  if (chapters.length === 0) return null;
  const current = active ?? sectionId(chapters[0]);

  return (
    <nav className="rail" aria-label="Chapters">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          type="button"
          className={sectionId(chapter) === current ? "on" : undefined}
          title={chapter.title}
          onClick={() => document.getElementById(sectionId(chapter))?.scrollIntoView()}
        >
          <span className="rn">{chapter.order}</span>
          <span className="rt">{chapter.title}</span>
        </button>
      ))}
    </nav>
  );
}
