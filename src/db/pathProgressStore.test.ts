import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PathProgress } from "@/types";

const caches = new Map<string, Map<string, PathProgress>>();
function cacheOf(owner: string): Map<string, PathProgress> {
  let c = caches.get(owner);
  if (c === undefined) {
    c = new Map();
    caches.set(owner, c);
  }
  return c;
}

vi.mock("./dexie", () => ({
  dbFor: (owner: string) => ({
    pathProgress: {
      get: (id: string) => Promise.resolve(cacheOf(owner).get(id)),
      put: (v: PathProgress) => {
        cacheOf(owner).set(v.pathId, v);
        return Promise.resolve();
      },
    },
  }),
}));

const fetchPathProgress = vi.fn();
const markLessonSeenRemote = vi.fn();

vi.mock("@/api/progress", () => ({
  fetchPathProgress: (...a: unknown[]) => fetchPathProgress(...a),
  markLessonSeenRemote: (...a: unknown[]) => markLessonSeenRemote(...a),
}));

const { getPathProgress, markLessonSeen } = await import("./pathProgressStore");

const USER = "user-a";
const GUEST = "guest";

beforeEach(() => {
  caches.forEach((c) => c.clear());
  fetchPathProgress.mockReset();
  markLessonSeenRemote.mockReset();
  markLessonSeenRemote.mockResolvedValue({ pathId: "n5", seenLessonIds: [] });
});

describe("guest (local only)", () => {
  it("never touches the server", async () => {
    cacheOf(GUEST).set("n5", { pathId: "n5", seenLessonIds: ["u1"] });
    const got = await getPathProgress(GUEST, "n5");
    expect(got.seenLessonIds).toEqual(["u1"]);
    expect(fetchPathProgress).not.toHaveBeenCalled();
  });

  it("records a lesson locally without posting", async () => {
    await markLessonSeen(GUEST, "n5", "u1");
    expect(cacheOf(GUEST).get("n5")?.seenLessonIds).toEqual(["u1"]);
    expect(markLessonSeenRemote).not.toHaveBeenCalled();
  });
});

describe("signed in", () => {
  it("unions server and local sets", async () => {
    cacheOf(USER).set("n5", { pathId: "n5", seenLessonIds: ["u1", "u2"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: ["u2", "u3"] });

    const got = await getPathProgress(USER, "n5");

    expect([...got.seenLessonIds].sort()).toEqual(["u1", "u2", "u3"]);
  });

  it("pushes local-only lessons the server is missing", async () => {
    // A write that failed earlier for this same account.
    cacheOf(USER).set("n5", { pathId: "n5", seenLessonIds: ["u1", "u2"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: ["u1"] });

    await getPathProgress(USER, "n5");

    expect(markLessonSeenRemote).toHaveBeenCalledTimes(1);
    expect(markLessonSeenRemote).toHaveBeenCalledWith(USER, "n5", "u2");
  });

  it("hydrates a second device whose cache is empty", async () => {
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: ["u1", "u2"] });

    const got = await getPathProgress(USER, "n5");

    expect(got.seenLessonIds).toEqual(["u1", "u2"]);
    expect(cacheOf(USER).get("n5")?.seenLessonIds).toEqual(["u1", "u2"]);
    expect(markLessonSeenRemote).not.toHaveBeenCalled();
  });

  it("falls back to cache when the server is unreachable", async () => {
    cacheOf(USER).set("n5", { pathId: "n5", seenLessonIds: ["u1"] });
    fetchPathProgress.mockRejectedValue(new Error("offline"));

    const got = await getPathProgress(USER, "n5");

    expect(got.seenLessonIds).toEqual(["u1"]);
  });

  it("does not break the session when a write fails mid-lesson", async () => {
    markLessonSeenRemote.mockRejectedValue(new Error("500"));

    await expect(markLessonSeen(USER, "n5", "u1")).resolves.toBeDefined();
    // Kept locally, so the next load's union pushes it to the server.
    expect(cacheOf(USER).get("n5")?.seenLessonIds).toEqual(["u1"]);
  });

  it("is idempotent for a lesson already seen", async () => {
    cacheOf(USER).set("n5", { pathId: "n5", seenLessonIds: ["u1"] });
    await markLessonSeen(USER, "n5", "u1");
    expect(markLessonSeenRemote).not.toHaveBeenCalled();
  });
});

/**
 * The rename boundary (DR-024).
 *
 * Rows cached before lessons were called lessons hold `seenUnitIds`. Reading
 * only the new name off one of those yields undefined, which reads as "no
 * progress" and sends the learner back to lesson 1. It typechecks perfectly,
 * because a stored value never passed through TypeScript.
 */
describe("cached rows written before the rename", () => {
  it("reads a legacy seenUnitIds row rather than losing the learner's place", async () => {
    cacheOf(GUEST).set("n5", { pathId: "n5", seenUnitIds: ["n5.unit-1", "n5.unit-2"] } as unknown as PathProgress);
    expect((await getPathProgress(GUEST, "n5")).seenLessonIds).toEqual(["n5.unit-1", "n5.unit-2"]);
  });

  it("prefers the new field once a row has been rewritten", async () => {
    cacheOf(GUEST).set("n5", { pathId: "n5", seenLessonIds: ["n5.unit-3"], seenUnitIds: ["stale"] } as unknown as PathProgress);
    expect((await getPathProgress(GUEST, "n5")).seenLessonIds).toEqual(["n5.unit-3"]);
  });

  it("normalises the row on the next write", async () => {
    cacheOf(GUEST).set("n5", { pathId: "n5", seenUnitIds: ["n5.unit-1"] } as unknown as PathProgress);
    await markLessonSeen(GUEST, "n5", "n5.unit-2");
    expect(cacheOf(GUEST).get("n5")).toEqual({ pathId: "n5", seenLessonIds: ["n5.unit-1", "n5.unit-2"] });
  });

  it("does not re-add a lesson already seen under the legacy field", async () => {
    cacheOf(GUEST).set("n5", { pathId: "n5", seenUnitIds: ["n5.unit-1"] } as unknown as PathProgress);
    await markLessonSeen(GUEST, "n5", "n5.unit-1");
    expect(cacheOf(GUEST).get("n5")).toEqual({ pathId: "n5", seenUnitIds: ["n5.unit-1"] });
  });
});

/** DR-036: path progress is scoped like review state. */
describe("owner isolation", () => {
  it("B's load neither reads nor pushes A's seen lessons", async () => {
    cacheOf(USER).set("n5", { pathId: "n5", seenLessonIds: ["n5.a-only"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: [] });

    const got = await getPathProgress("user-b", "n5");

    expect(got.seenLessonIds).toEqual([]);
    expect(markLessonSeenRemote).not.toHaveBeenCalled();
  });

  it("signing in does not merge guest lessons into the account", async () => {
    cacheOf(GUEST).set("n5", { pathId: "n5", seenLessonIds: ["n5.guest"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: [] });

    expect((await getPathProgress(USER, "n5")).seenLessonIds).toEqual([]);
    expect(markLessonSeenRemote).not.toHaveBeenCalled();
  });

  it("a lesson marked for A is sent as A and cached under A", async () => {
    await markLessonSeen(USER, "n5", "n5.x");

    expect(markLessonSeenRemote).toHaveBeenCalledWith(USER, "n5", "n5.x");
    expect(cacheOf(USER).get("n5")?.seenLessonIds).toEqual(["n5.x"]);
    expect(cacheOf("user-b").size).toBe(0);
  });
});
