import { useState } from "react";
import { Link } from "react-router";
import { FillBlankScreen } from "@/components/FillBlankScreen";
import { FeedbackSheet } from "@/components/FeedbackSheet";
import { useAuth } from "@/store/auth";

export function PracticePage() {
  const signOut = useAuth((s) => s.signOut);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-0 px-4">
      <header className="flex items-center justify-between py-4">
        <span className="ctype" style={{ gap: 10 }}>
          <span className="hanko" style={{ fontSize: 24 }} />
          <h1 className="wm sm">
            aburungo
            <span className="maru" />
          </h1>
        </span>
        <div className="flex items-center gap-1">
          <Link
            to="/flashcard"
            className="min-h-[44px] flex items-center px-3 text-body-sm text-fg-subtle active:text-fg"
          >
            Flashcards
          </Link>
          <Link to="/kana" className="min-h-[44px] flex items-center px-3 text-body-sm text-fg-subtle active:text-fg">
            Kana
          </Link>
          <Link to="/kanji" className="min-h-[44px] flex items-center px-3 text-body-sm text-fg-subtle active:text-fg">
            Kanji
          </Link>
          <Link
            to="/conversation"
            className="min-h-[44px] flex items-center px-3 text-body-sm text-fg-subtle active:text-fg"
          >
            Chat
          </Link>
          <Link to="/how-to" className="min-h-[44px] flex items-center px-3 text-body-sm text-fg-subtle active:text-fg">
            How to use
          </Link>
          <button
            type="button"
            onClick={() => setFeedbackOpen(true)}
            className="min-h-[44px] px-3 text-body-sm text-fg-subtle active:text-fg"
          >
            Feedback
          </button>
          <button
            type="button"
            onClick={() => {
              void signOut();
            }}
            className="min-h-[44px] px-3 text-body-sm text-fg-subtle active:text-fg"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="flex flex-1 flex-col justify-center py-6">
        <FillBlankScreen />
      </div>
      {feedbackOpen && <FeedbackSheet onClose={() => setFeedbackOpen(false)} />}
    </main>
  );
}
