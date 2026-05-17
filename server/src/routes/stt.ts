import { Hono } from 'hono'
import { auth } from '../middleware/auth.js'

export const sttRoutes = new Hono()

sttRoutes.use('*', auth)

// POST /api/stt/transcribe — receives audio blob, returns transcript
// V1: handled client-side via Web Speech API; this route is the Whisper upgrade path
sttRoutes.post('/transcribe', async (c) => {
  return c.json({ transcript: null, message: 'Whisper integration pending' }, 501)
})
