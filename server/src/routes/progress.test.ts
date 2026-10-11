/**
 * The /learn sync routes, end to end through the real auth middleware, route
 * validation and services. Only the Supabase client is faked: an in-memory
 * table store that, like PostgREST, never returns more than 1000 rows a select.
 *
 * Mocking the service instead would pass while the service wrote the wrong
 * column. Both sync bugs this server has shipped were below the route: the
 * validator said box <= 5 while the client scheduled 8 (sync stopped for the
 * account), and an unpaged select dropped every review state past the 1000th.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

type Row = Record<string, unknown>
const tables = new Map<string, Row[]>()
const MAX_ROWS = 1000
const TOKENS: Record<string, string> = { 'token-a': 'user-a', 'token-b': 'user-b' }

function query(table: string) {
  const filters: Array<[string, unknown]> = []
  let orderBy: string | null = null
  const matching = () => {
    const rows = (tables.get(table) ?? []).filter((r) => filters.every(([k, v]) => r[k] === v))
    if (orderBy) {
      const key = orderBy
      rows.sort((a, b) => String(a[key]).localeCompare(String(b[key])))
    }
    return rows
  }
  const q = {
    select: () => q,
    eq: (k: string, v: unknown) => (filters.push([k, v]), q),
    order: (k: string) => ((orderBy = k), q),
    range: async (from: number, to: number) => ({
      data: matching().slice(from, Math.min(to + 1, from + MAX_ROWS)),
      error: null,
    }),
    maybeSingle: async () => ({ data: matching()[0] ?? null, error: null }),
    upsert: async (input: Row | Row[], opts: { onConflict: string }) => {
      const keys = opts.onConflict.split(',')
      const rows = tables.get(table) ?? []
      for (const row of Array.isArray(input) ? input : [input]) {
        const i = rows.findIndex((r) => keys.every((k) => r[k] === row[k]))
        if (i >= 0) rows[i] = { ...rows[i], ...row }
        else rows.push({ ...row })
      }
      tables.set(table, rows)
      return { error: null }
    },
    // An unpaged select, awaited directly, gets PostgREST's silent cap.
    then: (resolve: (v: unknown) => void) => resolve({ data: matching().slice(0, MAX_ROWS), error: null }),
  }
  return q
}

vi.mock('../lib/supabase.js', () => ({
  supabase: {
    from: (table: string) => query(table),
    auth: {
      getUser: async (token: string) =>
        TOKENS[token]
          ? { data: { user: { id: TOKENS[token], email: `${TOKENS[token]}@example.com` } }, error: null }
          : { data: { user: null }, error: { message: 'invalid token' } },
    },
  },
}))

const { progressRoutes } = await import('./progress.js')
const app = new Hono().route('/api/progress', progressRoutes)

function call(method: string, path: string, body?: unknown, token = 'token-a') {
  return app.request(`/api/progress${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
}

const entry = (contentId: string, over: Partial<Record<string, unknown>> = {}) => ({
  contentId,
  box: 2,
  dueAt: Date.UTC(2026, 9, 12),
  lastSeenAt: Date.UTC(2026, 9, 9),
  ...over,
})

async function content(token = 'token-a') {
  const res = await call('GET', '/content', undefined, token)
  return ((await res.json()) as { data: Array<ReturnType<typeof entry>> }).data
}

beforeEach(() => tables.clear())

describe('auth', () => {
  it('refuses a request with no token', async () => {
    expect((await call('GET', '/content', undefined, '')).status).toBe(401)
  })

  it('refuses a token Supabase does not recognise', async () => {
    expect((await call('GET', '/path?pathId=n5', undefined, 'forged')).status).toBe(401)
  })
})

describe('/content (review state)', () => {
  it('round-trips an entry exactly, timestamps included', async () => {
    const e = entry('vocab.mizu', { box: 8, lastSeenAt: null })
    expect((await call('POST', '/content', { entries: [e] })).status).toBe(200)
    expect(await content()).toEqual([e])
  })

  it('accepts every box the client schedules, one to eight', async () => {
    const entries = [1, 2, 3, 4, 5, 6, 7, 8].map((box) => entry(`vocab.b${box}`, { box }))
    expect((await call('POST', '/content', { entries })).status).toBe(200)
    expect((await content()).map((e) => e.box).sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('rejects a box outside the ladder, and saves nothing from that batch', async () => {
    for (const box of [0, 9, 2.5]) {
      const res = await call('POST', '/content', { entries: [entry('vocab.ok'), entry('vocab.bad', { box })] })
      expect(res.status).toBe(400)
    }
    expect(await content()).toEqual([])
  })

  it('takes a batch of 500 and refuses 501, the cap the client batches to', async () => {
    const batch = (n: number) => Array.from({ length: n }, (_, i) => entry(`vocab.n${i}`))
    expect((await call('POST', '/content', { entries: batch(501) })).status).toBe(400)
    expect((await call('POST', '/content', { entries: batch(500) })).status).toBe(200)
    expect(await content()).toHaveLength(500)
  })

  it('overwrites an item on a second write rather than duplicating it', async () => {
    await call('POST', '/content', { entries: [entry('vocab.mizu', { box: 2 })] })
    await call('POST', '/content', { entries: [entry('vocab.mizu', { box: 3 })] })
    expect((await content()).map((e) => e.box)).toEqual([3])
  })

  it('returns every entry past the 1000-row select cap', async () => {
    for (let start = 0; start < 1500; start += 500) {
      const entries = Array.from({ length: 500 }, (_, i) => entry(`vocab.n${String(start + i).padStart(4, '0')}`))
      await call('POST', '/content', { entries })
    }
    expect(await content()).toHaveLength(1500)
  })

  it("never shows one learner another learner's state", async () => {
    await call('POST', '/content', { entries: [entry('vocab.mizu')] }, 'token-a')
    expect(await content('token-b')).toEqual([])
  })
})

describe('/path (lessons seen)', () => {
  const seen = async (pathId: string, token = 'token-a') => {
    const res = await call('GET', `/path?pathId=${pathId}`, undefined, token)
    return ((await res.json()) as { data: { seenUnitIds: string[] } }).data.seenUnitIds
  }

  it('starts empty and records lessons in the order they are seen', async () => {
    expect(await seen('book-2')).toEqual([])
    await call('POST', '/path', { pathId: 'book-2', unitId: 'b2.a' })
    await call('POST', '/path', { pathId: 'book-2', unitId: 'b2.b' })
    expect(await seen('book-2')).toEqual(['b2.a', 'b2.b'])
  })

  it('records a lesson once however often it is marked seen', async () => {
    // The last-card replay bug marked a lesson seen twice; this keeps that harmless.
    await call('POST', '/path', { pathId: 'n5', unitId: 'n5.unit-1' })
    await call('POST', '/path', { pathId: 'n5', unitId: 'n5.unit-1' })
    expect(await seen('n5')).toEqual(['n5.unit-1'])
  })

  it('keeps each book and each learner separate', async () => {
    await call('POST', '/path', { pathId: 'n5', unitId: 'n5.unit-1' }, 'token-a')
    expect(await seen('book-2')).toEqual([])
    expect(await seen('n5', 'token-b')).toEqual([])
  })

  it('rejects a mark with no lesson id', async () => {
    expect((await call('POST', '/path', { pathId: 'n5', unitId: '' })).status).toBe(400)
  })
})
