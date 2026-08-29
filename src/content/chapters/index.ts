/**
 * Chapters — the named runs of lessons that a checkpoint closes.
 *
 * Pure functions taking `lessons` and `chapters` as parameters rather than
 * importing the ladder directly: content/lessons/index.ts validates lesson
 * `chapterId`s against the chapter list, so importing lessons back into this
 * file would close a cycle.
 */
import type { Chapter, Lesson } from "@/types";
import { parseChapters } from "./schema";

import n5Raw from "./n5.yaml";
import b2Raw from "./b2.yaml";

export const n5Chapters: readonly Chapter[] = parseChapters(n5Raw, "chapters/n5.yaml");

export const n5ChapterIds: ReadonlySet<string> = new Set(n5Chapters.map((c) => c.id));

export const b2Chapters: readonly Chapter[] = parseChapters(b2Raw, "chapters/b2.yaml");

export const b2ChapterIds: ReadonlySet<string> = new Set(b2Chapters.map((c) => c.id));

/** Where a lesson sits inside its chapter, as the session header reads it. */
export type ChapterPlacement = {
  chapter: Chapter;
  /**
   * 1-indexed position among the chapter's *teaching* lessons, or null when the
   * lesson is the chapter's checkpoint. A checkpoint is the chapter closing, not
   * its last lesson, and numbering it as one would overstate how much is left.
   */
  lessonNumber: number | null;
  /** Teaching lessons in this chapter, checkpoint excluded. */
  lessonCount: number;
  /** Teaching lessons still ahead before this chapter's checkpoint, excluding this one. */
  remaining: number;
};

/**
 * Place a lesson within its chapter.
 *
 * Returns null for a lesson with no chapter — the checkpoints that close the
 * book rather than a chapter. Callers show the book-level framing instead.
 */
export function placeInChapter(
  lesson: Lesson,
  lessons: readonly Lesson[],
  chapters: readonly Chapter[],
): ChapterPlacement | null {
  if (lesson.chapterId === undefined) return null;
  const chapter = chapters.find((c) => c.id === lesson.chapterId);
  if (chapter === undefined) return null;

  const inChapter = lessons.filter((l) => l.chapterId === chapter.id).sort((a, b) => a.order - b.order);
  const teaching = inChapter.filter((l) => l.checkpoint === undefined);

  const index = teaching.findIndex((l) => l.id === lesson.id);
  const lessonNumber = index === -1 ? null : index + 1;
  const remaining = lessonNumber === null ? 0 : teaching.length - lessonNumber;

  return { chapter, lessonNumber, lessonCount: teaching.length, remaining };
}

/** "Chapter 2" — chapters are numbered, not named, at the book level. */
export function chapterLabel(chapter: Chapter): string {
  return `Chapter ${chapter.order}`;
}
