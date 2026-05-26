import { Hono } from 'hono'
import { adminAuth } from '../../middleware/adminAuth.js'
import { getContentAudit } from '../../services/admin/content.js'

export const adminContentRoutes = new Hono()

adminContentRoutes.use('*', adminAuth)

// GET /api/admin/content
adminContentRoutes.get('/', async (c) => {
  const data = await getContentAudit()
  return c.json(data)
})
