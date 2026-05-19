import { Hono } from 'hono'
import { auth } from '../middleware/auth.js'
import { getAudioUrl } from '../services/audio.js'

export const audioRoutes = new Hono()

audioRoutes.use('*', auth)

// GET /api/audio/:cardId — returns Supabase Storage URL for pre-generated audio
audioRoutes.get('/:cardId', async (c) => {
  const cardId = c.req.param('cardId')
  const url = await getAudioUrl(cardId)
  return c.json({ url })
})

// POST /api/audio/synthesize — on-demand TTS (Google/Azure); V1 stub
audioRoutes.post('/synthesize', async (c) => {
  return c.json({ error: 'Not implemented' }, 501)
})
