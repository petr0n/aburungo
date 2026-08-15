// @vitest-environment jsdom
/**
 * Behavioural cover for the can-do checkpoint (DR-022).
 *
 * The things worth pinning here are the ones that would fail silently: a
 * verified can-do that never persists, an unreachable assessor that strands the
 * learner, an early exit that quietly completes the lesson and locks them out of
 * the can-dos they had left. None of those throw — they just leave someone
 * stuck, which is why they get a test rather than an inspection.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ConversationScope, Lesson } from "@/types";

const createSession = vi.fn<() => Promise<{ sessionId: string }>>(() =>
  Promise.resolve({ sessionId: "session-1" }),
);
const assessCanDo = vi.fn<() => Promise<{ verified: boolean; note: string }>>(() =>
  Promise.resolve({ verified: true, note: "That worked well." }),
);
const streamMessage = vi.fn(async function* () {
  yield "はい、どうぞ。";
});

vi.mock("@/api/conversation", () => ({
  createSession: () => createSession(),
  assessCanDo: () => assessCanDo(),
  streamMessage: () => streamMessage(),
}));

const { CanDoCheckpoint } = await import("./CanDoCheckpoint");

const lesson: Lesson = {
  id: "n5.unit-39",
  order: 45,
  situation: "Integration & checkpoint",
  title: "Can-do checkpoint",
  canDo: "Handle every situation on the ladder unaided",
  wordIds: [],
  phraseIds: [],
  kanji: [],
  grammarNote: "Pick a situation and play it through.",
  checkpoint: "can-do",
};

const scope: ConversationScope = {
  situation: "At the café",
  canDo: "Handle a whole at the café exchange unaided",
  words: [{ japanese: "コーヒー", reading: "こーひー", english: "coffee" }],
  maxTurns: 7,
};

const situations = ["Greetings", "Food & drink", "Shopping"];

function setup(over: Partial<Parameters<typeof CanDoCheckpoint>[0]> = {}) {
  const props = {
    lesson,
    situations,
    verified: new Set<string>(),
    scopeFor: () => scope,
    signedIn: true,
    onVerified: vi.fn(),
    onComplete: vi.fn(),
    onLater: vi.fn(),
    ...over,
  };
  render(<CanDoCheckpoint {...props} />);
  return props;
}

/** Walk from the list to a finished, assessed conversation. */
async function playThrough(user: ReturnType<typeof userEvent.setup>, situation = "Food & drink") {
  await user.click(screen.getByRole("button", { name: new RegExp(situation) }));
  const input = await screen.findByPlaceholderText("Type a message…");

  // Two learner turns, the minimum before checking is offered. Waits on Hana's
  // reply rather than the send button — the button is disabled on an empty
  // input too, so it never re-enables on its own.
  const turns = ["コーヒー", "お願いします"];
  for (let i = 0; i < turns.length; i++) {
    await user.type(input, turns[i] as string);
    await user.click(screen.getByRole("button", { name: "↑" }));
    await waitFor(() => expect(screen.getAllByText("はい、どうぞ。")).toHaveLength(i + 1));
  }

  await user.click(await screen.findByRole("button", { name: "Finish and check" }));
}

beforeEach(() => {
  // Re-set implementations, not just call counts: mockClear leaves a rejection
  // configured by an earlier test in place, which fails the next one somewhere
  // far from the cause.
  createSession.mockReset();
  createSession.mockResolvedValue({ sessionId: "session-1" });
  assessCanDo.mockReset();
  assessCanDo.mockResolvedValue({ verified: true, note: "That worked well." });
});
afterEach(cleanup);

describe("the list", () => {
  it("counts what is left, never a total or a ratio", () => {
    // The CLAUDE.md test: a number that shrinks to zero as you work is a gate,
    // one that stands is a grade. "2 of 3" would be a grade.
    setup({ verified: new Set(["Greetings"]) });
    expect(screen.getByText("2 situations to go")).toBeTruthy();
    expect(screen.queryByText(/of 3/)).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("says '1 situation to go' rather than '1 situations to go'", () => {
    setup({ verified: new Set(["Greetings", "Food & drink"]) });
    expect(screen.getByText("1 situation to go")).toBeTruthy();
  });

  it("shows every situation, with the verified ones checked off and locked", () => {
    setup({ verified: new Set(["Greetings"]) });
    expect(screen.getByRole<HTMLButtonElement>("button", { name: /Greetings/ }).disabled).toBe(true);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: /Shopping/ }).disabled).toBe(false);
  });
});

describe("running a can-do", () => {
  it("scopes the session to the situation the learner picked", async () => {
    const user = userEvent.setup();
    const scopeFor = vi.fn(() => scope);
    setup({ scopeFor });

    await user.click(screen.getByRole("button", { name: /Shopping/ }));
    expect(scopeFor).toHaveBeenCalledWith("Shopping");
    expect(createSession).toHaveBeenCalled();
  });

  it("does not offer to check before the learner has said anything", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: /Food & drink/ }));
    await screen.findByPlaceholderText("Type a message…");
    expect(screen.queryByRole("button", { name: "Finish and check" })).toBeNull();
  });

  it("persists a verified can-do rather than only showing a tick", async () => {
    // The failure this exists for: a check mark that vanishes on reload.
    const user = userEvent.setup();
    const { onVerified } = setup();
    await playThrough(user);

    await waitFor(() => expect(onVerified).toHaveBeenCalledWith("Food & drink"));
    expect(await screen.findByText("That worked.")).toBeTruthy();
  });

  it("leaves an unverified situation on the list and records nothing", async () => {
    const user = userEvent.setup();
    assessCanDo.mockResolvedValue({ verified: false, note: "Try naming the drink next time." });
    const { onVerified } = setup();
    await playThrough(user);

    expect(await screen.findByText("Not yet.")).toBeTruthy();
    expect(screen.getByText("Try naming the drink next time.")).toBeTruthy();
    expect(onVerified).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Back to the list" }));
    expect(screen.getByText("3 situations to go")).toBeTruthy();
  });

  it("never says the learner failed", async () => {
    const user = userEvent.setup();
    assessCanDo.mockResolvedValue({ verified: false, note: "Try naming the drink next time." });
    setup();
    await playThrough(user);

    const body = document.body.textContent ?? "";
    for (const banned of ["failed", "wrong", "incorrect", "score"]) {
      expect(body.toLowerCase()).not.toContain(banned);
    }
  });

  it("does not strand the learner when the assessor is unreachable", async () => {
    const user = userEvent.setup();
    assessCanDo.mockRejectedValue(new Error("network"));
    const { onVerified } = setup();
    await playThrough(user);

    // Not a spinner, not a verified can-do nobody checked.
    expect(await screen.findByText("Not yet.")).toBeTruthy();
    expect(onVerified).not.toHaveBeenCalled();
  });

  it("tells a guest to sign in rather than reporting an outage", async () => {
    // A 401 is not a fault the learner can do anything about if we describe it
    // as one. Conversation is the only paid part of the ladder.
    const user = userEvent.setup();
    setup({ signedIn: false });

    expect(screen.getByText(/needs an account/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Shopping/ }));
    expect(createSession).not.toHaveBeenCalled();
    expect(screen.queryByText(/not reachable/)).toBeNull();
  });

  it("does not dead-end when Hana cannot be reached at all", async () => {
    const user = userEvent.setup();
    createSession.mockRejectedValue(new Error("network"));
    setup();

    await user.click(screen.getByRole("button", { name: /Shopping/ }));
    expect(await screen.findByText(/Hana is not reachable/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Come back to this later" })).toBeTruthy();
  });
});

describe("finishing", () => {
  it("completes the lesson only once every situation is verified", async () => {
    const user = userEvent.setup();
    const { onComplete } = setup({ verified: new Set(["Greetings", "Shopping"]) });
    await playThrough(user);

    // The last one just landed, so the button finishes rather than going back.
    await user.click(await screen.findByRole("button", { name: "Finish" }));
    expect(onComplete).toHaveBeenCalled();
  });

  it("leaving early does not complete the lesson", async () => {
    // This is the trap the escape hatch has to avoid: lesson 45 is the last on
    // the ladder, so completing it with can-dos outstanding would leave the
    // learner at "All caught up" with no route back to them.
    const user = userEvent.setup();
    const { onComplete, onLater } = setup();

    await user.click(screen.getByRole("button", { name: "Come back to this later" }));
    expect(onLater).toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("offers the finish screen when everything was verified on an earlier visit", () => {
    setup({ verified: new Set(situations) });
    expect(screen.getByText("Every situation checked off.")).toBeTruthy();
  });
});
