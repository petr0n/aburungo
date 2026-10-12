import { beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (event: string, session: { user: { id: string } } | null) => void;
const h = vi.hoisted(() => ({
  listener: null as Listener | null,
  initial: null as { user: { id: string } } | null,
  resetFor: vi.fn(),
  resetSession: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: h.initial } }),
      onAuthStateChange: (cb: Listener) => {
        h.listener = cb;
      },
      signOut: () => Promise.resolve({ error: null }),
    },
  },
}));
vi.mock("@/store/progress", () => ({ useProgress: { getState: () => ({ resetFor: h.resetFor }) } }));
vi.mock("@/store/session", () => ({ useSession: { getState: () => ({ reset: h.resetSession }) } }));

const { useAuth } = await import("./auth");

const fire = (event: string, id: string | null) => h.listener?.(event, id === null ? null : { user: { id } });

beforeEach(() => {
  h.resetFor.mockClear();
  h.resetSession.mockClear();
});

/** DR-036 transition rules, at the one place identity changes are observed. */
describe("owner transitions", () => {
  it("has no owner until the initial session is known", async () => {
    expect(useAuth.getState().owner).toBeNull();
    h.initial = { user: { id: "user-a" } };
    useAuth.getState().initialize();
    await vi.waitFor(() => expect(useAuth.getState().owner).toBe("user-a"));
    expect(h.resetFor).toHaveBeenLastCalledWith("user-a");
  });

  it("a token refresh for the same user resets nothing", () => {
    fire("SIGNED_IN", "user-a");
    h.resetFor.mockClear();
    h.resetSession.mockClear();
    fire("TOKEN_REFRESHED", "user-a");
    expect(h.resetFor).not.toHaveBeenCalled();
    expect(h.resetSession).not.toHaveBeenCalled();
  });

  it("switching account clears in-memory state and selects the new owner", () => {
    fire("SIGNED_IN", "user-a");
    fire("SIGNED_IN", "user-b");
    expect(h.resetFor).toHaveBeenLastCalledWith("user-b");
    expect(h.resetSession).toHaveBeenCalled();
    expect(useAuth.getState().owner).toBe("user-b");
  });

  it("signing out selects the guest, never keeping the account's state", async () => {
    fire("SIGNED_IN", "user-a");
    await useAuth.getState().signOut();
    expect(useAuth.getState().owner).toBe("guest");
    expect(h.resetFor).toHaveBeenLastCalledWith("guest");
  });

  it("clears before the new owner becomes visible", () => {
    fire("SIGNED_IN", "user-a");
    h.resetFor.mockImplementationOnce(() => expect(useAuth.getState().owner).toBe("user-a"));
    fire("SIGNED_IN", "user-b");
    expect(h.resetFor).toHaveBeenCalledWith("user-b");
  });
});
