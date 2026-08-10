import { useState, useEffect, useRef } from "react";
import { streamMessage } from "@/api/conversation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
};

type Props = {
  /** An already-created session. The caller owns creation, because it owns the scope. */
  sessionId: string;
  /** Shown in the header, e.g. "Hana · N5" or the situation being practised. */
  title: string;
  /** Back out. Always available — a conversation must never be a trap. */
  onEnd: () => void;
  endLabel?: string;
  /**
   * Learner turns after which `onFinish` becomes available. The prompt already
   * asks Hana to wind down around the same point; this is the matching
   * affordance on screen, not an enforced cut-off.
   */
  turnLimit?: number;
  onFinish?: () => void;
  finishLabel?: string;
};

/**
 * The Hana chat surface, shared by free-roam conversation and the two terminal
 * checkpoints (DR-022).
 *
 * Presentation plus streaming only: it does not create sessions, choose scopes,
 * or decide what a finished conversation means. Those differ per caller, which
 * is exactly why they are not in here.
 */
export function HanaChat({ sessionId, title, onEnd, endLabel = "← End", turnLimit, onFinish, finishLabel = "Finish" }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optional call: jsdom does not implement scrollIntoView, and auto-scrolling
    // is a nicety — it must never take the conversation down with it.
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  const learnerTurns = messages.filter((m) => m.role === "user").length;
  const canFinish = onFinish !== undefined && turnLimit !== undefined && learnerTurns >= turnLimit;

  async function handleSend() {
    if (!input.trim() || sending) return;

    const text = input.trim();
    setInput("");
    setSending(true);

    const userMsgId = `u-${Date.now()}`;
    const assistantMsgId = `a-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: text, streaming: false },
      { id: assistantMsgId, role: "assistant", content: "", streaming: true },
    ]);

    try {
      for await (const chunk of streamMessage(sessionId, text)) {
        setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m)));
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId && m.content === "" ? { ...m, content: "…", streaming: false } : m)),
      );
    } finally {
      setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, streaming: false } : m)));
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between py-3">
        <button
          type="button"
          onClick={onEnd}
          className="flex min-h-[44px] items-center text-body-sm text-fg-subtle active:text-fg"
        >
          {endLabel}
        </button>
        <p className="text-heading-sm font-semibold text-fg">{title}</p>
        <div className="w-16" />
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-2">
        {messages.length === 0 && (
          <p className="text-center text-body-sm text-fg-faint">Say something to start the conversation.</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={["flex", msg.role === "user" ? "justify-end" : "justify-start"].join(" ")}>
            <div
              className={[
                "max-w-[80%] rounded-2xl px-4 py-3 text-body leading-relaxed",
                msg.role === "user" ? "bg-brand-600 text-white" : "border border-border bg-surface text-fg",
              ].join(" ")}
              style={msg.role === "assistant" ? { fontFamily: "var(--font-jp)" } : undefined}
            >
              {msg.content}
              {msg.streaming && <span className="ml-0.5 animate-pulse">▋</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {canFinish && (
        <button
          type="button"
          onClick={onFinish}
          className="mb-2 flex min-h-[52px] w-full shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
        >
          {finishLabel}
        </button>
      )}

      <div className="flex shrink-0 gap-2 py-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          placeholder="Type a message…"
          className="flex min-h-[48px] flex-1 rounded-2xl border border-border bg-surface px-4 text-body text-fg placeholder:text-fg-faint focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={sending || !input.trim()}
          className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl bg-brand-600 text-white active:bg-brand-700 disabled:opacity-40"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
