import { Hono } from 'hono'
import { auth } from '../middleware/auth.js'

export const vocabularyRoutes = new Hono()

vocabularyRoutes.use('*', auth)

// GET /api/vocabulary?deck=restaurant&limit=20&offset=0
vocabularyRoutes.get('/', async (c) => {
  const { deck, limit = '20', offset = '0' } = c.req.query()
  return c.json({ data: [], deck, limit, offset })
})

// GET /api/vocabulary/:id
vocabularyRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  return c.json({ data: null, id })
})
