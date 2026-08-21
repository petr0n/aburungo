// @vitest-environment jsdom
/**
 * Cover for frame-based composition (03 §8): the pick → type → result flow,
 * and the mechanical check — the expected sentence must follow the learner's
 * pick, not the attested word.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Phrase, Word, WordType } from "@/types";
import { buildCompositionFrame } from "@/lib/composition";
import { FrameComposeCard } from "./FrameComposeCard";

function word(id: string, reading: string, english: string, wordType: WordType = "noun"): Word {
  return { id, japanese: reading, reading, romaji: id, english, wordType };
}

const waterPlease: Phrase = {
  id: "restaurant.water-please",
  japanese: "水をください",
  reading: "みずをください",
  romaji: "mizu o kudasai",
  english: "Water, please.",
  scenario: "restaurant",
};

const frame = buildCompositionFrame(waterPlease, [word("vocab.mizu", "みず", "water"), word("vocab.ocha", "おちゃ", "tea")]);
if (frame === null) throw new Error("fixture frame must build");

afterEach(cleanup);

async function pick(user: ReturnType<typeof userEvent.setup>, english: string) {
  await user.click(screen.getByRole("button", { name: new RegExp(english) }));
}

async function type(user: ReturnType<typeof userEvent.setup>, romaji: string) {
  await user.type(screen.getByPlaceholderText("Type romaji here…"), romaji);
  await user.click(screen.getByRole("button", { name: "Check answer" }));
}

describe("FrameComposeCard", () => {
  it("shows the frame with a slot and no romaji anywhere", () => {
    render(<FrameComposeCard frame={frame} onNext={vi.fn()} />);

    expect(screen.getByText("＿＿＿をください")).toBeTruthy();
    expect(document.body.textContent).not.toContain("kudasai");
  });

  it("checks the sentence against the learner's pick, not the attested word", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<FrameComposeCard frame={frame} onNext={onNext} />);

    await pick(user, "tea");
    await type(user, "ochawokudasai");
    expect(screen.getByText("Recalled!")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalledWith(true);
  });

  it("reports a miss and reveals the expected sentence for the picked word", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<FrameComposeCard frame={frame} onNext={onNext} />);

    await pick(user, "tea");
    await type(user, "mizuwokudasai"); // right frame, wrong word — the pick is binding
    expect(screen.getByText("Not quite")).toBeTruthy();
    expect(screen.getByText("おちゃをください")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalledWith(false);
  });

  it("lets a stuck learner see the answer, counted as not recalled", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<FrameComposeCard frame={frame} onNext={onNext} />);

    await pick(user, "water");
    await user.click(screen.getByRole("button", { name: "Show answer" }));
    expect(screen.getByText("みずをください")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalledWith(false);
  });
});
