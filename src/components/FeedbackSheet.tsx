import { useState } from "react";
import { submitFeedback, type FeedbackType } from "@/api/feedback";

type Props = { onClose: () => void };

const TYPES: { value: FeedbackType; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "suggestion", label: "Suggestion" },
  { value: "other", label: "Other" },
];

export function FeedbackSheet({ onClose }: Props) {
  const [type, setType] = useState<FeedbackType>("suggestion");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await submitFeedback(type, message.trim());
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-t-3xl bg-bg px-4 pb-10 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-heading-sm font-semibold text-fg">Send feedback</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-fg-subtle"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-body font-medium text-fg">Thanks for the feedback!</p>
            <button type="button" onClick={onClose} className="text-body-sm text-brand-600">
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              {TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={[
                    "flex min-h-[36px] flex-1 items-center justify-center rounded-xl text-body-sm font-medium transition-colors",
                    type === value
                      ? "bg-brand-600 text-white"
                      : "border border-border bg-surface text-fg-subtle active:bg-surface-2",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue or idea…"
              rows={4}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-body text-fg placeholder:text-fg-faint focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={sending || !message.trim()}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
