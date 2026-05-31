import { NavLink, Outlet, Link } from "react-router";
import { AccountChip } from "@/components/PageShell";

const NAV = [
  { to: "/admin/users", label: "Users" },
  { to: "/admin/feedback", label: "Feedback" },
  { to: "/admin/health", label: "Health" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/content", label: "Content" },
  { to: "/admin/logs", label: "Logs" },
];

export function AdminLayout() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 sm:px-6">
      <header translate="no">
        {/* Row 1: logo + admin label + account */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
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
            <span className="hidden text-body-sm font-semibold text-fg-faint sm:block">
              / admin
            </span>
          </div>
          <AccountChip />
        </div>

        {/* Row 2: admin nav — same border-b-2 underline style as public nav */}
        <nav className="flex items-center overflow-x-auto border-t border-border scrollbar-none">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex shrink-0 min-h-[44px] items-center border-b-2 px-3 text-body-sm transition-colors",
                  isActive
                    ? "border-brand-500 font-medium text-fg"
                    : "border-transparent text-fg-subtle active:text-fg",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 flex-col py-6">
        <Outlet />
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
