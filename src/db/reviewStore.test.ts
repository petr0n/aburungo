import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewState } from "@/types";

/** One cache per owner, as dexie.ts's dbFor hands out one database per owner. */
const caches = new Map<string, Map<string, ReviewState>>();
function cacheOf(owner: string): Map<string, ReviewState> {
  let c = caches.get(owner);
  if (c === undefined) {
    c = new Map();
    caches.set(owner, c);
  }
  return c;
}

vi.mock("./dexie", () => ({
  dbFor: (owner: string) => ({
    reviewStates: {
      toArray: () => Promise.resolve([...cacheOf(owner).values()]),
      get: (id: string) => Promise.resolve(cacheOf(owner).get(id)),
      put: (v: ReviewState) => {
        cacheOf(owner).set(v.phraseId, v);
        return Promise.resolve();
      },
    },
  }),
}));

const fetchContentProgress = vi.fn();
const saveContentProgress = vi.fn();

vi.mock("@/api/progress", () => ({
  fetchContentProgress: (owner: string) => fetchContentProgress(owner),
  saveContentProgress: (owner: string, e: unknown) => saveContentProgress(owner, e),
}));

const { hydrateFromServer, upsertSynced, recordRating } = await import("./reviewStore");

const USER = "user-a";
const store = cacheOf(USER);
const guest = cacheOf("guest");

beforeEach(() => {
  caches.forEach((c) => c.clear());
  fetchContentProgress.mockReset();
  saveContentProgress.mockReset();
  saveContentProgress.mockResolvedValue(undefined);
});

/**
 * The recovery half of the eight-box fix (graduation spec, 2026-08-28).
 *
 * While the API capped the box at 5, a locally retained box 6-8 state was
 * rejected every time it was pushed — and because the API validates the whole
 * batch, it took every other unsynced item with it. Nothing repaired that: the
 * next hydrate rebuilt the same batch and got the same rejection.
 *
 * Once the API accepts 1-8, recovery has to be automatic rather than a
 * migration: the state is still in the local cache with a newer lastSeenAt
 * than the server's, so the ordinary push picks it up. This pins that, because
 * the recovery path is otherwise only exercised by an account that already hit
 * the bug.
 */
describe("box 6-8 states stranded by the old API", () => {
  it("are pushed on the next hydrate, with the rest of the batch", async () => {
    store.set("high", { phraseId: "high", box: 7, dueAt: 9000, lastSeenAt: 800 });
    store.set("low", { phraseId: "low", box: 2, dueAt: 400, lastSeenAt: 700 });
    fetchContentProgress.mockResolvedValue([]);

    await hydrateFromServer(USER);

    const pushed = saveContentProgress.mock.calls[0]?.[1] as Array<{ contentId: string; box: number }>;
    expect(pushed.map((e) => e.contentId).sort()).toEqual(["high", "low"]);
    expect(pushed.find((e) => e.contentId === "high")?.box).toBe(7);
  });
});

describe("guest", () => {
  it("never contacts the server", async () => {
    guest.set("a", { phraseId: "a", box: 2, dueAt: 100, lastSeenAt: 50 });
    const got = await hydrateFromServer("guest");
    expect(got).toHaveLength(1);
    expect(fetchContentProgress).not.toHaveBeenCalled();

    await upsertSynced("guest", { phraseId: "b", box: 1, dueAt: 200 });
    expect(saveContentProgress).not.toHaveBeenCalled();
  });
});

describe("signed in — merge", () => {
  it("takes the server's version when it is newer", async () => {
    store.set("a", { phraseId: "a", box: 1, dueAt: 100, lastSeenAt: 50 });
    fetchContentProgress.mockResolvedValue([
      { contentId: "a", box: 4, dueAt: 900, lastSeenAt: 500 },
    ]);

    const got = await hydrateFromServer(USER);

    expect(got.find((s) => s.phraseId === "a")?.box).toBe(4);
  });

  it("keeps the local version when it is newer, and pushes it", async () => {
    store.set("a", { phraseId: "a", box: 5, dueAt: 900, lastSeenAt: 800 });
    fetchContentProgress.mockResolvedValue([
      { contentId: "a", box: 2, dueAt: 200, lastSeenAt: 100 },
    ]);

    const got = await hydrateFromServer(USER);

    expect(got.find((s) => s.phraseId === "a")?.box).toBe(5);
    expect(saveContentProgress).toHaveBeenCalledWith(USER, [
      expect.objectContaining({ contentId: "a", box: 5 }),
    ]);
  });

  it("hydrates a second device whose cache is empty", async () => {
    fetchContentProgress.mockResolvedValue([
      { contentId: "a", box: 3, dueAt: 300, lastSeenAt: 200 },
    ]);

    const got = await hydrateFromServer(USER);

    expect(got).toHaveLength(1);
    expect(store.get("a")?.box).toBe(3);
    expect(saveContentProgress).not.toHaveBeenCalled();
  });

  it("pushes local-only state the server has never seen", async () => {
    store.set("a", { phraseId: "a", box: 2, dueAt: 100, lastSeenAt: 50 });
    fetchContentProgress.mockResolvedValue([]);

    await hydrateFromServer(USER);

    expect(saveContentProgress).toHaveBeenCalledWith(USER, [
      expect.objectContaining({ contentId: "a" }),
    ]);
  });

  it("falls back to cache when the server is unreachable", async () => {
    store.set("a", { phraseId: "a", box: 2, dueAt: 100 });
    fetchContentProgress.mockRejectedValue(new Error("offline"));

    const got = await hydrateFromServer(USER);

    expect(got).toHaveLength(1);
  });
});

describe("signed in — writes", () => {
  it("writes locally and sends to the server", async () => {
    await upsertSynced(USER, { phraseId: "a", box: 3, dueAt: 400, lastSeenAt: 300 });

    expect(store.get("a")?.box).toBe(3);
    expect(saveContentProgress).toHaveBeenCalledWith(USER, [
      expect.objectContaining({ contentId: "a", box: 3, lastSeenAt: 300 }),
    ]);
  });

  it("does not interrupt a lesson when the send fails", async () => {
    saveContentProgress.mockRejectedValue(new Error("500"));

    await expect(upsertSynced(USER, { phraseId: "a", box: 1, dueAt: 10 })).resolves.toBeUndefined();
    // Kept locally, so the next hydrate pushes it.
    expect(store.get("a")).toBeDefined();
  });
});

/**
 * DR-036: the browser used to keep one shared cache, and hydrating pushed it
 * into whoever signed in next, so account A's reviews landed in account B's
 * server records. Each owner now has its own cache and every write names it.
 */
describe("owner isolation", () => {
  it("hydrating B pushes none of A's cached reviews", async () => {
    store.set("kanji.日", { phraseId: "kanji.日", box: 1, dueAt: 100, lastSeenAt: 50 });
    fetchContentProgress.mockResolvedValue([]);

    const got = await hydrateFromServer("user-b");

    expect(got).toEqual([]);
    expect(fetchContentProgress).toHaveBeenCalledWith("user-b");
    expect(saveContentProgress).not.toHaveBeenCalled();
    expect(cacheOf("user-b").size).toBe(0);
  });

  it("B's server state lands in B's cache, never A's", async () => {
    fetchContentProgress.mockResolvedValue([{ contentId: "b-only", box: 2, dueAt: 9, lastSeenAt: 8 }]);

    await hydrateFromServer("user-b");

    expect(cacheOf("user-b").has("b-only")).toBe(true);
    expect(store.has("b-only")).toBe(false);
  });

  it("a guest never reads or adopts an account's cache", async () => {
    store.set("a", { phraseId: "a", box: 3, dueAt: 100, lastSeenAt: 50 });
    expect(await hydrateFromServer("guest")).toEqual([]);
  });

  it("a write that finishes after a switch still belongs to its owner", async () => {
    // The owner is bound when the review is recorded, not read from whoever is
    // signed in when the write lands.
    await recordRating(USER, "late", "got-it");

    expect(store.has("late")).toBe(true);
    expect(cacheOf("user-b").has("late")).toBe(false);
    expect(saveContentProgress).toHaveBeenCalledWith(USER, [expect.objectContaining({ contentId: "late" })]);
  });
});
