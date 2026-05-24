import { useState, useEffect } from 'react'
import {
  fetchAdminFeedback,
  updateFeedbackStatus,
  type FeedbackItem,
  type FeedbackStatus,
} from '@/api/admin'

const STATUS_TABS: FeedbackStatus[] = ['open', 'reviewed', 'resolved']

const TYPE_LABEL: Record<string, string> = {
  bug: 'Bug',
  suggestion: 'Suggestion',
  other: 'Other',
}

const STATUS_NEXT: Record<FeedbackStatus, FeedbackStatus> = {
  open: 'reviewed',
  reviewed: 'resolved',
  resolved: 'open',
}

const STATUS_ACTION: Record<FeedbackStatus, string> = {
  open: 'Mark reviewed',
  reviewed: 'Mark resolved',
  resolved: 'Reopen',
}

export function AdminFeedbackPage() {
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus>('open')
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchAdminFeedback(statusFilter)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [statusFilter])

  async function handleAdvance(item: FeedbackItem) {
    const next = STATUS_NEXT[item.status]
    await updateFeedbackStatus(item.id, next)
    setItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-heading-sm font-semibold text-fg">Feedback</h2>

      {/* Status tabs */}
      <div className="flex gap-2">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={[
              'flex min-h-[36px] items-center rounded-xl px-4 text-body-sm font-medium capitalize transition-colors',
              statusFilter === s
                ? 'bg-brand-600 text-white'
                : 'border border-border bg-surface text-fg-subtle active:bg-surface-2',
            ].join(' ')}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p className="text-body-sm text-fg-faint">Loading…</p>}

      {!loading && items.length === 0 && (
        <p className="text-body-sm text-fg-faint">No {statusFilter} feedback.</p>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-caption font-medium text-fg-subtle">
                    {TYPE_LABEL[item.type]}
                  </span>
                  <span className="text-caption text-fg-faint">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-body text-fg">{item.message}</p>
                {item.userId && (
                  <p className="text-caption text-fg-faint">{item.userId.slice(0, 8)}…</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => void handleAdvance(item)}
                className="shrink-0 rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-body-sm font-medium text-fg active:bg-surface"
              >
                {STATUS_ACTION[item.status]}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
