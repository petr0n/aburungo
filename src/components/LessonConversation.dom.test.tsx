// @vitest-environment jsdom
/**
 * Cover for lesson 44 (DR-022).
 *
 * There is no gate and nothing is recorded here, so the only way this lesson can
 * be wrong is by trapping the learner: it is the second-to-last lesson on the
 * ladder, and it has three ways to have no conversation available — guest,
 * unreachable server, or a ladder too short to have two situations. All three
 * must still lead somewhere.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ConversationScope, Lesson } from "@/types";

const createSession = vi.fn<() => Promise<{ sessionId: string }>>(() =>
  Promise.resolve({ sessionId: "session-1" }),
);

vi.mock("@/api/conversation", () => ({
  createSession: () => createSession(),
  streamMessage: vi.fn(async function* () {
    yield "はい。";
  }),
}));

const { LessonConversation } = await import("./LessonConversation");

const lesson: Lesson = {
  id: "n5.unit-38",
  order: 44,
  situation: "Integration & checkpoint",
  title: "Cross-situation conversation",
  canDo: "Hold a longer exchange spanning two situations",
  wordIds: [],
  phraseIds: [],
  kanji: [],
  grammarNote: "No new material.",
  checkpoint: "conversation",
};

const scope: ConversationScope = {
  situation: "Greetings, then Food & drink",
  canDo: "Move from greetings to food & drink in one conversation",
  words: [{ japanese: "コーヒー", reading: "こーひー", english: "coffee" }],
  maxTurns: 6,
};

function setup(over: Partial<Parameters<typeof LessonConversation>[0]> = {}) {
  const props = { lesson, scope, signedIn: true, onDone: vi.fn(), ...over };
  render(<LessonConversation {...props} />);
  return props;
}

beforeEach(() => {
  createSession.mockReset();
  createSession.mockResolvedValue({ sessionId: "session-1" });
});
afterEach(cleanup);

it("names the scene so the learner knows which two situations to expect", () => {
  setup();
  expect(screen.getByText("Greetings, then Food & drink")).toBeTruthy();
});

it("opens a scoped conversation", async () => {
  const user = userEvent.setup();
  setup();
  await user.click(screen.getByRole("button", { name: "Start conversation" }));
  expect(createSession).toHaveBeenCalled();
  expect(await screen.findByPlaceholderText("Type a message…")).toBeTruthy();
});

describe("never dead-ends", () => {
  it("offers a way on when Hana is unreachable", async () => {
    const user = userEvent.setup();
    createSession.mockRejectedValue(new Error("network"));
    const { onDone } = setup();

    await user.click(screen.getByRole("button", { name: "Start conversation" }));
    expect(await screen.findByText(/not reachable/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onDone).toHaveBeenCalled();
  });

  it("offers a way on for a guest, and calls it a sign-in rather than a fault", async () => {
    const user = userEvent.setup();
    const { onDone } = setup({ signedIn: false });

    expect(screen.getByText(/needs an account/)).toBeTruthy();
    expect(screen.queryByText(/not reachable/)).toBeNull();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onDone).toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it("offers a way on when the ladder has not taught two situations", async () => {
    const user = userEvent.setup();
    const { onDone } = setup({ scope: null });

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onDone).toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });
});
