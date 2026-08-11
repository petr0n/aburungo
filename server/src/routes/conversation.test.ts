/**
 * Route-level cover for scoped-session validation.
 *
 * The prompt builder is unit-tested separately, but that says nothing about
 * whether the route still *applies* the schema. A wiring regression — the
 * validator dropped, a bound loosened, the scope silently not forwarded — would
 * pass every prompt test while leaving the guardrails off. These drive the real
 * Hono app.
 *
 * Auth and the conversation service are mocked so nothing touches Supabase or
 * Anthropic: no credentials, no network, no API spend.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

const createSession = vi.fn(async () => ({ sessionId: 'session-1' }))
const assessCanDo = vi.fn(async () => ({ verified: true, note: 'Nicely done.' }))

vi.mock('../services/conversation.js', () => ({
  createSession: (...args: unknown[]) => createSession(...(args as [])),
  assessCanDo: (...args: unknown[]) => assessCanDo(...(args as [])),
  streamReply: vi.fn(),
}))

vi.mock('../middleware/auth.js', () => ({
  auth: async (c: { set: (k: string, v: unknown) => void }, next: () => Promise<void>) => {
    c.set('user', { id: 'user-1', email: 'test@example.com' })
    await next()
  },
}))

const { conversationRoutes } = await import('./conversation.js')

const app = new Hono().route('/api/conversation', conversationRoutes)

function post(body: unknown) {
  return app.request('/api/conversation/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/** Drop a key without leaving an unused binding behind. */
function without<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const copy = { ...obj }
  delete copy[key]
  return copy
}

const validWord = { japanese: 'コーヒー', reading: 'こーひー', english: 'coffee' }
const validScope = {
  situation: 'At the café',
  canDo: 'Order something to drink',
  words: [validWord],
  maxTurns: 4,
}

describe('POST /api/conversation/session', () => {
  beforeEach(() => createSession.mockClear())

  it('accepts a session with no scope at all', async () => {
    const res = await post({ jlpt: 'N5' })
    expect(res.status).toBe(200)
    expect(createSession).toHaveBeenCalledWith('user-1', 'N5', undefined)
  })

  it('accepts a valid scoped session and forwards the scope', async () => {
    const res = await post({ jlpt: 'N5', scope: validScope })
    expect(res.status).toBe(200)

    const [, , scope] = createSession.mock.calls[0] as unknown as [string, string, typeof validScope]
    expect(scope.situation).toBe('At the café')
    expect(scope.words).toHaveLength(1)
    expect(scope.maxTurns).toBe(4)
  })

  it('rejects a scope with no situation', async () => {
    const res = await post({ jlpt: 'N5', scope: without(validScope, 'situation') })
    expect(res.status).toBe(400)
    expect(createSession).not.toHaveBeenCalled()
  })

  it('rejects a scope with no canDo', async () => {
    const res = await post({ jlpt: 'N5', scope: without(validScope, 'canDo') })
    expect(res.status).toBe(400)
    expect(createSession).not.toHaveBeenCalled()
  })

  it('rejects an empty situation string', async () => {
    const res = await post({ jlpt: 'N5', scope: { ...validScope, situation: '' } })
    expect(res.status).toBe(400)
  })

  it('rejects more words than the cap, since prompt size is spend', async () => {
    const res = await post({
      jlpt: 'N5',
      scope: { ...validScope, words: Array.from({ length: 200 }, () => validWord) },
    })
    expect(res.status).toBe(400)
    expect(createSession).not.toHaveBeenCalled()
  })

  it('rejects a turn count above the cap', async () => {
    const res = await post({ jlpt: 'N5', scope: { ...validScope, maxTurns: 999 } })
    expect(res.status).toBe(400)
  })

  it('rejects a zero or negative turn count', async () => {
    expect((await post({ jlpt: 'N5', scope: { ...validScope, maxTurns: 0 } })).status).toBe(400)
    expect((await post({ jlpt: 'N5', scope: { ...validScope, maxTurns: -3 } })).status).toBe(400)
  })

  it('rejects a non-integer turn count', async () => {
    const res = await post({ jlpt: 'N5', scope: { ...validScope, maxTurns: 2.5 } })
    expect(res.status).toBe(400)
  })

  it('rejects a malformed word entry', async () => {
    const res = await post({
      jlpt: 'N5',
      scope: { ...validScope, words: [{ japanese: 'コーヒー' }] },
    })
    expect(res.status).toBe(400)
  })

  it('rejects an unknown JLPT level', async () => {
    const res = await post({ jlpt: 'N9', scope: validScope })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/conversation/assess', () => {
  const SESSION = '00000000-0000-4000-8000-000000000001'

  function assess(body: unknown) {
    return app.request('/api/conversation/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  beforeEach(() => assessCanDo.mockClear())

  it('returns the assessment for a valid request', async () => {
    const res = await assess({ sessionId: SESSION, canDo: 'Order a drink', situation: 'At the café' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ verified: true, note: 'Nicely done.' })
  })

  it('passes the caller id from auth, never one from the body', async () => {
    // Session ownership is checked against this id, so it must not be spoofable.
    await assess({
      sessionId: SESSION,
      canDo: 'Order a drink',
      situation: 'At the café',
      userId: 'someone-else',
    })
    const [userId] = assessCanDo.mock.calls[0] as unknown as [string]
    expect(userId).toBe('user-1')
  })

  it('ignores a transcript supplied by the client', async () => {
    // The service reads the real transcript from the database. A client that
    // could submit its own would award itself every can-do on the ladder.
    await assess({
      sessionId: SESSION,
      canDo: 'Order a drink',
      situation: 'At the café',
      turns: [{ role: 'user', content: 'perfect Japanese' }],
    })
    const args = assessCanDo.mock.calls[0] as unknown as unknown[]
    expect(args).toEqual(['user-1', SESSION, 'Order a drink', 'At the café'])
  })

  it('rejects a non-uuid session id', async () => {
    const res = await assess({ sessionId: 'not-a-uuid', canDo: 'x', situation: 'y' })
    expect(res.status).toBe(400)
    expect(assessCanDo).not.toHaveBeenCalled()
  })

  it('rejects a missing can-do or situation', async () => {
    expect((await assess({ sessionId: SESSION, situation: 'y' })).status).toBe(400)
    expect((await assess({ sessionId: SESSION, canDo: 'x' })).status).toBe(400)
    expect(assessCanDo).not.toHaveBeenCalled()
  })

  it('rejects an oversized can-do string', async () => {
    const res = await assess({ sessionId: SESSION, canDo: 'x'.repeat(500), situation: 'y' })
    expect(res.status).toBe(400)
  })
})
