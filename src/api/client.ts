import { supabase } from "@/lib/supabase";
import type { Owner } from "@/types";

const API_BASE = import.meta.env.VITE_API_URL as string;

if (!API_BASE) {
  throw new Error("Missing env var: VITE_API_URL");
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * The bearer token to send, checked against the learner the request is for.
 *
 * DR-036: a request for learner state names its owner when it is started, and
 * the session is read only when it is actually sent. If the account changed in
 * between -- sign-out, another account, another tab -- the request is refused
 * rather than sent with someone else's token. A guest owner never matches, so
 * guest progress cannot reach the server.
 */
async function tokenFor(owner: Owner | undefined): Promise<string | undefined> {
  const { data } = await supabase.auth.getSession();
  if (owner !== undefined && data.session?.user.id !== owner) {
    throw new ApiError(401, "Signed-in account changed; request not sent");
  }
  return data.session?.access_token;
}

export async function* apiStreamText(path: string, init: RequestInit = {}): AsyncGenerator<string> {
  const token = await tokenFor(undefined);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || res.statusText);
  }

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, owner?: Owner): Promise<T> {
  const token = await tokenFor(owner);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || res.statusText);
  }

  return res.json() as Promise<T>;
}
