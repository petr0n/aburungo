import { Hono } from 'hono'
import { auth } from '../middleware/auth.js'

export const kanjiRoutes = new Hono()

kanjiRoutes.use('*', auth)

// GET /api/kanji?jlpt=3&grade=1&limit=20&offset=0
kanjiRoutes.get('/', async (c) => {
  const { jlpt, grade, limit = '20', offset = '0' } = c.req.query()
  return c.json({ data: [], jlpt, grade, limit, offset })
})

// GET /api/kanji/:character
kanjiRoutes.get('/:character', async (c) => {
  const character = c.req.param('character')
  return c.json({ data: null, character })
})
