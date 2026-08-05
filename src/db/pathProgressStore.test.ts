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
const markUnitSeenRemote = vi.fn();

vi.mock("@/api/progress", () => ({
  fetchPathProgress: (...a: unknown[]) => fetchPathProgress(...a),
  markUnitSeenRemote: (...a: unknown[]) => markUnitSeenRemote(...a),
}));

const { getPathProgress, markUnitSeen } = await import("./pathProgressStore");

beforeEach(() => {
  store.clear();
  fetchPathProgress.mockReset();
  markUnitSeenRemote.mockReset();
  markUnitSeenRemote.mockResolvedValue({ pathId: "n5", seenUnitIds: [] });
});

describe("guest (local only)", () => {
  it("never touches the server", async () => {
    store.set("n5", { pathId: "n5", seenUnitIds: ["u1"] });
    const got = await getPathProgress("n5");
    expect(got.seenUnitIds).toEqual(["u1"]);
    expect(fetchPathProgress).not.toHaveBeenCalled();
  });

  it("records a unit locally without posting", async () => {
    await markUnitSeen("n5", "u1");
    expect(store.get("n5")?.seenUnitIds).toEqual(["u1"]);
    expect(markUnitSeenRemote).not.toHaveBeenCalled();
  });
});

describe("signed in", () => {
  it("unions server and local sets", async () => {
    store.set("n5", { pathId: "n5", seenUnitIds: ["u1", "u2"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenUnitIds: ["u2", "u3"] });

    const got = await getPathProgress("n5", true);

    expect([...got.seenUnitIds].sort()).toEqual(["u1", "u2", "u3"]);
  });

  it("pushes local-only units the server is missing", async () => {
    // Guest progress migrating on first sign-in, or a write that failed earlier.
    store.set("n5", { pathId: "n5", seenUnitIds: ["u1", "u2"] });
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenUnitIds: ["u1"] });

    await getPathProgress("n5", true);

    expect(markUnitSeenRemote).toHaveBeenCalledTimes(1);
    expect(markUnitSeenRemote).toHaveBeenCalledWith("n5", "u2");
  });

  it("hydrates a second device whose cache is empty", async () => {
    fetchPathProgress.mockResolvedValue({ pathId: "n5", seenUnitIds: ["u1", "u2"] });

    const got = await getPathProgress("n5", true);

    expect(got.seenUnitIds).toEqual(["u1", "u2"]);
    expect(store.get("n5")?.seenUnitIds).toEqual(["u1", "u2"]);
    expect(markUnitSeenRemote).not.toHaveBeenCalled();
  });

  it("falls back to cache when the server is unreachable", async () => {
    store.set("n5", { pathId: "n5", seenUnitIds: ["u1"] });
    fetchPathProgress.mockRejectedValue(new Error("offline"));

    const got = await getPathProgress("n5", true);

    expect(got.seenUnitIds).toEqual(["u1"]);
  });

  it("does not break the session when a write fails mid-lesson", async () => {
    markUnitSeenRemote.mockRejectedValue(new Error("500"));

    await expect(markUnitSeen("n5", "u1", true)).resolves.toBeDefined();
    // Kept locally, so the next load's union pushes it to the server.
    expect(store.get("n5")?.seenUnitIds).toEqual(["u1"]);
  });

  it("is idempotent for a unit already seen", async () => {
    store.set("n5", { pathId: "n5", seenUnitIds: ["u1"] });
    await markUnitSeen("n5", "u1", true);
    expect(markUnitSeenRemote).not.toHaveBeenCalled();
  });
});
