// @vitest-environment jsdom
/**
 * The two things that make this exercise what it is, rather than a fill-in.
 *
 * The model has to stay on screen — during input, after switching method, and
 * in the feedback. And the pieces have to rebuild the sentence they came from,
 * because the whole method rests on the authored split being exact.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Phrase } from "@/types";
import { GuidedProductionCard } from "./GuidedProductionCard";
import { allPhrases } from "@/content/index";

afterEach(cleanup);

// A real card, so the test breaks if the content it depends on changes shape.
const phrase = allPhrases.find((p) => p.id === "plain.i-drink-coffee-every-day") as Phrase & {
  chunks: readonly string[];
};

describe("guided production", () => {
  it("rebuilds the sentence from its pieces and accepts it", async () => {
    const user = userEvent.setup();
    let matched: boolean | null = null;
    render(<GuidedProductionCard phrase={phrase} onNext={(m) => { matched = m; }} />);

    await user.click(screen.getByRole("button", { name: "Build the answer" }));
    const bank = screen.getByRole("button", { name: phrase.chunks[0] }).parentElement!;
    for (const chunk of phrase.chunks) {
      await user.click(within(bank).getByRole("button", { name: chunk }));
    }
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(screen.getByText("Correct")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(matched).toBe(true);
  });

  it("keeps the model visible in the feedback", async () => {
    const user = userEvent.setup();
    render(<GuidedProductionCard phrase={phrase} onNext={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Build the answer" }));
    const bank = screen.getByRole("button", { name: phrase.chunks[0] }).parentElement!;
    // Out of order on purpose: a wrong answer is where a learner most needs the
    // model, and it is the state most likely to hide it.
    for (const chunk of [...phrase.chunks].reverse()) {
      await user.click(within(bank).getByRole("button", { name: chunk }));
    }
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(screen.getByText("Not quite")).toBeTruthy();
    expect(screen.getByText(phrase.english)).toBeTruthy();
    expect(document.body.textContent).toContain(phrase.chunks[0]);
  });

  it("does not lose placed pieces when the method changes", async () => {
    const user = userEvent.setup();
    render(<GuidedProductionCard phrase={phrase} onNext={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Build the answer" }));
    const bank = screen.getByRole("button", { name: phrase.chunks[0] }).parentElement!;
    await user.click(within(bank).getByRole("button", { name: phrase.chunks[0] }));

    await user.click(screen.getByRole("button", { name: "Type the answer" }));
    await user.click(screen.getByRole("button", { name: "Build the answer" }));

    expect(screen.getByRole("button", { name: `Remove ${phrase.chunks[0]}` })).toBeTruthy();
  });
});
