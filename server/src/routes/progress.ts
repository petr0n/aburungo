import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { auth } from '../middleware/auth.js'
import { getDueCards, submitReview, getStats } from '../services/progress.js'

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
