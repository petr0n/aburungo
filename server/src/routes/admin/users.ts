import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { adminAuth } from '../../middleware/adminAuth.js'
import { listUsers, getUserDetail, updateUser } from '../../services/admin/users.js'

export const adminUserRoutes = new Hono()

adminUserRoutes.use('*', adminAuth)

adminUserRoutes.get('/', async (c) => {
  const data = await listUsers()
  return c.json({ data })
})

adminUserRoutes.get('/:id', async (c) => {
  const data = await getUserDetail(c.req.param('id'))
  if (!data) return c.json({ error: 'Not found' }, 404)
  return c.json({ data })
})

adminUserRoutes.patch(
  '/:id',
  zValidator('json', z.object({ suspended: z.boolean().optional() })),
  async (c) => {
    const patch = c.req.valid('json')
    await updateUser(c.req.param('id'), patch)
    return c.json({ ok: true })
  },
)
