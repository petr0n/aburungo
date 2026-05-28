import { apiFetch, apiStreamText } from "./client";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export async function createSession(jlpt: JlptLevel): Promise<{ sessionId: string }> {
  return apiFetch("/api/conversation/session", {
    method: "POST",
    body: JSON.stringify({ jlpt }),
  });
}

export async function* streamMessage(sessionId: string, message: string): AsyncGenerator<string> {
  yield* apiStreamText("/api/conversation/message", {
    method: "POST",
    body: JSON.stringify({ sessionId, message }),
  });
}
