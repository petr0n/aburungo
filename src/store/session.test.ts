import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Phrase, ReviewState } from "@/types";

const h = vi.hoisted(() => ({
  getAll: vi.fn<(owner: string) => Promise<ReviewState[]>>(),
  upsert: vi.fn<(owner: string, s: ReviewState) => Promise<void>>(() => Promise.resolve()),
}));
vi.mock("@/db/reviewStore", () => ({
  getAll: (o: string) => h.getAll(o),
  getOne: () => Promise.resolve(undefined),
  upsert: (o: string, s: ReviewState) => h.upsert(o, s),
}));
vi.mock("@/api/vocabulary", () => ({ fetchVocabulary: () => Promise.resolve([]) }));
vi.mock("@/api/progress", () => ({ submitReview: vi.fn(), fetchDue: vi.fn() }));
vi.mock("@/store/progress", () => ({ useProgress: { getState: () => ({ loadStats: vi.fn() }) } }));

const { useSession } = await import("./session");

const phrase = { id: "p1", japanese: "みず" } as Phrase;

beforeEach(() => {
  h.getAll.mockReset();
  h.upsert.mockClear();
  useSession.getState().reset();
});

/** DR-036: a session belongs to the owner it was built for. */
describe("session ownership", () => {
  it("a build for A that finishes after an identity change is discarded", async () => {
    let finish!: (v: ReviewState[]) => void;
    h.getAll.mockReturnValueOnce(new Promise((r) => (finish = r)));
    const building = useSession.getState().initialize([phrase], "user-a");

    useSession.getState().reset(); // what the auth store does on a switch
    finish([]);
    await building;

    expect(useSession.getState().status).toBe("idle");
    expect(useSession.getState().queue).toEqual([]);
  });

  it("ratings are written for the session's own owner", async () => {
    h.getAll.mockResolvedValue([]);
    await useSession.getState().initialize([phrase], "user-a");
    await useSession.getState().rate("got-it");
    expect(h.upsert).toHaveBeenCalledWith("user-a", expect.objectContaining({ phraseId: "p1" }));
  });
});
