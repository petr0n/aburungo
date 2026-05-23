import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { fetchKanjiList, type KanjiEntry } from '@/api/kanji'
import { KanjiDrillCard, type DrillPhase } from '@/components/KanjiDrillCard'

type Screen = 'browse' | 'drill' | 'result'
type JlptFilter = 5 | 4 | 3 | 2 | 1

const JLPT_TABS: JlptFilter[] = [5, 4, 3, 2, 1]

// --- Furigana helper (also used in browse detail panel) ---

function parseKun(raw: string): { reading: string; okurigana: string } {
  const [reading, okurigana = ''] = raw.split('.')
  return { reading, okurigana }
}

function KunReading({ kanji, raw }: { kanji: string; raw: string }) {
  const { reading, okurigana } = parseKun(raw)
  return (
    <span>
      <ruby style={{ fontFamily: 'var(--font-jp)' }}>
        {kanji}
        <rt className="text-caption text-fg-subtle">{reading}</rt>
      </ruby>
      {okurigana && <span style={{ fontFamily: 'var(--font-jp)' }}>{okurigana}</span>}
    </span>
  )
}

// --- Shuffle ---

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// --- Browse screen ---

type BrowseProps = {
  jlpt: JlptFilter
  onJlptChange: (j: JlptFilter) => void
  kanji: KanjiEntry[]
  loading: boolean
  selected: KanjiEntry | null
  onSelect: (k: KanjiEntry | null) => void
  onStartDrill: () => void
}

function BrowseScreen({
  jlpt,
  onJlptChange,
  kanji,
  loading,
  selected,
  onSelect,
  onStartDrill,
}: BrowseProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 pb-8">
      {/* JLPT tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {JLPT_TABS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => {
              onJlptChange(level)
              onSelect(null)
            }}
            className={[
              'flex min-h-[40px] shrink-0 items-center justify-center rounded-xl px-4 text-body-sm font-medium transition-colors',
              jlpt === level
                ? 'bg-brand-600 text-white'
                : 'border border-border bg-surface text-fg-subtle active:bg-surface-2',
            ].join(' ')}
          >
            N{level}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selected != null && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <div className="flex items-start gap-4">
            <span
              className="text-[3.5rem] font-medium leading-none text-fg"
              style={{ fontFamily: 'var(--font-jp)' }}
            >
              {selected.character}
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-body font-semibold text-fg">
                {selected.meanings.slice(0, 3).join(', ')}
              </p>

              {selected.onReadings.length > 0 && (
                <div>
                  <span className="text-caption font-medium uppercase tracking-wider text-fg-subtle">
                    On{' '}
                  </span>
                  <span
                    className="text-body-sm text-fg"
                    style={{ fontFamily: 'var(--font-jp)' }}
                  >
                    {selected.onReadings.join('、')}
                  </span>
                </div>
              )}

              {selected.kunReadings.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-caption font-medium uppercase tracking-wider text-fg-subtle">
                    Kun{' '}
                  </span>
                  {selected.kunReadings.slice(0, 4).map((r) => (
                    <KunReading key={r} kanji={selected.character} raw={r} />
                  ))}
                </div>
              )}

              {selected.strokeCount != null && (
                <p className="text-body-sm text-fg-subtle">
                  {selected.strokeCount} strokes
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center text-fg-subtle active:text-fg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-body-sm text-fg-faint">Loading…</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {kanji.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => onSelect(selected?.id === k.id ? null : k)}
              className={[
                'flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-xl border transition-colors',
                selected?.id === k.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-border bg-surface active:bg-surface-2',
              ].join(' ')}
            >
              <span
                className="text-jp-lg font-medium text-fg"
                style={{ fontFamily: 'var(--font-jp)' }}
              >
                {k.character}
              </span>
              <span className="max-w-full truncate px-1 text-[0.6rem] text-fg-subtle">
                {k.meanings[0]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Drill button */}
      {!loading && kanji.length > 0 && (
        <div className="mt-auto">
          <button
            type="button"
            onClick={onStartDrill}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
          >
            Drill N{jlpt} — {kanji.length} kanji
          </button>
        </div>
      )}
    </div>
  )
}

// --- Main page ---

export function KanjiPage() {
  const [screen, setScreen] = useState<Screen>('browse')
  const [jlpt, setJlpt] = useState<JlptFilter>(5)
  const [kanjiList, setKanjiList] = useState<KanjiEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<KanjiEntry | null>(null)

  // Drill state
  const [queue, setQueue] = useState<KanjiEntry[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [missed, setMissed] = useState<KanjiEntry[]>([])
  const [phase, setPhase] = useState<DrillPhase>('entering')
  const [stagedKanji, setStagedKanji] = useState<KanjiEntry | null>(null)
  const [pendingCorrect, setPendingCorrect] = useState<boolean | null>(null)

  const advanceRef = useRef<() => void>(() => {})

  // Load kanji when JLPT filter changes
  useEffect(() => {
    setLoading(true)
    setKanjiList([])
    // Fetch up to 500 per level — N1 has ~1200 so we cap and note it
    fetchKanjiList({ jlpt, limit: 100, offset: 0 })
      .then((first) => {
        if (first.length < 100) {
          setKanjiList(first)
          setLoading(false)
          return
        }
        // Fetch remaining pages
        return fetchKanjiList({ jlpt, limit: 100, offset: 100 }).then((second) => {
          if (second.length < 100) {
            setKanjiList([...first, ...second])
            setLoading(false)
            return
          }
          return fetchKanjiList({ jlpt, limit: 100, offset: 200 }).then((third) => {
            setKanjiList([...first, ...second, ...third])
            setLoading(false)
          })
        })
      })
      .catch(() => setLoading(false))
  }, [jlpt])

  function startDrill() {
    const q = shuffle(kanjiList)
    setQueue(q)
    setQueueIndex(0)
    setCorrectCount(0)
    setMissed([])
    setPhase('entering')
    setStagedKanji(null)
    setPendingCorrect(null)
    setScreen('drill')
  }

  function handleReveal() {
    setPhase('revealed')
  }

  function handleRate(correct: boolean) {
    setStagedKanji(queue[queueIndex] ?? null)
    setPendingCorrect(correct)
    setPhase('exiting')
  }

  function advance() {
    const correct = pendingCorrect ?? false
    const current = stagedKanji ?? queue[queueIndex]

    if (correct) {
      setCorrectCount((n) => n + 1)
    } else if (current) {
      setMissed((m) => [...m, current])
    }

    const nextIndex = queueIndex + 1
    if (nextIndex >= queue.length) {
      setScreen('result')
      return
    }

    setQueueIndex(nextIndex)
    setStagedKanji(null)
    setPendingCorrect(null)
    setPhase('entering')
  }
  advanceRef.current = advance

  function handleEntered() {
    setPhase('idle')
  }

  function handleExited() {
    advanceRef.current()
  }

  const displayKanji = stagedKanji ?? queue[queueIndex] ?? null

  // --- Header ---
  const header = (
    <header className="flex items-center justify-between py-4">
      {screen === 'browse' ? (
        <Link
          to="/practice"
          className="flex min-h-[44px] items-center text-body-sm text-fg-subtle active:text-fg"
        >
          ← Back
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setScreen('browse')}
          className="flex min-h-[44px] items-center text-body-sm text-fg-subtle active:text-fg"
        >
          {screen === 'result' ? '← Browse' : '✕ Quit'}
        </button>
      )}
      <h1 className="text-heading-sm font-semibold text-fg">Kanji</h1>
      {screen === 'drill' ? (
        <p className="text-body-sm text-fg-subtle">
          {queueIndex + 1} / {queue.length}
        </p>
      ) : (
        <div className="w-16" />
      )}
    </header>
  )

  // --- Drill progress bar ---
  const progressBar =
    screen === 'drill' ? (
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${((queueIndex + 1) / queue.length) * 100}%` }}
        />
      </div>
    ) : null

  // --- Result screen ---
  if (screen === 'result') {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-4">
        {header}
        <div className="flex flex-1 flex-col gap-6 py-4">
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-display font-bold text-fg">
              {correctCount}
              <span className="text-heading-lg text-fg-subtle"> / {queue.length}</span>
            </p>
            <p className="mt-1 text-body-sm text-fg-subtle">correct</p>
          </div>

          {missed.length > 0 && (
            <section>
              <p className="mb-3 text-body-sm font-medium text-fg-subtle">
                Missed — {missed.length}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {missed.map((k) => (
                  <div
                    key={k.id}
                    className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface py-3"
                  >
                    <span
                      className="text-jp-lg font-medium text-fg"
                      style={{ fontFamily: 'var(--font-jp)' }}
                    >
                      {k.character}
                    </span>
                    <span className="px-1 text-center text-[0.65rem] leading-tight text-fg-subtle">
                      {k.meanings[0]}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-auto flex flex-col gap-3 pb-8">
            <button
              type="button"
              onClick={startDrill}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Drill again
            </button>
            <button
              type="button"
              onClick={() => setScreen('browse')}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-border bg-surface text-body font-medium text-fg active:bg-surface-2"
            >
              Back to browse
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-4">
      {header}
      {progressBar}

      {screen === 'browse' && (
        <BrowseScreen
          jlpt={jlpt}
          onJlptChange={setJlpt}
          kanji={kanjiList}
          loading={loading}
          selected={selected}
          onSelect={setSelected}
          onStartDrill={startDrill}
        />
      )}

      {screen === 'drill' && displayKanji != null && (
        <div className="flex flex-1 flex-col justify-center py-6">
          <KanjiDrillCard
            key={displayKanji.id}
            kanji={displayKanji}
            phase={phase}
            onReveal={handleReveal}
            onRate={handleRate}
            onEntered={handleEntered}
            onExited={handleExited}
          />
        </div>
      )}
    </main>
  )
}
