import { useState, useEffect } from "react";
import { LoadingPlaceholder } from "aburungo-design-system";
import { fetchAdminUsers, fetchAdminUser, updateAdminUser, type AdminUser, type AdminUserDetail } from "@/api/admin";

const FSRS_STATES = ["new", "learning", "review", "relearning"] as const;

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchAdminUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  async function handleSelect(id: string) {
    setDetailLoading(true);
    const detail = await fetchAdminUser(id);
    setSelected(detail);
    setDetailLoading(false);
  }

  async function handleToggleSuspend(user: AdminUser) {
    await updateAdminUser(user.id, { suspended: !user.suspended });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, suspended: !u.suspended } : u)));
    if (selected?.id === user.id) {
      setSelected((prev) => (prev ? { ...prev, suspended: !prev.suspended } : prev));
    }
  }

  if (loading) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-heading-sm font-semibold text-fg">
        Users <span className="ml-2 text-body-sm font-normal text-fg-subtle">{users.length}</span>
      </h2>

      {/* Detail panel */}
      {selected && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-body font-medium text-fg">{selected.email ?? "No email"}</p>
              <p className="text-body-sm text-fg-subtle">
                Joined {new Date(selected.created_at).toLocaleDateString()} · {selected.totalReviewed} reviews
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void handleToggleSuspend(selected)}
                className={[
                  "rounded-xl px-3 py-1.5 text-body-sm font-medium",
                  selected.suspended ? "bg-success-bg text-success-fg" : "bg-error-bg text-error-fg",
                ].join(" ")}
              >
                {selected.suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex min-h-[36px] min-w-[36px] items-center justify-center text-fg-subtle"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-caption font-medium uppercase tracking-wider text-fg-subtle">Vocab FSRS</p>
              <div className="flex flex-col gap-1">
                {FSRS_STATES.map((s) => (
                  <div key={s} className="flex justify-between text-body-sm">
                    <span className="capitalize text-fg-subtle">{s}</span>
                    <span className="font-medium text-fg">{selected.masteryBreakdown[s] ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-caption font-medium uppercase tracking-wider text-fg-subtle">Kanji FSRS</p>
              <div className="flex flex-col gap-1">
                {FSRS_STATES.map((s) => (
                  <div key={s} className="flex justify-between text-body-sm">
                    <span className="capitalize text-fg-subtle">{s}</span>
                    <span className="font-medium text-fg">{selected.kanjiBreakdown[s] ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {detailLoading && <p className="text-body-sm text-fg-faint">Loading user…</p>}

      {/* User table */}
      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
        {users.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => void handleSelect(u.id)}
            className="flex items-center justify-between px-4 py-3 text-left active:bg-surface-2"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-body text-fg">{u.email ?? u.id.slice(0, 8)}</span>
              <span className="text-body-sm text-fg-subtle">
                {u.totalReviewed} reviews · joined {new Date(u.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {u.suspended && (
                <span className="rounded-md bg-error-50 px-2 py-0.5 text-caption font-medium text-error-600">
                  Suspended
                </span>
              )}
              <span className="text-fg-subtle">›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
