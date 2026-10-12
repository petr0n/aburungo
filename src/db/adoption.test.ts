import { beforeEach, describe, expect, it, vi } from "vitest";
import type { KanaProgressEntry, PathProgress, ReviewState } from "@/types";

type Row = ReviewState | PathProgress;
const dbs = new Map<string, { reviewStates: Map<string, ReviewState>; pathProgress: Map<string, PathProgress> }>();
function raw(name: string) {
  let d = dbs.get(name);
  if (d === undefined) {
    d = { reviewStates: new Map(), pathProgress: new Map() };
    dbs.set(name, d);
  }
  return d;
}
function table<T extends Row>(rows: Map<string, T>, key: (r: T) => string) {
  return {
    toArray: () => Promise.resolve([...rows.values()]),
    count: () => Promise.resolve(rows.size),
    bulkPut: (vs: T[]) => {
      vs.forEach((v) => rows.set(key(v), v));
      return Promise.resolve();
    },
    clear: () => {
      rows.clear();
      return Promise.resolve();
    },
  };
}
function fakeDb(name: string) {
  const d = raw(name);
  return {
    reviewStates: table(d.reviewStates, (r) => r.phraseId),
    pathProgress: table(d.pathProgress, (r) => r.pathId),
  };
}

// Node's own global localStorage shadows jsdom's and is unusable without a
// backing file, so the tests bring a plain in-memory one.
const mem = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => void mem.set(k, String(v)),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
});

vi.mock("./dexie", () => ({
  dbFor: (owner: string) => fakeDb(owner),
  legacyDb: () => Promise.resolve(dbs.has("legacy") ? fakeDb("legacy") : null),
}));

const submitKanaAnswer = vi.fn<(owner: string, ...rest: unknown[]) => Promise<unknown>>();
vi.mock("@/api/progress", () => ({
  submitKanaAnswer: (owner: string, ...rest: unknown[]) => submitKanaAnswer(owner, ...rest),
}));

const { adoptionOffer, bringIn, keepSeparate, resumeGuestImport } = await import("./adoption");
const { readGuestKana, writeGuestKana } = await import("./kanaLocal");

const kana = (character: string, recognizedCount: number): KanaProgressEntry => ({
  character,
  script: "hiragana",
  recognizedCount,
  recalledCount: 0,
  lastSeenAt: null,
});

beforeEach(() => {
  dbs.clear();
  localStorage.clear();
  submitKanaAnswer.mockReset();
  submitKanaAnswer.mockResolvedValue({});
});

describe("guest adoption (DR-036)", () => {
  it("offers nothing when the guest has no progress", async () => {
    expect(await adoptionOffer("user-a")).toBeNull();
  });

  it("offers guest progress to an account, never to the guest itself", async () => {
    raw("guest").reviewStates.set("w1", { phraseId: "w1", box: 1, dueAt: 1 });
    expect(await adoptionOffer("user-a")).toBe("guest");
    expect(await adoptionOffer("guest")).toBeNull();
  });

  it("does not move anything on its own: only bringIn does", async () => {
    raw("guest").reviewStates.set("w1", { phraseId: "w1", box: 1, dueAt: 1 });
    await adoptionOffer("user-a");
    expect(raw("user-a").reviewStates.size).toBe(0);
  });

  it("keeping it separate leaves both histories and stops asking", async () => {
    raw("guest").reviewStates.set("w1", { phraseId: "w1", box: 1, dueAt: 1 });
    keepSeparate("guest", "user-a");
    expect(await adoptionOffer("user-a")).toBeNull();
    expect(raw("guest").reviewStates.has("w1")).toBe(true);
    expect(raw("user-a").reviewStates.size).toBe(0);
    // Another account is still asked: A's choice is A's.
    expect(await adoptionOffer("user-b")).toBe("guest");
  });

  it("bringing it in moves reviews, lessons and kana to the account, then retires the guest copy", async () => {
    raw("guest").reviewStates.set("w1", { phraseId: "w1", box: 2, dueAt: 5, lastSeenAt: 9 });
    raw("guest").pathProgress.set("n5", { pathId: "n5", seenLessonIds: ["l1"] });
    raw("user-a").pathProgress.set("n5", { pathId: "n5", seenLessonIds: ["l0"] });
    writeGuestKana([kana("あ", 2)]);

    await bringIn("guest", "user-a");

    expect(raw("user-a").reviewStates.get("w1")?.box).toBe(2);
    expect(raw("user-a").pathProgress.get("n5")?.seenLessonIds.sort()).toEqual(["l0", "l1"]);
    expect(submitKanaAnswer).toHaveBeenCalledTimes(2);
    expect(submitKanaAnswer.mock.calls.every((c) => c[0] === "user-a")).toBe(true);
    expect(raw("guest").reviewStates.size).toBe(0);
    expect(readGuestKana()).toEqual([]);
    // Adopted progress is not offered again, to A or anyone else.
    expect(await adoptionOffer("user-b")).toBeNull();
  });

  it("keeps the account's newer review over the guest's older one", async () => {
    raw("guest").reviewStates.set("w1", { phraseId: "w1", box: 1, dueAt: 5, lastSeenAt: 1 });
    raw("user-a").reviewStates.set("w1", { phraseId: "w1", box: 4, dueAt: 50, lastSeenAt: 10 });
    await bringIn("guest", "user-a");
    expect(raw("user-a").reviewStates.get("w1")?.box).toBe(4);
  });

  it("an interrupted import resumes for its original destination without repeating kana", async () => {
    writeGuestKana([kana("あ", 3)]);
    raw("guest").reviewStates.set("w1", { phraseId: "w1", box: 1, dueAt: 1 });
    submitKanaAnswer.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("offline"));

    await bringIn("guest", "user-a");

    // One answer landed; the guest copy still holds the other two and the reviews.
    expect(readGuestKana()[0]?.recognizedCount).toBe(2);
    expect(raw("guest").reviewStates.size).toBe(1);
    // B signs in meanwhile: B is neither offered A's import nor made its destination.
    expect(await adoptionOffer("user-b")).toBeNull();
    await resumeGuestImport("user-b");
    expect(submitKanaAnswer.mock.calls.filter((c) => c[0] === "user-b")).toHaveLength(0);

    submitKanaAnswer.mockReset();
    submitKanaAnswer.mockResolvedValue({});
    await resumeGuestImport("user-a");

    expect(submitKanaAnswer).toHaveBeenCalledTimes(2);
    expect(readGuestKana()).toEqual([]);
    expect(raw("guest").reviewStates.size).toBe(0);
  });
});

describe("legacy shared database (DR-036)", () => {
  it("is offered for explicit recovery but never loaded on its own", async () => {
    raw("legacy").reviewStates.set("old", { phraseId: "old", box: 3, dueAt: 1, lastSeenAt: 1 });
    expect(await adoptionOffer("user-a")).toBe("legacy");
    expect(raw("user-a").reviewStates.size).toBe(0);
  });

  it("recovery copies into the chosen owner and leaves the legacy data in place", async () => {
    raw("legacy").reviewStates.set("old", { phraseId: "old", box: 3, dueAt: 1, lastSeenAt: 1 });
    raw("legacy").pathProgress.set("n5", { pathId: "n5", seenUnitIds: ["n5.unit-1"] } as unknown as PathProgress);

    await bringIn("legacy", "user-a");

    expect(raw("user-a").reviewStates.get("old")?.box).toBe(3);
    expect(raw("user-a").pathProgress.get("n5")?.seenLessonIds).toEqual(["n5.unit-1"]);
    expect(raw("legacy").reviewStates.has("old")).toBe(true);
    expect(await adoptionOffer("user-a")).toBeNull();
    expect(await adoptionOffer("user-b")).toBe("legacy");
  });

  it("declining leaves it untouched", async () => {
    raw("legacy").reviewStates.set("old", { phraseId: "old", box: 3, dueAt: 1 });
    keepSeparate("legacy", "user-a");
    expect(await adoptionOffer("user-a")).toBeNull();
    expect(raw("legacy").reviewStates.has("old")).toBe(true);
  });
});
