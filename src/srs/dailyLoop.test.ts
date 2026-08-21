import { describe, expect, it } from "vitest";
import type { Book, GrammarPattern, PathProgress, Phrase, ReviewState, Lesson, Word } from "@/types";
import { buildDailySession } from "./dailyLoop";

const NOW = Date.UTC(2026, 4, 16, 12, 0, 0);
const DAY_MS = 24 * 60 * 60 * 1000;

const word = (id: string): Word => ({
  id,
  japanese: id,
  reading: id,
  romaji: id,
  english: id,
  wordType: "noun",
});

const phrase = (id: string): Phrase => ({
  id,
  japanese: id,
  reading: id,
  romaji: id,
  english: id,
  scenario: "test",
});

const grammarPattern = (id: string, phraseId: string): GrammarPattern => ({
  id,
  jlpt: "N5",
  pattern: id,
  gloss: id,
  phraseId,
  blank: "x",
});

const lessons: Lesson[] = [
  {
    id: "lesson-1",
    order: 1,
    situation: "s",
    title: "t",
    canDo: "c",
    wordIds: ["w1", "w2"],
    phraseIds: ["p1"],
    kanji: [],
    grammarNote: "g",
    patternId: "g1",
  },
  {
    id: "lesson-2",
    order: 2,
    situation: "s",
    title: "t",
    canDo: "c",
    wordIds: ["w3"],
    phraseIds: ["p2"],
    kanji: [],
    grammarNote: "g",
    patternId: "g2",
  },
];

const allWords = ["w1", "w2", "w3"].map(word);
const allPhrases = ["p1", "p2"].map(phrase);
const allPatterns = [grammarPattern("g1", "p1"), grammarPattern("g2", "p2")];

/** The orchestrator takes a book, not a lesson list (03 §0a). */
const bookOf = (bookLessons: readonly Lesson[]): Book => ({
  id: "n5",
  order: 1,
  title: "Test book",
  chapters: [],
  lessons: bookLessons,
  difficultyShift: false,
});

const book = bookOf(lessons);

const emptyProgress: PathProgress = { pathId: "n5", seenLessonIds: [] };

describe("buildDailySession", () => {
  it("returns the first lesson as new when nothing has been seen", () => {
    const session = buildDailySession(book, emptyProgress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.lesson?.id).toBe("lesson-1");
    expect(session.newWords.map((w) => w.id)).toEqual(["w1", "w2"]);
    expect(session.newPhrases.map((p) => p.id)).toEqual(["p1"]);
    expect(session.reviewItems).toEqual([]);
  });

  it("advances to the next unseen lesson", () => {
    const progress: PathProgress = { pathId: "n5", seenLessonIds: ["lesson-1"] };
    const session = buildDailySession(book, progress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.lesson?.id).toBe("lesson-2");
    expect(session.newWords.map((w) => w.id)).toEqual(["w3"]);
  });

  it("returns null lesson once every lesson has been seen", () => {
    const progress: PathProgress = { pathId: "n5", seenLessonIds: ["lesson-1", "lesson-2"] };
    const session = buildDailySession(book, progress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.lesson).toBeNull();
    expect(session.newWords).toEqual([]);
    expect(session.newPhrases).toEqual([]);
  });

  it("surfaces due items only from already-seen lessons, oldest-due first", () => {
    const progress: PathProgress = { pathId: "n5", seenLessonIds: ["lesson-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 2, dueAt: NOW - DAY_MS },
      { phraseId: "w2", box: 2, dueAt: NOW - 2 * DAY_MS },
      { phraseId: "w3", box: 2, dueAt: NOW - DAY_MS }, // due, but lesson-2 not seen yet
      { phraseId: "p1", box: 2, dueAt: NOW + DAY_MS }, // not due yet
    ];

    const session = buildDailySession(book, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["w2", "w1"]);
  });

  it("dedupes review items by phraseId, keeping the earliest due", () => {
    const progress: PathProgress = { pathId: "n5", seenLessonIds: ["lesson-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 1, dueAt: NOW - 2 * DAY_MS },
      { phraseId: "w1", box: 3, dueAt: NOW - DAY_MS },
    ];

    const session = buildDailySession(book, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["w1"]);
  });

  it("interleaves a due grammar pattern into reviewItems by dueAt, not appended after", () => {
    const progress: PathProgress = { pathId: "n5", seenLessonIds: ["lesson-1"] };
    const reviewStates: ReviewState[] = [
      { phraseId: "w1", box: 2, dueAt: NOW - DAY_MS }, // due, newer
      { phraseId: "g1", box: 2, dueAt: NOW - 2 * DAY_MS }, // due, older — should sort first
    ];

    const session = buildDailySession(book, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems.map((i) => i.id)).toEqual(["g1", "w1"]);
  });

  it("does not surface a due grammar pattern from a lesson that hasn't been seen yet", () => {
    const progress: PathProgress = { pathId: "n5", seenLessonIds: [] };
    const reviewStates: ReviewState[] = [{ phraseId: "g1", box: 2, dueAt: NOW - DAY_MS }];

    const session = buildDailySession(book, progress, allWords, allPhrases, allPatterns, reviewStates, NOW);

    expect(session.reviewItems).toEqual([]);
  });

  it("returns the next lesson's grammar pattern as newGrammarPattern", () => {
    const session = buildDailySession(book, emptyProgress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.newGrammarPattern?.id).toBe("g1");
  });

  it("returns null newGrammarPattern when the next lesson has no patternId", () => {
    const unitsWithoutPattern: Lesson[] = [{ ...lessons[0]!, patternId: undefined }];
    const session = buildDailySession(bookOf(unitsWithoutPattern), emptyProgress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.newGrammarPattern).toBeNull();
  });

  it("returns null newGrammarPattern once every lesson has been seen", () => {
    const progress: PathProgress = { pathId: "n5", seenLessonIds: ["lesson-1", "lesson-2"] };
    const session = buildDailySession(book, progress, allWords, allPhrases, allPatterns, [], NOW);

    expect(session.newGrammarPattern).toBeNull();
  });

  describe("across books", () => {
    // A learner in Book Two still owes reviews on Book One's items. Scoping
    // review to the current book would strand them the day the new book opens.
    const laterLesson: Lesson = {
      id: "b2-lesson-1",
      order: 1,
      situation: "s",
      title: "t",
      canDo: "c",
      wordIds: ["w9"],
      phraseIds: [],
      kanji: [],
      grammarNote: "g",
    };
    const bookTwo: Book = { ...bookOf([laterLesson]), id: "n4", order: 2, difficultyShift: true };
    const due = (id: string): ReviewState => ({ phraseId: id, box: 2, dueAt: NOW - DAY_MS });

    it("surfaces a due item from an earlier book", () => {
      const session = buildDailySession(
        bookTwo,
        { pathId: "n4", seenLessonIds: [] },
        [...allWords, word("w9")],
        allPhrases,
        allPatterns,
        [due("w1")],
        NOW,
        [{ book, progress: { pathId: "n5", seenLessonIds: ["lesson-1"] } }],
      );

      expect(session.reviewItems.map((i) => i.id)).toEqual(["w1"]);
    });

    it("still withholds an earlier book's unseen items", () => {
      const session = buildDailySession(
        bookTwo,
        { pathId: "n4", seenLessonIds: [] },
        [...allWords, word("w9")],
        allPhrases,
        allPatterns,
        [due("w3")],
        NOW,
        [{ book, progress: { pathId: "n5", seenLessonIds: ["lesson-1"] } }],
      );

      expect(session.reviewItems).toEqual([]);
    });

    it("takes new material from the current book only", () => {
      const session = buildDailySession(
        bookTwo,
        { pathId: "n4", seenLessonIds: [] },
        [...allWords, word("w9")],
        allPhrases,
        allPatterns,
        [],
        NOW,
        [{ book, progress: { pathId: "n5", seenLessonIds: [] } }],
      );

      expect(session.lesson?.id).toBe("b2-lesson-1");
    });
  });
});
