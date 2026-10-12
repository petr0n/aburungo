import { beforeEach, describe, expect, it, vi } from "vitest";
import type { KanaProgressEntry } from "@/types";

const api = vi.hoisted(() => ({
  fetchStats: vi.fn(),
  fetchKanaProgress: vi.fn(),
  submitKanaAnswer: vi.fn(),
  resetKanaProgress: vi.fn(),
}));
// Node's own global localStorage shadows jsdom's and is unusable without a
// backing file, so the tests bring a plain in-memory one.
const mem = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => void mem.set(k, String(v)),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
});

vi.mock("@/api/progress", () => api);

const { useProgress } = await import("./progress");

const entry = (character: string, recognizedCount = 1): KanaProgressEntry => ({
  character,
  script: "hiragana",
  recognizedCount,
  recalledCount: 0,
  lastSeenAt: null,
});

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

beforeEach(() => {
  localStorage.clear();
  Object.values(api).forEach((f) => f.mockReset());
  useProgress.getState().resetFor("guest");
});

/** DR-036: kana and stats follow the same ownership boundary as reviews. */
describe("kana ownership", () => {
  it("a late kana load for A does not show in B's session", async () => {
    const late = deferred<KanaProgressEntry[]>();
    api.fetchKanaProgress.mockReturnValueOnce(late.promise);
    useProgress.getState().resetFor("user-a");
    const loading = useProgress.getState().loadKana("user-a");

    useProgress.getState().resetFor("user-b");
    late.resolve([entry("あ")]);
    await loading;

    expect(useProgress.getState().kanaProgress).toEqual([]);
  });

  it("a late kana answer for A is not written into B's state", async () => {
    const late = deferred<KanaProgressEntry>();
    api.submitKanaAnswer.mockReturnValueOnce(late.promise);
    useProgress.getState().resetFor("user-a");
    await useProgress.getState().recordKanaAnswer("user-a", "あ", "hiragana", "recognized", true);
    expect(api.submitKanaAnswer).toHaveBeenCalledWith("user-a", "あ", "hiragana", "recognized", true);

    useProgress.getState().resetFor("user-b");
    late.resolve(entry("あ", 5));
    await late.promise;
    await Promise.resolve();

    expect(useProgress.getState().kanaProgress).toEqual([]);
  });

  it("signing in does not upload or clear guest kana", async () => {
    useProgress.getState().resetFor("guest");
    await useProgress.getState().recordKanaAnswer("guest", "あ", "hiragana", "recognized", true);
    api.fetchKanaProgress.mockResolvedValue([]);

    useProgress.getState().resetFor("user-a");
    await useProgress.getState().loadKana("user-a");

    expect(api.submitKanaAnswer).not.toHaveBeenCalled();
    useProgress.getState().resetFor("guest");
    await useProgress.getState().loadKana("guest");
    expect(useProgress.getState().kanaProgress.map((e) => e.character)).toEqual(["あ"]);
  });

  it("an account whose kana cannot load shows nothing rather than guest kana", async () => {
    useProgress.getState().resetFor("guest");
    await useProgress.getState().recordKanaAnswer("guest", "あ", "hiragana", "recognized", true);
    api.fetchKanaProgress.mockRejectedValue(new Error("offline"));

    useProgress.getState().resetFor("user-a");
    await useProgress.getState().loadKana("user-a");

    expect(useProgress.getState().kanaProgress).toEqual([]);
  });

  it("pre-DR-036 kana is guest kana -- only guests ever wrote it", async () => {
    localStorage.setItem("aburungo:kana_progress", JSON.stringify([entry("い")]));
    await useProgress.getState().loadKana("guest");
    expect(useProgress.getState().kanaProgress.map((e) => e.character)).toEqual(["い"]);
  });

  it("a late stats load for A is dropped once B is active", async () => {
    const late = deferred<unknown>();
    api.fetchStats.mockReturnValueOnce(late.promise);
    useProgress.getState().resetFor("user-a");
    const loading = useProgress.getState().loadStats("user-a");

    useProgress.getState().resetFor("user-b");
    late.resolve({ totalReviewed: 9 });
    await loading;

    expect(useProgress.getState().stats).toBeNull();
  });
});
