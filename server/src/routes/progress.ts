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
