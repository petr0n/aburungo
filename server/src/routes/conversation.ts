import { Hono } from 'hono'
import { streamText } from 'hono/streaming'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { auth } from '../middleware/auth.js'

export const conversationRoutes = new Hono()

conversationRoutes.use('*', auth)

// POST /api/conversation/session — create a new conversation session
conversationRoutes.post('/session', async (c) => {
  const user = c.get('user')
  return c.json({ sessionId: null, userId: user.id })
})

// POST /api/conversation/message — send a message, stream Claude Haiku reply
conversationRoutes.post(
  '/message',
  zValidator(
    'json',
    z.object({
      sessionId: z.string().uuid(),
      message: z.string().min(1).max(2000),
    })
  ),
  async (c) => {
    const body = c.req.valid('json')
    return streamText(c, async (stream) => {
      // Claude Haiku streaming integration goes here
      await stream.write(`Echo: ${body.message}`)
    })
  }
)
