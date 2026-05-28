import { useState, useEffect } from "react";
import { LoadingPlaceholder } from "aburungo-design-system";
import { fetchAdminAnalytics, type AnalyticsData, type FsrsDistribution } from "@/api/admin";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4">
      <p className="text-caption font-medium uppercase tracking-wider text-fg-subtle">{label}</p>
      <p className="text-heading-sm font-semibold text-fg">{value}</p>
    </div>
  );
}

function BarChart({ data }: { data: { date: string; count: number }[] }) {
  if (data.length === 0) return <p className="text-body-sm text-fg-subtle">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-0.5 overflow-x-auto pb-2" style={{ minHeight: "80px" }}>
      {data.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full min-w-[6px] rounded-t bg-brand-500"
            style={{ height: `${Math.round((d.count / max) * 64)}px` }}
            title={`${d.date}: ${d.count}`}
          />
          {data.length <= 14 && <span className="text-[0.55rem] text-fg-faint">{d.date.slice(5)}</span>}
        </div>
      ))}
    </div>
  );
}

function FsrsBar({ distribution, label }: { distribution: FsrsDistribution; label: string }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  if (total === 0) return <p className="text-body-sm text-fg-subtle">No SRS data yet.</p>;

  const segments: { key: keyof FsrsDistribution; color: string }[] = [
    { key: "new", color: "bg-fg-faint" },
    { key: "learning", color: "bg-brand-400" },
    { key: "review", color: "bg-brand-600" },
    { key: "relearning", color: "bg-warning-fg" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-sm font-medium text-fg">{label}</p>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {segments.map(({ key, color }) => {
          const pct = (distribution[key] / total) * 100;
          return pct > 0 ? (
            <div key={key} className={color} style={{ width: `${pct}%` }} title={`${key}: ${distribution[key]}`} />
          ) : null;
        })}
      </div>
      <div className="flex flex-wrap gap-3">
        {segments.map(({ key, color }) => (
          <span key={key} className="flex items-center gap-1 text-caption text-fg-subtle">
            <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
            {key} ({distribution[key]})
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminAnalytics()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPlaceholder />;
  if (error) return <p className="text-body-sm text-error-fg">{error}</p>;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-fg">Analytics</h2>
        <span className="text-caption text-fg-faint">Cached · {new Date(data.cachedAt).toLocaleTimeString()}</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total users" value={data.totalUsers} />
        <StatCard label="Reviews (30d)" value={data.totalReviews} />
      </div>

      {/* Reviews per day chart */}
      <section>
        <p className="mb-3 text-body-sm font-medium text-fg-subtle">Reviews per day — last 30 days</p>
        <BarChart data={data.reviewsPerDay} />
      </section>

      {/* FSRS distribution */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4">
        <FsrsBar distribution={data.cardFsrsDistribution} label="Vocabulary SRS state" />
        <FsrsBar distribution={data.kanjiFsrsDistribution} label="Kanji SRS state" />
      </section>

      {/* Most missed vocabulary */}
      {data.mostMissedCards.length > 0 && (
        <section>
          <p className="mb-3 text-body-sm font-medium text-fg-subtle">Most missed vocabulary (min 3 reviews)</p>
          <div className="flex flex-col gap-2">
            {data.mostMissedCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-body font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                    {card.japanese}
                  </span>
                  <span className="text-caption text-fg-subtle">
                    {card.english} · {card.deck}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-body-sm font-semibold text-error-fg">
                    {Math.round(card.againRatio * 100)}% again
                  </span>
                  <span className="text-caption text-fg-faint">
                    {card.againCount}/{card.totalCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Most missed kanji */}
      {data.mostMissedKanji.length > 0 && (
        <section>
          <p className="mb-3 text-body-sm font-medium text-fg-subtle">Most missed kanji (min 3 reviews)</p>
          <div className="grid grid-cols-2 gap-2">
            {data.mostMissedKanji.map((k) => (
              <div key={k.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
                <span className="text-jp-lg font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                  {k.character}
                </span>
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <span className="truncate text-caption text-fg-subtle">{k.meanings.slice(0, 2).join(", ")}</span>
                  <span className="text-caption font-semibold text-error-fg">
                    {Math.round(k.againRatio * 100)}% again
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
