import { useState, useEffect, useRef } from "react";
import { LoadingPlaceholder, EmptyState } from "aburungo-design-system";
import { fetchAdminLogs, type LogEntry, type LogLevel } from "@/api/admin";

const LEVELS: LogLevel[] = ["info", "warn", "error"];
const LEVEL_COLORS: Record<LogLevel, string> = {
  trace: "text-fg-faint",
  debug: "text-fg-subtle",
  info: "text-fg",
  warn: "text-warning-fg",
  error: "text-error-fg",
  fatal: "text-error-fg",
};
const LEVEL_BADGE: Record<LogLevel, string> = {
  trace: "bg-surface-2 text-fg-faint",
  debug: "bg-surface-2 text-fg-subtle",
  info: "bg-surface-2 text-fg",
  warn: "bg-warning-bg text-warning-fg",
  error: "bg-error-bg text-error-fg",
  fatal: "bg-error-bg text-error-fg",
};

export function AdminLogsPage() {
  const [level, setLevel] = useState<LogLevel | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function load() {
      fetchAdminLogs(level, 200)
        .then(setEntries)
        .finally(() => setLoading(false));
    }
    load();
    intervalRef.current = setInterval(load, 15_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [level]);

  const filtered = search.trim()
    ? entries.filter(
        (e) =>
          e.msg?.toLowerCase().includes(search.toLowerCase()) || e.route?.toLowerCase().includes(search.toLowerCase()),
      )
    : entries;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-fg">Logs</h2>
        <span className="text-caption text-fg-faint">Auto-refreshes every 15s</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setLevel(undefined);
            setLoading(true);
          }}
          className={[
            "flex min-h-[36px] items-center rounded-xl px-3 text-body-sm font-medium transition-colors",
            level === undefined
              ? "bg-brand-600 text-white"
              : "border border-border bg-surface text-fg-subtle active:bg-surface-2",
          ].join(" ")}
        >
          All
        </button>
        {LEVELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLevel(l);
              setLoading(true);
            }}
            className={[
              "flex min-h-[36px] items-center rounded-xl px-3 text-body-sm font-medium capitalize transition-colors",
              level === l
                ? "bg-brand-600 text-white"
                : "border border-border bg-surface text-fg-subtle active:bg-surface-2",
            ].join(" ")}
          >
            {l}
          </button>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="min-h-[36px] flex-1 rounded-xl border border-border bg-surface px-3 text-body-sm text-fg outline-none focus:border-brand-500"
        />
      </div>

      {loading && <LoadingPlaceholder />}

      {!loading && filtered.length === 0 && <EmptyState message="No log entries." />}

      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-1">
          {filtered.map((entry, i) => (
            <div key={i} className="flex flex-col gap-0.5 rounded-xl border border-border bg-surface p-3">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "rounded px-1.5 py-0.5 text-caption font-semibold uppercase",
                    LEVEL_BADGE[entry.level] ?? LEVEL_BADGE.info,
                  ].join(" ")}
                >
                  {entry.level}
                </span>
                <span className="text-caption text-fg-faint">{new Date(entry.time).toLocaleTimeString()}</span>
                {entry.method && entry.route && (
                  <span className="text-caption text-fg-subtle">
                    {entry.method} {entry.route}
                  </span>
                )}
                {entry.status && (
                  <span
                    className={[
                      "text-caption font-medium",
                      entry.status >= 500
                        ? "text-error-fg"
                        : entry.status >= 400
                          ? "text-warning-fg"
                          : "text-fg-subtle",
                    ].join(" ")}
                  >
                    {entry.status}
                  </span>
                )}
              </div>
              <p className={["text-body-sm", LEVEL_COLORS[entry.level] ?? "text-fg"].join(" ")}>{entry.msg}</p>
              {entry.err && <p className="text-caption text-error-fg">{entry.err}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
