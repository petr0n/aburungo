import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { auth } from '../middleware/auth.js'

export const progressRoutes = new Hono()

progressRoutes.use('*', auth)

// GET /api/progress/due — cards due for review
progressRoutes.get('/due', async (c) => {
  const user = c.get('user')
  return c.json({ data: [], userId: user.id })
})

// POST /api/progress/review — submit a review rating, get back updated FSRS state
progressRoutes.post(
  '/review',
  zValidator(
    'json',
    z.object({
      cardId: z.string().uuid().optional(),
      kanjiId: z.string().uuid().optional(),
      rating: z.enum(['again', 'hard', 'good', 'easy']),
      sessionId: z.string().uuid(),
    })
  ),
  async (c) => {
    const user = c.get('user')
    const body = c.req.valid('json')
    return c.json({ ok: true, userId: user.id, ...body })
  }
)

// GET /api/progress/stats — review counts, streak, mastery breakdown
progressRoutes.get('/stats', async (c) => {
  const user = c.get('user')
  return c.json({ data: null, userId: user.id })
})
