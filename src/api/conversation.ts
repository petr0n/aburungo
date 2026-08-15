import { apiFetch, apiStreamText } from "./client";
import type { ConversationScope } from "@/types";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type { ConversationScope };

/**
 * Open a conversation. Passing a `scope` constrains Hana to one lesson's
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

/**
 * Ask the assessor whether a finished session demonstrated a can-do.
 *
 * Sends only the session id — the server reads the transcript it already
 * stored. Nothing about the conversation is client-supplied, so there is
 * nothing here to forge.
 */
export async function assessCanDo(
  sessionId: string,
  canDo: string,
  situation: string,
): Promise<{ verified: boolean; note: string }> {
  return apiFetch("/api/conversation/assess", {
    method: "POST",
    body: JSON.stringify({ sessionId, canDo, situation }),
  });
}
