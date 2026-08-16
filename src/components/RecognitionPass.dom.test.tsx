// @vitest-environment jsdom
/**
 * The recognition pass shipped for months reporting nothing: `onDone` carried no
 * result and the component imported nothing from src/srs/, so answering every
 * card wrong was indistinguishable from answering every card right. Its own
 * closing line promised "Tricky words will come back sooner", which was true of
 * nothing (fixed 2026-08-08, PR #64).
 *
 * These pin the contract WordsPage and LearnPage both rely on: a miss is
 * reported, a hit is not. The asymmetry is deliberate — in /learn these words
 * were scheduled by the produce step moments earlier, so promoting on a hit too
 * would move a brand-new word to box 3 and skip its short intervals.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Word } from "@/types";
import { RecognitionPass } from "./RecognitionPass";

function word(id: string, japanese: string): Word {
  return {
    id,
    japanese,
    reading: japanese,
    romaji: id,
    english: `${id}-meaning`,
    jlpt: "N5",
    wordType: "noun",
  } as Word;
}

const target = word("vocab.target", "朝");
const pool = [target, word("vocab.d1", "夜"), word("vocab.d2", "昼")];

/** The option button that is NOT the prompted word. */
function wrongOption(): HTMLElement {
  const buttons = screen.getAllByRole("button");
  const wrong = buttons.find(
    (b) => b.textContent !== null && b.textContent.includes("夜"),
  );
  if (wrong === undefined) throw new Error("no distractor button rendered");
  return wrong;
}

describe("RecognitionPass", () => {
  afterEach(cleanup);

  it("reports a miss so the caller can re-schedule it", async () => {
    const user = userEvent.setup();
    const onMissed = vi.fn();
    render(<RecognitionPass queue={[target]} pool={pool} onMissed={onMissed} onDone={() => {}} />);

    await user.click(wrongOption());

    // handleSelect defers advance() by 350ms so the choice stays visible.
    await waitFor(() => expect(onMissed).toHaveBeenCalledTimes(1));
    expect(onMissed).toHaveBeenCalledWith(expect.objectContaining({ id: "vocab.target" }));
  });

  it("treats a skip as not recalled", async () => {
    // Skipping used to report a hit, so the one word the learner explicitly
    // declined to answer was the one word never re-surfaced.
    const user = userEvent.setup();
    const onMissed = vi.fn();
    render(<RecognitionPass queue={[target]} pool={pool} onMissed={onMissed} onDone={() => {}} />);

    await user.click(screen.getByRole("button", { name: /skip/i }));

    await waitFor(() => expect(onMissed).toHaveBeenCalledTimes(1));
    expect(onMissed).toHaveBeenCalledWith(expect.objectContaining({ id: "vocab.target" }));
  });

  it("stays silent on a hit, so produce-step scheduling is not double-counted", async () => {
    const user = userEvent.setup();
    const onMissed = vi.fn();
    render(<RecognitionPass queue={[target]} pool={pool} onMissed={onMissed} onDone={() => {}} />);

    const correct = screen.getAllByRole("button").find((b) => b.textContent?.includes("朝"));
    if (correct === undefined) throw new Error("no correct button rendered");
    await user.click(correct);

    // Wait past the same 350ms defer, otherwise this passes merely because
    // nothing has run yet — a test that cannot fail is not cover.
    await waitFor(() => expect(screen.queryByText(/Quick check done/)).toBeTruthy());
    expect(onMissed).not.toHaveBeenCalled();
  });

  it("works without the optional callback, for callers that do not schedule", async () => {
    const user = userEvent.setup();
    render(<RecognitionPass queue={[target]} pool={pool} onDone={() => {}} />);

    await user.click(wrongOption());
    await waitFor(() => expect(screen.queryByText(/Quick check done/)).toBeTruthy());
  });
});
