import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { createSession, streamMessage, type JlptLevel } from "@/api/conversation";
import { useAuth } from "@/store/auth";
import { PageShell } from "@/components/PageShell";

type Screen = "setup" | "chat";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
};

const JLPT_LEVELS: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export function ConversationPage() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [jlpt, setJlpt] = useState<JlptLevel>("N4");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleStart() {
    setStarting(true);
    try {
      const { sessionId: sid } = await createSession(jlpt);
      setSessionId(sid);
      setMessages([]);
      setScreen("chat");
    } finally {
      setStarting(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || !sessionId || sending) return;

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

  function handleEnd() {
    setScreen("setup");
    setSessionId(null);
    setMessages([]);
    setInput("");
  }

  // Guest gate — soft prompt, no redirect
  const user = useAuth((s) => s.user);
  const authLoading = useAuth((s) => s.loading);
  if (!authLoading && user === null) {
    return (
      <PageShell>
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 py-16 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-heading-sm font-semibold text-fg">Sign in to chat with Hana</p>
            <p className="text-body-sm text-fg-subtle">
              Conversation practice uses AI and is available to signed-in users. Create a free account to get started.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Link
              to="/"
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Sign in or create account
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (screen === "setup") {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-xl flex-1">
          <div className="flex flex-col gap-8 py-6">
            <div className="flex flex-col gap-2">
              <p className="text-body text-fg">Practice with Hana, your Japanese conversation partner.</p>
              <p className="text-body-sm text-fg-subtle">
                She'll match your level and gently correct mistakes by modelling the right form inline.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-body-sm font-medium text-fg">Your JLPT level</p>
              <div className="flex gap-2">
                {JLPT_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setJlpt(level)}
                    className={[
                      "flex min-h-[40px] flex-1 items-center justify-center rounded-xl text-body-sm font-medium transition-colors",
                      jlpt === level
                        ? "bg-brand-600 text-white"
                        : "border border-border bg-surface text-fg-subtle active:bg-surface-2",
                    ].join(" ")}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pb-8">
              <button
                type="button"
                onClick={() => void handleStart()}
                disabled={starting}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-60"
              >
                {starting ? "Starting…" : "Start conversation"}
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // Chat screen — needs overflow scrolling, so uses a flex-col that fills remaining height
  return (
    <PageShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between py-3">
          <button
            type="button"
            onClick={handleEnd}
            className="flex min-h-[44px] items-center text-body-sm text-fg-subtle active:text-fg"
          >
            ← End
          </button>
          <p className="text-heading-sm font-semibold text-fg">Hana · {jlpt}</p>
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
    </PageShell>
  );
}
