import { apiFetch, apiStreamText } from "./client";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

/** Mirrors the server's scope contract in server/src/services/conversationPrompt.ts. */
export type ConversationScope = {
  situation: string;
  canDo: string;
  words: Array<{ japanese: string; reading: string; english: string }>;
  maxTurns: number;
};

/**
 * Open a conversation. Passing a `scope` constrains Hana to one unit's
 * situation and vocabulary for a few turns, instead of open-ended chat.
 */
export async function createSession(
  jlpt: JlptLevel,
  scope?: ConversationScope,
): Promise<{ sessionId: string }> {
  return apiFetch("/api/conversation/session", {
    method: "POST",
    body: JSON.stringify(scope === undefined ? { jlpt } : { jlpt, scope }),
  });
}

export async function* streamMessage(sessionId: string, message: string): AsyncGenerator<string> {
  yield* apiStreamText("/api/conversation/message", {
    method: "POST",
    body: JSON.stringify({ sessionId, message }),
  });
}
