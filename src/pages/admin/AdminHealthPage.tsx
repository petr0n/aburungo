import { useState, useEffect, useCallback } from 'react'
import { fetchAdminHealth, type HealthStatus } from '@/api/admin'

function StatusDot({ ok, latencyMs }: { ok: boolean; latencyMs?: number }) {
  const degraded = latencyMs !== undefined && latencyMs > 300
  const color = !ok ? 'bg-error-500' : degraded ? 'bg-yellow-400' : 'bg-success-500'
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
}

export function AdminHealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    fetchAdminHealth()
      .then((h) => { setHealth(h); setError(null) })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 30_000)
    return () => clearInterval(id)
  }, [refresh])

  if (loading) return <p className="text-body-sm text-fg-faint">Checking…</p>
  if (error) return <p className="text-body-sm text-error-600">{error}</p>
  if (!health) return null

  const uptimeMins = Math.floor(health.api.uptimeMs / 60_000)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-fg">Health</h2>
        <p className="text-caption text-fg-faint">
          Last checked {new Date(health.checkedAt).toLocaleTimeString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* API */}
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-body-sm font-medium text-fg">API server</p>
            <StatusDot ok={health.api.ok} />
          </div>
          <p className="text-body-sm text-fg-subtle">Uptime {uptimeMins}m</p>
          <p className="text-caption text-fg-faint">Node {health.node} · {health.env}</p>
        </div>

        {/* DB */}
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-body-sm font-medium text-fg">Database</p>
            <StatusDot ok={health.db.ok} latencyMs={health.db.latencyMs} />
          </div>
          <p className="text-body-sm text-fg-subtle">{health.db.latencyMs}ms latency</p>
          {health.db.error && (
            <p className="text-caption text-error-fg">{health.db.error}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={refresh}
        className="self-start rounded-xl border border-border bg-surface px-4 py-2 text-body-sm text-fg-subtle active:bg-surface-2"
      >
        Refresh now
      </button>
    </div>
  )
}
