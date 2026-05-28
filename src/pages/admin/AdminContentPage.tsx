import { useState, useEffect } from "react";
import { LoadingPlaceholder, EmptyState } from "aburungo-design-system";
import { fetchAdminContent, type ContentAuditData } from "@/api/admin";

function CoverageBar({
  label,
  pct,
  withCount,
  total,
}: {
  label: string;
  pct: number;
  withCount: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-medium text-fg">{label}</span>
        <span className="text-body-sm text-fg-subtle">
          {withCount} / {total} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={pct === 100 ? "h-full rounded-full bg-success-500" : "h-full rounded-full bg-brand-500"}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AdminContentPage() {
  const [data, setData] = useState<ContentAuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardTab, setCardTab] = useState<"all" | "no-audio" | "no-jmdict" | "no-romaji">("all");

  useEffect(() => {
    fetchAdminContent()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPlaceholder />;
  if (error) return <p className="text-body-sm text-error-fg">{error}</p>;
  if (!data) return null;

  const filteredCards = data.cards.filter((c) => {
    if (cardTab === "no-audio") return c.issues.includes("no audio");
    if (cardTab === "no-jmdict") return c.issues.includes("no JMdict ID");
    if (cardTab === "no-romaji") return c.issues.includes("missing romaji");
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-fg">Content Audit</h2>
        <span className="text-caption text-fg-faint">{new Date(data.checkedAt).toLocaleTimeString()}</span>
      </div>

      {/* Audio coverage */}
      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
        <p className="text-body-sm font-medium text-fg-subtle">Audio coverage</p>
        <CoverageBar
          label="Vocabulary cards"
          pct={data.audioCoverage.coveragePercent}
          withCount={data.audioCoverage.withAudio}
          total={data.audioCoverage.total}
        />
      </section>

      {/* Vocabulary card issues */}
      <section>
        <p className="mb-3 text-body-sm font-medium text-fg-subtle">
          Vocabulary issues — {data.cards.length} cards flagged
        </p>

        {data.cards.length === 0 ? (
          <EmptyState message="All vocabulary cards look good." />
        ) : (
          <>
            {/* Filter tabs */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "no-audio", label: "No audio" },
                  { key: "no-jmdict", label: "No JMdict ID" },
                  { key: "no-romaji", label: "No romaji" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCardTab(key)}
                  className={[
                    "flex shrink-0 min-h-[32px] items-center rounded-xl px-3 text-caption font-medium transition-colors",
                    cardTab === key
                      ? "bg-brand-600 text-white"
                      : "border border-border bg-surface text-fg-subtle active:bg-surface-2",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {filteredCards.map((card) => (
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
                  <div className="flex flex-wrap justify-end gap-1">
                    {card.issues.map((issue) => (
                      <span
                        key={issue}
                        className="rounded-md bg-error-bg px-2 py-0.5 text-caption font-medium text-error-fg"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Kanji issues */}
      <section>
        <p className="mb-3 text-body-sm font-medium text-fg-subtle">Kanji issues — {data.kanji.length} flagged</p>
        {data.kanji.length === 0 ? (
          <EmptyState message="All kanji data looks good." />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {data.kanji.map((k) => (
              <div key={k.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
                <span className="text-jp-lg font-medium text-fg" style={{ fontFamily: "var(--font-jp)" }}>
                  {k.character}
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  {k.issues.map((issue) => (
                    <span key={issue} className="text-caption text-warning-fg">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
