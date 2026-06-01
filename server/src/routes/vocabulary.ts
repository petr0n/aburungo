import { Hono } from 'hono'
import { auth } from '../middleware/auth.js'
import { listCards, getCard } from '../services/vocabulary.js'

export const vocabularyRoutes = new Hono()

vocabularyRoutes.use('*', auth)

// GET /api/vocabulary?deck=restaurant&limit=20&offset=0
vocabularyRoutes.get('/', async (c) => {
  const { deck, limit = '20', offset = '0' } = c.req.query()

  const data = await listCards({
    deck: deck || undefined,
    limit: Math.min(parseInt(limit, 10) || 20, 500),
    offset: parseInt(offset, 10) || 0,
  })

  return c.json({ data })
})

// GET /api/vocabulary/:id
vocabularyRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const data = await getCard(id)

  if (!data) return c.json({ error: 'Not found' }, 404)
  return c.json({ data })
})
