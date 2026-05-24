import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { auth } from '../middleware/auth.js'
import { submitFeedback } from '../services/admin/feedback.js'

export const feedbackRoutes = new Hono()

feedbackRoutes.use('*', auth)

feedbackRoutes.post(
  '/',
  zValidator(
    'json',
    z.object({
      type: z.enum(['bug', 'suggestion', 'other']),
      message: z.string().min(1).max(2000),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { type, message } = c.req.valid('json')
    const data = await submitFeedback(user.id, type, message)
    return c.json({ data }, 201)
  },
)
