// @vitest-environment jsdom
/**
 * Regression cover for the review-step deadlock (fixed 2026-08-09, PR #66).
 *
 * Ratings used to be persisted from FlipCard's `onExited`, which fires out of
 * `onAnimationEnd`. The `animate-card-exit` utility is never generated in this
 * project's Tailwind build, so no animationend arrived, the card never advanced
 * and the rating was silently dropped — the daily review loop was a dead end.
 *
 * jsdom is the right home for this: it does not run CSS animations and never
 * fires animationend. Any future move of persistence back into an animation
 * callback fails here immediately, without needing a real browser.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import type { Kanji, ReviewState, Word } from "@/types";
import { n5Lessons } from "@/content/lessons";
import type { DailySession } from "@/srs/dailyLoop";

const recordRating = vi.fn<(id: string, rating: string, signedIn: boolean) => Promise<void>>(
  () => Promise.resolve(),
);
const recordReview = vi.fn<(id: string, correct: boolean, signedIn: boolean) => Promise<void>>(
  () => Promise.resolve(),
);

const getOne = vi.fn<(id: string) => Promise<ReviewState | undefined>>(() => Promise.resolve(undefined));
const upsertSynced = vi.fn<(state: ReviewState, signedIn: boolean) => Promise<void>>(() => Promise.resolve());

vi.mock("@/db/reviewStore", () => ({
  recordRating: (id: string, rating: string, signedIn: boolean) => recordRating(id, rating, signedIn),
  recordReview: (id: string, correct: boolean, signedIn: boolean) => recordReview(id, correct, signedIn),
  getOne: (id: string) => getOne(id),
  upsertSynced: (state: ReviewState, signedIn: boolean) => upsertSynced(state, signedIn),
  hydrateFromServer: vi.fn(() => Promise.resolve([])),
}));

vi.mock("@/store/auth", () => ({
  useAuth: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
  useUserTier: () => "guest",
}));

/**
 * LearnPage itself is rendered further down, to prove kanji survive the trip
 * from the built session into ReviewStep. Its two Dexie-backed stores and the
 * session builder are stubbed so the assertion is about dispatch, nothing else.
 */
vi.mock("@/db/pathProgressStore", () => ({
  getPathProgress: vi.fn(() => Promise.resolve({ pathId: "book-one", seenLessonIds: [] })),
  markLessonSeen: vi.fn(() => Promise.resolve({ pathId: "book-one", seenLessonIds: [] })),
}));

const buildDailySession = vi.fn<() => DailySession>();

vi.mock("@/srs/dailyLoop", () => ({
  buildDailySession: () => buildDailySession(),
}));

const { ReviewStep, LearnPage } = await import("./LearnPage");

function word(id: string, japanese: string): Word {
  return {
    id,
    japanese,
    reading: japanese,
    romaji: id,
    english: `${id}-en`,
    jlpt: "N5",
    wordType: "noun",
  } as Word;
}

describe("ReviewStep", () => {
  beforeEach(() => {
    recordRating.mockClear();
    recordReview.mockClear();
  });

  // This project does not set vitest `globals`, so RTL's automatic cleanup
  // never registers and renders leak between tests.
  afterEach(cleanup);

  it("persists the rating on click, with no animation event", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[word("vocab.a", "朝")]} onDone={() => {}} />);

    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    await user.click(screen.getByRole("button", { name: /Got it/ }));

    // Nothing dispatched animationend — under the old code this was zero.
    expect(recordRating).toHaveBeenCalledTimes(1);
    expect(recordRating).toHaveBeenCalledWith("vocab.a", "got-it", false);
  });

  it("records a miss as 'didnt' rather than skipping it", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[word("vocab.b", "夜")]} onDone={() => {}} />);

    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    await user.click(screen.getByRole("button", { name: /Didn't know/ }));

    expect(recordRating).toHaveBeenCalledWith("vocab.b", "didnt", false);
  });

  it("advances to the next card so the queue cannot deadlock", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[word("vocab.a", "朝"), word("vocab.b", "夜")]} onDone={() => {}} />);

    expect(screen.getByText("Review · 1 / 2")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    await user.click(screen.getByRole("button", { name: /Got it/ }));

    // The whole bug in one assertion: the counter has to move.
    expect(screen.getByText("Review · 2 / 2")).toBeTruthy();
  });

  it("calls onDone after the last card instead of stalling", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<ReviewStep items={[word("vocab.a", "朝")]} onDone={onDone} />);

    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    await user.click(screen.getByRole("button", { name: /Got it/ }));

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

/**
 * The per-book difficulty shift (03 §0b): review gates on recall — the learner
 * types the item from its English instead of flipping and self-rating — and
 * romaji display is cut while romaji *input* keeps converting, IME-style.
 */
describe("ReviewStep with the difficulty shift", () => {
  beforeEach(() => recordRating.mockClear());
  afterEach(cleanup);

  const mizu = { ...word("vocab.mizu", "みず"), romaji: "mizu", english: "water" } as Word;

  async function typeAnswer(user: ReturnType<typeof userEvent.setup>, romaji: string) {
    await user.type(screen.getByPlaceholderText("Type romaji here…"), romaji);
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    await user.click(await screen.findByRole("button", { name: "Next" }));
  }

  it("asks for a typed recall instead of a flip card", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[mizu]} shifted onDone={() => {}} />);

    expect(screen.queryByRole("button", { name: /Reveal/ })).toBeNull();
    await typeAnswer(user, "mizu");

    expect(recordRating).toHaveBeenCalledWith("vocab.mizu", "got-it", false);
  });

  it("records a typed miss as 'didnt'", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[mizu]} shifted onDone={() => {}} />);

    await typeAnswer(user, "ocha");
    expect(recordRating).toHaveBeenCalledWith("vocab.mizu", "didnt", false);
  });

  it("never renders romaji, though typing romaji still converts", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[mizu]} shifted onDone={() => {}} />);

    await user.type(screen.getByPlaceholderText("Type romaji here…"), "mizu");
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    // The result reveals the reading, never the card's romaji field.
    expect(screen.getByText("Correct")).toBeTruthy();
    expect(screen.queryByText("mizu")).toBeNull();
  });
});

const mizuKanji: Kanji = {
  id: "kanji.水",
  character: "水",
  meanings: ["water"],
  allMeanings: ["water"],
  on: ["スイ"],
  kun: ["みず"],
  strokes: 4,
};

/** FlipCard's rotation is the only observable difference between its faces. */
function flipTransform(): string {
  const el = document.querySelector<HTMLElement>('[style*="preserve-3d"]');
  return el?.style.transform ?? "";
}

describe("ReviewStep with a due kanji", () => {
  beforeEach(() => {
    recordRating.mockClear();
    recordReview.mockClear();
  });
  afterEach(cleanup);

  it("drills the character rather than falling through to a flashcard", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[mizuKanji]} onDone={() => {}} />);

    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    expect(screen.getByText("water")).toBeTruthy();
    // Recognition only: nothing here asks the learner to produce a character.
    expect(screen.queryByPlaceholderText("Type romaji here…")).toBeNull();
  });

  it("actually turns the card over when Reveal is pressed", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[mizuKanji]} onDone={() => {}} />);

    // FlipCard keeps both faces mounted and hides one with a CSS rotation, so
    // "the meaning is in the DOM" proves nothing — only the transform does.
    // Narrowing the review step's phase to entering/idle on the way into the
    // card leaves it face-up forever while every text assertion still passes.
    expect(flipTransform()).toContain("rotateY(0deg)");
    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    expect(flipTransform()).toContain("rotateY(180deg)");
  });

  it("records the rating against the kanji id and advances", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<ReviewStep items={[mizuKanji]} onDone={onDone} />);

    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    await user.click(screen.getByRole("button", { name: /Got it/ }));

    expect(recordReview).toHaveBeenCalledWith("kanji.水", true, false);
    // If onRate never reached advance(), the whole daily loop deadlocks here.
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("still drills, not types, under the recall shift", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[mizuKanji]} shifted onDone={() => {}} />);

    // The kanji guard has to run before the shifted branch: FillBlankCard reads
    // romaji and english off the card, which a Kanji does not carry, and the
    // learner must never be asked to produce a character (DR-024).
    expect(screen.queryByPlaceholderText("Type romaji here…")).toBeNull();
    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    expect(screen.getByText("water")).toBeTruthy();
  });

  it("keeps a kanji out of the flashcard staging path", async () => {
    const user = userEvent.setup();
    render(<ReviewStep items={[mizuKanji]} onDone={() => {}} />);

    await user.click(screen.getByRole("button", { name: /Reveal/ }));
    await user.click(screen.getByRole("button", { name: /Didn't know/ }));

    // Staging a kanji would re-render it through FlashCard, which reads
    // fields it does not have.
    expect(recordRating).not.toHaveBeenCalled();
    expect(recordReview).toHaveBeenCalledWith("kanji.水", false, false);
  });
});

/**
 * The one assertion that fails if the review step's kanji filter comes back.
 *
 * LearnPage briefly stripped kanji out of session.reviewItems before handing
 * them to ReviewStep, as scaffolding while the card could not yet accept them.
 * A filtered array stays assignable to the widened prop, so neither the build
 * nor the type-checker notices if it survives — only a rendered kanji does.
 */
describe("LearnPage hands due kanji to the review step", () => {
  beforeEach(() => {
    recordReview.mockClear();
    buildDailySession.mockReturnValue({
      lesson: null,
      reviewItems: [mizuKanji],
      newWords: [],
      newPhrases: [],
      newGrammarPattern: null,
      newKanji: [],
    });
  });
  afterEach(cleanup);

  it("renders the kanji drill card for a due kanji", async () => {
    render(
      <MemoryRouter>
        <LearnPage />
      </MemoryRouter>,
    );

    // Under the filter this said "Review · 1 / 0" at best and rendered nothing.
    expect(await screen.findByText("Review · 1 / 1")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Reveal/ })).toBeTruthy();
    expect(screen.getAllByText("水").length).toBeGreaterThan(0);
  });
});

/**
 * The bug the four task-scoped reviews could not see: kanji were never written
 * to the SRS store at all, so `kanji.日` never became due and KanjiDrillCard was
 * dead code in the shipped app.
 *
 * `produceItems` is what creates a first ReviewState for words, phrases and
 * patterns, and kanji are correctly absent from it — the produce step asks the
 * learner to type the item, and kanji are recognition-only. The seed therefore
 * has to happen when the lesson's introduction is done, which is what these
 * two assertions pin. The end-to-end proof lives in scripts/walkthrough.cjs,
 * where nothing is mocked.
 */
const [firstLesson] = n5Lessons;
if (firstLesson === undefined) throw new Error("the N5 ladder is empty — this test has nothing to teach");

describe("LearnPage seeds a review state for newly introduced kanji", () => {

  beforeEach(() => {
    getOne.mockClear();
    upsertSynced.mockClear();
    getOne.mockResolvedValue(undefined);
    buildDailySession.mockReturnValue({
      lesson: firstLesson,
      reviewItems: [],
      // No words or phrases, so the intro hands straight off and the session
      // never reaches the produce step — exactly the case where a seed that
      // lived inside the produce branch would silently do nothing.
      newWords: [],
      newPhrases: [],
      newGrammarPattern: null,
      newKanji: [mizuKanji],
    });
  });
  afterEach(cleanup);

  it("writes a box-1 state so the kanji is due tomorrow", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LearnPage />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole("button", { name: "Start" }));

    // "didnt" is deliberate: box 1, due in a day. "got-it" would put a kanji
    // the learner has only just met into box 2, three days out.
    await vi.waitFor(() =>
      expect(upsertSynced).toHaveBeenCalledWith(
        expect.objectContaining({ phraseId: "kanji.水", box: 1 }),
        false,
      ),
    );
  });

  it("leaves a kanji that is already progressing where it is", async () => {
    // 27 characters are taught by more than one lesson (日 by four). Without the
    // getOne guard, meeting one again knocks it back to box 1.
    getOne.mockResolvedValue({ phraseId: "kanji.水", box: 4, dueAt: Date.now() + 1000 });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LearnPage />
      </MemoryRouter>,
    );

    await user.click(await screen.findByRole("button", { name: "Start" }));
    await vi.waitFor(() => expect(getOne).toHaveBeenCalledWith("kanji.水"));
    expect(upsertSynced).not.toHaveBeenCalled();
  });
});
