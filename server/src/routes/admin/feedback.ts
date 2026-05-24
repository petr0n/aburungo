import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { adminAuth } from '../../middleware/adminAuth.js'
import { listFeedback, updateFeedbackStatus } from '../../services/admin/feedback.js'

export const adminFeedbackRoutes = new Hono()

adminFeedbackRoutes.use('*', adminAuth)

adminFeedbackRoutes.get('/', async (c) => {
  const { status } = c.req.query()
  const validStatus = ['open', 'reviewed', 'resolved'].includes(status ?? '')
    ? (status as 'open' | 'reviewed' | 'resolved')
    : undefined
  const data = await listFeedback(validStatus)
  return c.json({ data })
})

adminFeedbackRoutes.patch(
  '/:id',
  zValidator(
    'json',
    z.object({ status: z.enum(['open', 'reviewed', 'resolved']) }),
  ),
  async (c) => {
    const { status } = c.req.valid('json')
    await updateFeedbackStatus(c.req.param('id'), status)
    return c.json({ ok: true })
  },
)
