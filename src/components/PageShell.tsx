import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/store/auth";

// ── Types ────────────────────────────────────────────────────────────────────

type PageShellProps = {
  children: ReactNode;
  onFeedback?: () => void;
  sideNav?: ReactNode;
};

type NavLink = { to: string; label: string };
type SectionLink = { to: string; label: string };

// ── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  { to: "/learn", label: "Today" },
  { to: "/words", label: "Words" },
  { to: "/kana", label: "Kana" },
  { to: "/flashcard", label: "Flashcards" },
  { to: "/practice", label: "Practice" },
  { to: "/kanji", label: "Kanji" },
  { to: "/conversation", label: "Chat" },
  { to: "/how-to", label: "How to use" },
];

// ── Sub-components ───────────────────────────────────────────────────────────

export function AccountChip() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const location = useLocation();

  if (user === null) {
    return (
      <Link to="/" className="flex min-h-[44px] items-center px-3 text-body-sm text-fg-subtle active:text-fg">
        Sign in
      </Link>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Account";
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = (user.app_metadata as Record<string, unknown> | undefined)?.role === "admin";
  const onAdminPages = location.pathname.startsWith("/admin");

  return (
    <div className="flex items-center gap-2">
      {isAdmin && !onAdminPages && (
        <Link
          to="/admin"
          className="hidden rounded-md border border-brand-200 bg-brand-50 px-2 py-0.5 text-caption font-semibold text-brand-600 active:bg-brand-100 sm:block"
        >
          Admin
        </Link>
      )}
      <Link to="/profile" className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100">
          {avatarUrl !== undefined ? (
            <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-caption font-semibold text-brand-600">{initial}</span>
          )}
        </div>
        <span className="hidden text-body-sm text-fg-muted sm:block">{displayName}</span>
      </Link>
      <button
        type="button"
        onClick={() => {
          void signOut();
        }}
        className="min-h-[44px] px-2 text-body-sm text-fg-subtle active:text-fg"
      >
        Sign out
      </button>
    </div>
  );
}

// ── Exported sub-nav ─────────────────────────────────────────────────────────

export function SectionNav({ links }: { links: SectionLink[] }) {
  const location = useLocation();
  return (
    <nav className="flex flex-col gap-0.5 pt-4">
      <p className="mb-1 px-3 text-caption font-semibold uppercase tracking-widest text-fg-faint">In this section</p>
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={[
              "flex min-h-[44px] items-center rounded-lg px-3 text-body-sm transition-colors",
              isActive ? "bg-surface-2 font-medium text-fg" : "text-fg-subtle active:bg-surface-2 active:text-fg",
            ].join(" ")}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

// ── Main shell ───────────────────────────────────────────────────────────────

export function PageShell({ children, onFeedback, sideNav }: PageShellProps) {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 sm:px-6">
      <header translate="no">
        {/* Row 1: logo + account */}
        <div className="flex items-center justify-between py-4">
          <Link to="/practice" className="ctype" style={{ gap: 12 }}>
            <span className="hanko" style={{ fontSize: "clamp(60px,9vw,108px)" }} />
            <span className="wm" style={{ fontSize: "clamp(44px,7.5vw,96px)" }}>
              aburungo
              <span className="maru" />
            </span>
            <span className="rule" />
            <span className="kata-vert" style={{ fontSize: "clamp(11px,1.4vw,16px)" }}>
              アブルンゴ
            </span>
          </Link>
          <AccountChip />
        </div>

        {/* Row 2: main nav */}
        <nav className="flex items-center overflow-x-auto border-t border-border scrollbar-none">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  "flex shrink-0 min-h-[44px] items-center border-b-2 px-3 text-body-sm transition-colors",
                  isActive
                    ? "border-brand-500 font-medium text-fg"
                    : "border-transparent text-fg-subtle active:text-fg",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
          {onFeedback !== undefined && (
            <button
              type="button"
              onClick={onFeedback}
              className="flex shrink-0 min-h-[44px] items-center border-b-2 border-transparent px-3 text-body-sm text-fg-subtle active:text-fg"
            >
              Feedback
            </button>
          )}
        </nav>
      </header>

      <div className="flex flex-1 gap-8 py-6">
        <div className="flex w-full min-w-0 flex-1 flex-col items-start">{children}</div>
        <aside className="hidden w-44 shrink-0 lg:block">{sideNav}</aside>
      </div>

      <footer className="flex items-center justify-center border-t border-border py-6">
        <Link to="/practice" className="ctype" style={{ gap: 6 }}>
          <span className="hanko" style={{ fontSize: 16 }} />
          <span className="wm sm">
            aburungo
            <span className="maru" />
          </span>
        </Link>
      </footer>
    </div>
  );
}
