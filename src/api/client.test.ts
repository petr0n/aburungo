import { afterEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ current: null as { access_token: string; user: { id: string } } | null }));

vi.mock("@/lib/supabase", () => ({
  supabase: { auth: { getSession: () => Promise.resolve({ data: { session: session.current } }) } },
}));

const fetchMock = vi.fn(() => Promise.resolve(new Response("{}", { status: 200 })));
vi.stubGlobal("fetch", fetchMock);

const { apiFetch } = await import("./client");

afterEach(() => {
  fetchMock.mockClear();
  session.current = null;
});

/**
 * DR-036: a write queued for account A must never go out with B's token. The
 * owner is bound when the write starts; the token is checked against it when
 * the request is actually made.
 */
describe("apiFetch with an owner", () => {
  it("sends the owner's own token", async () => {
    session.current = { access_token: "tok-a", user: { id: "user-a" } };
    await apiFetch("/x", {}, "user-a");
    const init = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok-a");
  });

  it("refuses to send A's request once B is signed in", async () => {
    session.current = { access_token: "tok-b", user: { id: "user-b" } };
    await expect(apiFetch("/x", {}, "user-a")).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses to send A's request after sign-out", async () => {
    await expect(apiFetch("/x", {}, "user-a")).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never sends a guest's learner state to the server", async () => {
    session.current = { access_token: "tok-a", user: { id: "user-a" } };
    await expect(apiFetch("/x", {}, "guest")).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
