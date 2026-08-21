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
import type { Word } from "@/types";

const recordRating = vi.fn<(id: string, rating: string, signedIn: boolean) => Promise<void>>(
  () => Promise.resolve(),
);
const recordReview = vi.fn<(id: string, correct: boolean, signedIn: boolean) => Promise<void>>(
  () => Promise.resolve(),
);

vi.mock("@/db/reviewStore", () => ({
  recordRating: (id: string, rating: string, signedIn: boolean) => recordRating(id, rating, signedIn),
  recordReview: (id: string, correct: boolean, signedIn: boolean) => recordReview(id, correct, signedIn),
  getOne: vi.fn(() => Promise.resolve(undefined)),
  upsertSynced: vi.fn(() => Promise.resolve()),
  hydrateFromServer: vi.fn(() => Promise.resolve([])),
}));

vi.mock("@/store/auth", () => ({
  useAuth: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
  useUserTier: () => "guest",
}));

const { ReviewStep } = await import("./LearnPage");

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
    expect(screen.getByText("Recalled!")).toBeTruthy();
    expect(screen.queryByText("mizu")).toBeNull();
  });
});
