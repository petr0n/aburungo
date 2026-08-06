import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewState } from "@/types";

const store = new Map<string, ReviewState>();

vi.mock("./dexie", () => ({
  db: {
    reviewStates: {
      toArray: () => Promise.resolve([...store.values()]),
      get: (id: string) => Promise.resolve(store.get(id)),
      put: (v: ReviewState) => {
        store.set(v.phraseId, v);
        return Promise.resolve();
      },
    },
  },
}));

const fetchContentProgress = vi.fn();
const saveContentProgress = vi.fn();

vi.mock("@/api/progress", () => ({
  fetchContentProgress: () => fetchContentProgress(),
  saveContentProgress: (e: unknown) => saveContentProgress(e),
}));

const { hydrateFromServer, upsertSynced } = await import("./reviewStore");

beforeEach(() => {
  store.clear();
  fetchContentProgress.mockReset();
  saveContentProgress.mockReset();
  saveContentProgress.mockResolvedValue(undefined);
});

describe("guest", () => {
  it("never contacts the server", async () => {
    store.set("a", { phraseId: "a", box: 2, dueAt: 100, lastSeenAt: 50 });
    const got = await hydrateFromServer(false);
    expect(got).toHaveLength(1);
    expect(fetchContentProgress).not.toHaveBeenCalled();

    await upsertSynced({ phraseId: "b", box: 1, dueAt: 200 }, false);
    expect(saveContentProgress).not.toHaveBeenCalled();
  });
});

describe("signed in — merge", () => {
  it("takes the server's version when it is newer", async () => {
    store.set("a", { phraseId: "a", box: 1, dueAt: 100, lastSeenAt: 50 });
    fetchContentProgress.mockResolvedValue([
      { contentId: "a", box: 4, dueAt: 900, lastSeenAt: 500 },
    ]);

    const got = await hydrateFromServer(true);

    expect(got.find((s) => s.phraseId === "a")?.box).toBe(4);
  });

  it("keeps the local version when it is newer, and pushes it", async () => {
    store.set("a", { phraseId: "a", box: 5, dueAt: 900, lastSeenAt: 800 });
    fetchContentProgress.mockResolvedValue([
      { contentId: "a", box: 2, dueAt: 200, lastSeenAt: 100 },
    ]);

    const got = await hydrateFromServer(true);

    expect(got.find((s) => s.phraseId === "a")?.box).toBe(5);
    expect(saveContentProgress).toHaveBeenCalledWith([
      expect.objectContaining({ contentId: "a", box: 5 }),
    ]);
  });

  it("hydrates a second device whose cache is empty", async () => {
    fetchContentProgress.mockResolvedValue([
      { contentId: "a", box: 3, dueAt: 300, lastSeenAt: 200 },
    ]);

    const got = await hydrateFromServer(true);

    expect(got).toHaveLength(1);
    expect(store.get("a")?.box).toBe(3);
    expect(saveContentProgress).not.toHaveBeenCalled();
  });

  it("pushes local-only state the server has never seen", async () => {
    store.set("a", { phraseId: "a", box: 2, dueAt: 100, lastSeenAt: 50 });
    fetchContentProgress.mockResolvedValue([]);

    await hydrateFromServer(true);

    expect(saveContentProgress).toHaveBeenCalledWith([
      expect.objectContaining({ contentId: "a" }),
    ]);
  });

  it("falls back to cache when the server is unreachable", async () => {
    store.set("a", { phraseId: "a", box: 2, dueAt: 100 });
    fetchContentProgress.mockRejectedValue(new Error("offline"));

    const got = await hydrateFromServer(true);

    expect(got).toHaveLength(1);
  });
});

describe("signed in — writes", () => {
  it("writes locally and sends to the server", async () => {
    await upsertSynced({ phraseId: "a", box: 3, dueAt: 400, lastSeenAt: 300 }, true);

    expect(store.get("a")?.box).toBe(3);
    expect(saveContentProgress).toHaveBeenCalledWith([
      expect.objectContaining({ contentId: "a", box: 3, lastSeenAt: 300 }),
    ]);
  });

  it("does not interrupt a lesson when the send fails", async () => {
    saveContentProgress.mockRejectedValue(new Error("500"));

    await expect(upsertSynced({ phraseId: "a", box: 1, dueAt: 10 }, true)).resolves.toBeUndefined();
    // Kept locally, so the next hydrate pushes it.
    expect(store.get("a")).toBeDefined();
  });
});
