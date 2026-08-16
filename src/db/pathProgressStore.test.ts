import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PathProgress } from "@/types";

const store = new Map<string, PathProgress>();

vi.mock("./dexie", () => ({
  db: {
    pathProgress: {
      get: (id: string) => Promise.resolve(store.get(id)),
      put: (v: PathProgress) => {
        store.set(v.pathId, v);
        return Promise.resolve();
      },
    },
  },
}));

const fetchPathProgress = vi.fn();
const markLessonSeenRemote = vi.fn();

vi.mock("@/api/progress", () => ({
  fetchPathProgress: (...a: unknown[]) => fetchPathProgress(...a),
  markLessonSeenRemote: (...a: unknown[]) => markLessonSeenRemote(...a),
}));

const { getPathProgress, markLessonSeen } = await import("./pathProgressStore");

beforeEach(() => {
  store.clear();
  fetchPathProgress.mockReset();
  markLessonSeenRemote.mockReset();
  markLessonSeenRemote.mockResolvedValue({ pathId: "n5", seenLessonIds: [] });
});

describe("guest (local only)", () => {
  it("never touches the server", async () => {
    store.set("n5", { pathId: "n5", seenLessonIds: ["u1"] });
    const got = await getPathProgress("n5");
    expect(got.seenLessonIds).toEqual(["u1"]);
    expect(fetchPathProgress).not.toHaveBeenCalled();
  });

  it("records a lesson locally without posting", async () => {
    await markLessonSeen("n5", "u1");
    expect(store.get("n5")?.seenLessonIds).toEqual(["u1"]);
    expect(markLessonSeenRemote).not.toHaveBeenCalled();
  });
});

describe("signed in", () => {
  it("unions server and local sets", async () => {
    store.set("n5", { pathId: "n5", seenLessonIds: ["u1", "u2"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: ["u2", "u3"] });

    const got = await getPathProgress("n5", true);

    expect([...got.seenLessonIds].sort()).toEqual(["u1", "u2", "u3"]);
  });

  it("pushes local-only lessons the server is missing", async () => {
    // Guest progress migrating on first sign-in, or a write that failed earlier.
    store.set("n5", { pathId: "n5", seenLessonIds: ["u1", "u2"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: ["u1"] });

    await getPathProgress("n5", true);

    expect(markLessonSeenRemote).toHaveBeenCalledTimes(1);
    expect(markLessonSeenRemote).toHaveBeenCalledWith("n5", "u2");
  });

  it("hydrates a second device whose cache is empty", async () => {
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenLessonIds: ["u1", "u2"] });

    const got = await getPathProgress("n5", true);

    expect(got.seenLessonIds).toEqual(["u1", "u2"]);
    expect(store.get("n5")?.seenLessonIds).toEqual(["u1", "u2"]);
    expect(markLessonSeenRemote).not.toHaveBeenCalled();
  });

  it("falls back to cache when the server is unreachable", async () => {
    store.set("n5", { pathId: "n5", seenLessonIds: ["u1"] });
    fetchPathProgress.mockRejectedValue(new Error("offline"));

    const got = await getPathProgress("n5", true);

    expect(got.seenLessonIds).toEqual(["u1"]);
  });

  it("does not break the session when a write fails mid-lesson", async () => {
    markLessonSeenRemote.mockRejectedValue(new Error("500"));

    await expect(markLessonSeen("n5", "u1", true)).resolves.toBeDefined();
    // Kept locally, so the next load's union pushes it to the server.
    expect(store.get("n5")?.seenLessonIds).toEqual(["u1"]);
  });

  it("is idempotent for a lesson already seen", async () => {
    store.set("n5", { pathId: "n5", seenLessonIds: ["u1"] });
    await markLessonSeen("n5", "u1", true);
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
    store.set("n5", { pathId: "n5", seenUnitIds: ["n5.unit-1", "n5.unit-2"] } as unknown as PathProgress);
    expect((await getPathProgress("n5", false)).seenLessonIds).toEqual(["n5.unit-1", "n5.unit-2"]);
  });

  it("prefers the new field once a row has been rewritten", async () => {
    store.set("n5", { pathId: "n5", seenLessonIds: ["n5.unit-3"], seenUnitIds: ["stale"] } as unknown as PathProgress);
    expect((await getPathProgress("n5", false)).seenLessonIds).toEqual(["n5.unit-3"]);
  });

  it("normalises the row on the next write", async () => {
    store.set("n5", { pathId: "n5", seenUnitIds: ["n5.unit-1"] } as unknown as PathProgress);
    await markLessonSeen("n5", "n5.unit-2", false);
    expect(store.get("n5")).toEqual({ pathId: "n5", seenLessonIds: ["n5.unit-1", "n5.unit-2"] });
  });

  it("does not re-add a lesson already seen under the legacy field", async () => {
    store.set("n5", { pathId: "n5", seenUnitIds: ["n5.unit-1"] } as unknown as PathProgress);
    await markLessonSeen("n5", "n5.unit-1", false);
    expect(store.get("n5")).toEqual({ pathId: "n5", seenUnitIds: ["n5.unit-1"] });
  });
});
