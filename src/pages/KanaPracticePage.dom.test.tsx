// @vitest-environment jsdom
/**
 * Kana practice recorded nothing until 2026-08-09 (PR #65). Every layer existed
 * and was correct — table, service, route, API client, a store with optimistic
 * updates and a guest localStorage path, hydration on mount — but the one screen
 * that produces kana answers never called the recorder, so kanaProgress was
 * permanently empty and ProfilePage rendered an array that could never fill.
 *
 * The mode mapping is the part that can silently drift: picking from options is
 * recognition, typing it unprompted is recall, and the server keeps a separate
 * counter for each. Swapping them would corrupt both without any visible error.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

const recordKanaAnswer = vi.fn(() => Promise.resolve());

vi.mock("@/store/progress", () => ({
  useProgress: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      recordKanaAnswer,
      kanaProgress: [],
      stats: null,
      loadKana: vi.fn(),
      loadStats: vi.fn(),
      resetKana: vi.fn(),
    }),
}));

vi.mock("@/store/auth", () => ({
  useAuth: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
  useUserTier: () => "guest",
}));

const { KanaPracticePage } = await import("./KanaPracticePage");

async function startSession(user: ReturnType<typeof userEvent.setup>, mode?: "Type romaji") {
  // PageShell/SectionNav use useLocation, so a router is required.
  render(
    <MemoryRouter>
      <KanaPracticePage />
    </MemoryRouter>,
  );
  if (mode !== undefined) await user.click(screen.getByRole("button", { name: mode }));
  const start = await screen.findByRole("button", { name: /^Start — / });
  await user.click(start);
}

describe("KanaPracticePage", () => {
  beforeEach(() => recordKanaAnswer.mockClear());
  afterEach(cleanup);

  it("records a multiple-choice answer as recognition", async () => {
    const user = userEvent.setup();
    await startSession(user);

    // Any option click is an answer; correctness is irrelevant to recording.
    const buttons = screen.getAllByRole("button");
    const choice = buttons[buttons.length - 1];
    if (choice === undefined) throw new Error("no choice button rendered");
    await user.click(choice);

    await waitFor(() => expect(recordKanaAnswer).toHaveBeenCalledTimes(1));
    const call = recordKanaAnswer.mock.calls[0] as unknown as [
      string | null,
      string,
      string,
      string,
      boolean,
    ];
    expect(call[0]).toBe(null); // guest
    expect(call[3]).toBe("recognized");
    expect(typeof call[1]).toBe("string"); // the kana character
    expect(["hiragana", "katakana"]).toContain(call[2]);
  });

  it("records a typed answer as recall, not recognition", async () => {
    const user = userEvent.setup();
    await startSession(user, "Type romaji");

    const input = await screen.findByPlaceholderText("type romaji…");
    await user.type(input, "zzz{Enter}");

    await waitFor(() => expect(recordKanaAnswer).toHaveBeenCalledTimes(1));
    const call = recordKanaAnswer.mock.calls[0] as unknown as [
      string | null,
      string,
      string,
      string,
      boolean,
    ];
    // The mapping that matters: typing is recall. Swapping these two silently
    // corrupts both server counters with no visible error.
    expect(call[3]).toBe("recalled");
    expect(call[4]).toBe(false); // "zzz" is wrong, and a miss must still record
  });
});
