import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { auth } from '../middleware/auth.js'
import { listKanji, getKanji, getDueKanji, submitKanjiReview } from '../services/kanji.js'

export const kanjiRoutes = new Hono()

kanjiRoutes.use('*', auth)

// GET /api/kanji?jlpt=3&grade=1&limit=20&offset=0
kanjiRoutes.get('/', async (c) => {
  const { jlpt, grade, limit = '20', offset = '0' } = c.req.query()

  const data = await listKanji({
    jlpt: jlpt ? parseInt(jlpt, 10) : undefined,
    grade: grade ? parseInt(grade, 10) : undefined,
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    offset: parseInt(offset, 10) || 0,
  })

  return c.json({ data })
})

// GET /api/kanji/due?limit=20
kanjiRoutes.get('/due', async (c) => {
  const user = c.get('user')
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10) || 20, 100)

  const data = await getDueKanji(user.id, limit)
  return c.json({ data })
})

// POST /api/kanji/review
kanjiRoutes.post(
  '/review',
  zValidator(
    'json',
    z.object({
      kanjiId: z.string().uuid(),
      rating: z.enum(['again', 'good']),
      reviewedAt: z.number().int().positive(),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { kanjiId, rating, reviewedAt } = c.req.valid('json')

    const data = await submitKanjiReview(user.id, kanjiId, rating, reviewedAt)
    return c.json({ data })
  },
)

// GET /api/kanji/:character
kanjiRoutes.get('/:character', async (c) => {
  const character = c.req.param('character')
  const data = await getKanji(character)

  if (!data) return c.json({ error: 'Not found' }, 404)
  return c.json({ data })
})
