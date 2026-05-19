import { Hono } from 'hono'
import { auth } from '../middleware/auth.js'
import { listKanji, getKanji } from '../services/kanji.js'

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

// GET /api/kanji/:character
kanjiRoutes.get('/:character', async (c) => {
  const character = c.req.param('character')
  const data = await getKanji(character)

  if (!data) return c.json({ error: 'Not found' }, 404)
  return c.json({ data })
})
