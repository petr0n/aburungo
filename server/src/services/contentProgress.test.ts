/**
 * PostgREST returns at most 1000 rows per select (Supabase's default max-rows),
 * silently. A learner past 1000 review states got the first 1000 back, the
 * client pushed the rest as "missing" in one batch over the route's 500 cap,
 * and every load 400'd (2026-10-05 signed-in walkthrough, Book Three: 1526
 * rows stored, 1000 returned).
 */
import { describe, it, expect, vi } from 'vitest'

const MAX_ROWS = 1000
const stored = Array.from({ length: 1526 }, (_, i) => ({
  content_id: `vocab.item-${String(i).padStart(4, '0')}`,
  box: 1,
  due_at: '2026-10-05T00:00:00Z',
  last_seen_at: null,
}))

vi.mock('../lib/supabase.js', () => {
  const query = {
    select: () => query,
    eq: () => query,
    order: () => query,
    // Mirrors PostgREST: a range is honoured, but never past max-rows.
    range: async (from: number, to: number) => ({
      data: stored.slice(from, Math.min(to + 1, from + MAX_ROWS)),
      error: null,
    }),
    then: (resolve: (v: unknown) => void) => resolve({ data: stored.slice(0, MAX_ROWS), error: null }),
  }
  return { supabase: { from: () => query } }
})

const { fetchContentProgress } = await import('./progress.js')

describe('fetchContentProgress', () => {
  it('returns every row, not just the first page PostgREST allows', async () => {
    const rows = await fetchContentProgress('user-1')
    expect(rows).toHaveLength(1526)
    expect(new Set(rows.map((r) => r.contentId)).size).toBe(1526)
  })
})
