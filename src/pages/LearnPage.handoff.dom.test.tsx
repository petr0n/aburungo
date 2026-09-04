// @vitest-environment jsdom
/**
 * The book-to-book hand-off, asserted at the page.
 *
 * `currentBook` is unit-tested against fixtures next to itself. This file
 * covers the part that was actually broken: the selection existed as data and
 * never reached the page, because `LearnPage` defaulted its `book` prop to
 * Book One and `App.tsx` passes no prop. Every test was green and every
 * walkthrough session was Book One.
 *
 * So the assertions here are about dispatch — which book `buildDailySession`
 * is handed, and what rides along in `prior`. Mocked at the same boundary
 * LearnPage.review.dom.test.tsx uses: the two Dexie-backed stores and the
 * session builder.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { Book, PathProgress, UserTier } from "@/types";
import { bookOne, bookThree, bookTwo, books } from "@/content/books";
import type { DailySession } from "@/srs/dailyLoop";

const state = vi.hoisted(() => ({
  tier: "free" as UserTier,
  signedIn: true,
  /** progressKey -> lesson ids the learner has seen. */
  seen: new Map<string, string[]>(),
}));

vi.mock("@/store/auth", () => ({
  useAuth: (selector: (s: { user: { id: string } | null }) => unknown) =>
    selector({ user: state.signedIn ? { id: "u1" } : null }),
  useUserTier: () => state.tier,
}));

const getPathProgress = vi.fn(
  (pathId: string, signedIn: boolean): Promise<PathProgress> => {
    void signedIn;
    return Promise.resolve({ pathId, seenLessonIds: state.seen.get(pathId) ?? [] });
  },
);

vi.mock("@/db/pathProgressStore", () => ({
  getPathProgress: (pathId: string, signedIn: boolean) => getPathProgress(pathId, signedIn),
  markLessonSeen: vi.fn(() => Promise.resolve({ pathId: "n5", seenLessonIds: [] })),
}));

vi.mock("@/db/reviewStore", () => ({
  recordRating: vi.fn(() => Promise.resolve()),
  recordReview: vi.fn(() => Promise.resolve()),
  getOne: vi.fn(() => Promise.resolve(undefined)),
  upsertSynced: vi.fn(() => Promise.resolve()),
  hydrateFromServer: vi.fn(() => Promise.resolve([])),
}));

const empty: DailySession = {
  lesson: null,
  reviewItems: [],
  newWords: [],
  newPhrases: [],
  newGrammarPattern: null,
  newKanji: [],
};

/** Records every argument, because the argument is the whole point here. */
const buildDailySession = vi.fn((...args: unknown[]): DailySession => {
  void args;
  return empty;
});

vi.mock("@/srs/dailyLoop", () => ({
  buildDailySession: (...args: unknown[]) => buildDailySession(...args),
}));

const { LearnPage } = await import("./LearnPage");

const allOf = (book: Book): string[] => book.lessons.map((l) => l.id);

function bookPassedToBuilder(): Book {
  const call = buildDailySession.mock.calls[0];
  if (call === undefined) throw new Error("buildDailySession was never called");
  return call[0] as Book;
}

function priorPassedToBuilder(): Array<{ book: Book; progress: PathProgress }> {
  const call = buildDailySession.mock.calls[0];
  if (call === undefined) throw new Error("buildDailySession was never called");
  return call[8] as Array<{ book: Book; progress: PathProgress }>;
}

async function renderLearn() {
  render(
    <MemoryRouter>
      <LearnPage />
    </MemoryRouter>,
  );
  await vi.waitFor(() => expect(buildDailySession).toHaveBeenCalled());
}

beforeEach(() => {
  buildDailySession.mockClear();
  getPathProgress.mockClear();
  state.tier = "free";
  state.signedIn = true;
  state.seen = new Map();
});
afterEach(cleanup);

describe("LearnPage picks the book off the learner's progress", () => {
  it("stays on Book One while Book One has unseen lessons", async () => {
    state.seen.set(bookOne.progressKey, allOf(bookOne).slice(0, 3));
    await renderLearn();
    expect(bookPassedToBuilder()).toBe(bookOne);
  });

  it("moves a learner who has finished Book One on to Book Two", async () => {
    // Fails against the old default, which pinned every session to Book One
    // no matter how much of it the learner had done.
    state.seen.set(bookOne.progressKey, allOf(bookOne));
    await renderLearn();
    expect(bookPassedToBuilder()).toBe(bookTwo);
  });

  it("keeps Book One's items coming back once the learner is in Book Two", async () => {
    // Review is cumulative. A learner who advances and stops seeing Book One
    // is the regression this asserts against: `prior` is what carries their
    // due items into the new book's sessions.
    state.seen.set(bookOne.progressKey, allOf(bookOne));
    await renderLearn();
    const prior = priorPassedToBuilder();
    expect(prior.map((p) => p.book)).toEqual([bookOne]);
    expect(prior[0]?.progress.seenLessonIds).toEqual(allOf(bookOne));
  });

  it("holds a guest on Book One even when they have finished it", async () => {
    state.tier = "guest";
    state.signedIn = false;
    state.seen.set(bookOne.progressKey, allOf(bookOne));
    await renderLearn();
    expect(bookPassedToBuilder()).toBe(bookOne);
  });

  it("reads progress on every book's progressKey, never on its id", async () => {
    // "book-1" is Book One's id; "n5" is its progress key, and the key is the
    // primary key of every stored row. Asking on the id reads an empty row.
    await renderLearn();
    const asked = getPathProgress.mock.calls.map((c) => c[0]);
    // Derived from `books` rather than listed, so adding a book does not break
    // a test about key-versus-id. The vacuity guard is the id check below: an
    // empty `asked` would satisfy the equality on its own.
    expect(asked).toEqual(books.map((b) => b.progressKey));
    expect(asked.length).toBeGreaterThan(1);
    expect(asked).not.toContain("book-1");
  });

  it("honours an explicit book prop over the derived choice", async () => {
    state.seen.set(bookOne.progressKey, allOf(bookOne));
    render(
      <MemoryRouter>
        <LearnPage book={bookOne} />
      </MemoryRouter>,
    );
    await vi.waitFor(() => expect(buildDailySession).toHaveBeenCalled());
    expect(bookPassedToBuilder()).toBe(bookOne);
  });
});

describe("the gated hand-off", () => {
  it("offers a guest a soft prompt toward the next book, not a redirect", async () => {
    state.tier = "guest";
    state.signedIn = false;
    state.seen.set(bookOne.progressKey, allOf(bookOne));
    await renderLearn();

    expect(await screen.findByText(/All caught up!/)).toBeTruthy();
    expect(screen.getByText(/end of Book One/)).toBeTruthy();
    expect(screen.getByText(/Book Two carries on from here/)).toBeTruthy();
    // Soft: the learner is still on /learn, with a link they may ignore.
    expect(screen.getByRole("link", { name: /a free account/ }).getAttribute("href")).toBe("/");
  });

  it("says nothing when there is no book after the one they finished", async () => {
    // A free account reaches four books and the course ships three, so a
    // learner who has finished all of them is at the end of the course, not at
    // a gate. Nothing to offer. Every book must be marked seen: finishing only
    // Book Two now hands them to Book Three, which is the next test up.
    state.seen.set(bookOne.progressKey, allOf(bookOne));
    state.seen.set(bookTwo.progressKey, allOf(bookTwo));
    state.seen.set(bookThree.progressKey, allOf(bookThree));
    await renderLearn();
    expect(bookPassedToBuilder()).toBe(bookThree);
    expect(await screen.findByText(/All caught up!/)).toBeTruthy();
    expect(screen.queryByText(/carries on from here/)).toBeNull();
  });

  it("does not celebrate, count down, or grade the finish", async () => {
    state.tier = "guest";
    state.signedIn = false;
    state.seen.set(bookOne.progressKey, allOf(bookOne));
    await renderLearn();
    const text = document.body.textContent ?? "";
    // No gamification, and no JLPT level in front of the learner (DR-024).
    for (const banned of ["unlock", "Unlock", "congrat", "Congrat", "🎉", "N5", "N4", "unit"]) {
      expect(text).not.toContain(banned);
    }
  });
});
