import { Hono } from 'hono'
import { auth } from '../middleware/auth.js'

export const audioRoutes = new Hono()

audioRoutes.use('*', auth)

// GET /api/audio/:cardId — returns Supabase Storage URL for pre-generated audio
audioRoutes.get('/:cardId', async (c) => {
  const cardId = c.req.param('cardId')
  return c.json({ url: null, cardId })
})

// POST /api/audio/synthesize — on-demand TTS for dynamic text (Google/Azure)
audioRoutes.post('/synthesize', async (c) => {
  const { text } = await c.req.json<{ text: string }>()
  return c.json({ url: null, text })
})
