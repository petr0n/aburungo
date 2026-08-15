// @vitest-environment jsdom
/**
 * Cover for the production checkpoint (DR-023).
 *
 * The gate loop is the part worth pinning, and specifically the last item of a
 * round: the miss list is React state, so a miss on the final card has not
 * flushed by the time the round ends. Get that wrong and the checkpoint
 * finishes with an item still unwritten — it looks like it worked, which is
 * exactly the kind of failure that never gets noticed by hand.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Phrase, Lesson, Word } from "@/types";
import { ProductionCheckpoint } from "./ProductionCheckpoint";

const lesson: Lesson = {
  id: "n5.checkpoint-production",
  order: 44,
  situation: "Integration & checkpoint",
  title: "Write it from memory",
  canDo: "Produce the vocabulary and phrases from every situation",
  wordIds: [],
  phraseIds: [],
  kanji: [],
  grammarNote: "You will see an English meaning and write the Japanese.",
  checkpoint: "production",
};

function word(id: string, english: string, reading: string): Word {
  return { id, japanese: reading, reading, romaji: reading, english, wordType: "noun", theme: "t" } as Word;
}

const words = [word("w1", "water", "みず"), word("w2", "cat", "ねこ")];
const phrases: Phrase[] = [];

function setup(over: Partial<Parameters<typeof ProductionCheckpoint>[0]> = {}) {
  const props = { lesson, words, phrases, onMissed: vi.fn(), onDone: vi.fn(), ...over };
  render(<ProductionCheckpoint {...props} />);
  return props;
}

async function start(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Start" }));
}

/**
 * Answer the card on screen and move past the result.
 *
 * The romaji input converts to kana before submitting, so tests type romaji
 * exactly as a learner would rather than pre-converted kana.
 */
async function answer(user: ReturnType<typeof userEvent.setup>, romaji: string) {
  await user.type(screen.getByPlaceholderText("Type romaji here…"), romaji);
  await user.click(screen.getByRole("button", { name: "Check answer" }));
  await user.click(await screen.findByRole("button", { name: "Next" }));
}

/** Which item is being asked, so the test can answer it correctly. */
function currentEnglish(): string {
  return screen.getByText(/^(water|cat)$/).textContent ?? "";
}

const ROMAJI: Record<string, string> = { water: "mizu", cat: "neko" };

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("the intro", () => {
  it("explains the checkpoint before starting it", () => {
    setup();
    expect(screen.getByText("Write it from memory")).toBeTruthy();
    expect(screen.getByText(/write the Japanese/)).toBeTruthy();
  });
});

describe("the gate", () => {
  it("counts down what is left, never a total or a ratio", async () => {
    const user = userEvent.setup();
    setup();
    await start(user);

    expect(screen.getByText("2 to write")).toBeTruthy();
    expect(screen.queryByText(/of 2/)).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();

    await answer(user, ROMAJI[currentEnglish()] as string);
    expect(screen.getByText("1 more to write")).toBeTruthy();
  });

  it("finishes when everything is written correctly", async () => {
    const user = userEvent.setup();
    const { onDone, onMissed } = setup();
    await start(user);

    await answer(user, ROMAJI[currentEnglish()] as string);
    await answer(user, ROMAJI[currentEnglish()] as string);

    expect(onDone).toHaveBeenCalled();
    expect(onMissed).not.toHaveBeenCalled();
  });

  it("brings a missed item back instead of finishing", async () => {
    const user = userEvent.setup();
    const { onDone } = setup();
    await start(user);

    await answer(user, "wrong");
    await answer(user, ROMAJI[currentEnglish()] as string);

    // Round 2, holding the one that was missed.
    expect(screen.getByText("Checkpoint · round 2")).toBeTruthy();
    expect(screen.getByText("1 more to write")).toBeTruthy();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("brings back an item missed on the very last card of a round", async () => {
    // The state-flush edge case. A naive check reads the miss list before the
    // final setState lands and finishes the checkpoint with work outstanding.
    const user = userEvent.setup();
    const { onDone } = setup();
    await start(user);

    await answer(user, ROMAJI[currentEnglish()] as string);
    await answer(user, "wrong");

    expect(onDone).not.toHaveBeenCalled();
    expect(screen.getByText("Checkpoint · round 2")).toBeTruthy();
  });

  it("reports each miss so it rejoins the review queue", async () => {
    const user = userEvent.setup();
    const { onMissed } = setup();
    await start(user);

    await answer(user, "wrong");
    expect(onMissed).toHaveBeenCalledTimes(1);
  });

  it("ends once the retry round is written correctly", async () => {
    const user = userEvent.setup();
    const { onDone } = setup();
    await start(user);

    await answer(user, "wrong");
    await answer(user, ROMAJI[currentEnglish()] as string);
    await answer(user, ROMAJI[currentEnglish()] as string);

    expect(onDone).toHaveBeenCalled();
  });

  it("never tells the learner they failed", async () => {
    const user = userEvent.setup();
    setup();
    await start(user);
    await answer(user, "wrong");

    const body = (document.body.textContent ?? "").toLowerCase();
    for (const banned of ["failed", "incorrect", "score", "wrong answer"]) {
      expect(body).not.toContain(banned);
    }
  });
});

describe("edge cases", () => {
  it("does not hang when the ladder taught nothing", async () => {
    const user = userEvent.setup();
    const { onDone } = setup({ words: [], phrases: [] });
    await start(user);

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onDone).toHaveBeenCalled();
  });
});
