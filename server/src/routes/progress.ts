import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { auth } from '../middleware/auth.js'
import {
  getDueCards,
  submitReview,
  getStats,
  upsertKanaProgress,
  fetchKanaProgress,
  resetKanaProgress,
  fetchPathProgress,
  markUnitSeen,
  fetchContentProgress,
  upsertContentProgress,
} from '../services/progress.js'

export const progressRoutes = new Hono()

progressRoutes.use('*', auth)

// GET /api/progress/due?limit=20
progressRoutes.get('/due', async (c) => {
  const user = c.get('user')
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10) || 20, 100)
  const data = await getDueCards(user.id, limit)
  return c.json({ data })
})

// POST /api/progress/review
progressRoutes.post(
  '/review',
  zValidator(
    'json',
    z.object({
      cardId: z.string().uuid(),
      rating: z.enum(['again', 'hard', 'good', 'easy']),
      reviewedAt: z.number().int().positive(),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { cardId, rating, reviewedAt } = c.req.valid('json')
    const data = await submitReview(user.id, cardId, rating, reviewedAt)
    return c.json({ data })
  },
)

// GET /api/progress/stats
progressRoutes.get('/stats', async (c) => {
  const user = c.get('user')
  const data = await getStats(user.id)
  return c.json({ data })
})

// GET /api/progress/kana
progressRoutes.get('/kana', async (c) => {
  const user = c.get('user')
  const data = await fetchKanaProgress(user.id)
  return c.json({ data })
})

// POST /api/progress/kana
progressRoutes.post(
  '/kana',
  zValidator(
    'json',
    z.object({
      character: z.string().min(1).max(1),
      script: z.enum(['hiragana', 'katakana']),
      mode: z.enum(['recognized', 'recalled']),
      correct: z.boolean(),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { character, script, mode, correct } = c.req.valid('json')
    const data = await upsertKanaProgress(user.id, character, script, mode, correct)
    return c.json({ data })
  },
)

// DELETE /api/progress/kana?script=hiragana|katakana|all
progressRoutes.delete('/kana', async (c) => {
  const user = c.get('user')
  const script = c.req.query('script') ?? 'all'
  if (script !== 'hiragana' && script !== 'katakana' && script !== 'all') {
    return c.json({ error: 'script must be hiragana, katakana, or all' }, 400)
  }
  await resetKanaProgress(user.id, script)
  return c.json({ ok: true })
})

// GET /api/progress/path?pathId=n5
progressRoutes.get('/path', async (c) => {
  const user = c.get('user')
  const pathId = c.req.query('pathId') ?? 'n5'
  const data = await fetchPathProgress(user.id, pathId)
  return c.json({ data })
})

// POST /api/progress/path
progressRoutes.post(
  '/path',
  zValidator(
    'json',
    z.object({
      pathId: z.string().min(1).max(64),
      unitId: z.string().min(1).max(128),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { pathId, unitId } = c.req.valid('json')
    const data = await markUnitSeen(user.id, pathId, unitId)
    return c.json({ data })
  },
)

// GET /api/progress/content
progressRoutes.get('/content', async (c) => {
  const user = c.get('user')
  const data = await fetchContentProgress(user.id)
  return c.json({ data })
})

// POST /api/progress/content — batch upsert of review states
progressRoutes.post(
  '/content',
  zValidator(
    'json',
    z.object({
      entries: z
        .array(
          z.object({
            contentId: z.string().min(1).max(128),
            box: z.number().int().min(1).max(5),
            dueAt: z.number().int().positive(),
            lastSeenAt: z.number().int().positive().nullable(),
          }),
        )
        .max(500),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { entries } = c.req.valid('json')
    const count = await upsertContentProgress(user.id, entries)
    return c.json({ data: { saved: count } })
  },
)
