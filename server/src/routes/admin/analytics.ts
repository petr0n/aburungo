import { Hono } from 'hono'
import { adminAuth } from '../../middleware/adminAuth.js'
import { getAnalytics } from '../../services/admin/analytics.js'

export const adminAnalyticsRoutes = new Hono()

adminAnalyticsRoutes.use('*', adminAuth)

// GET /api/admin/analytics
adminAnalyticsRoutes.get('/', async (c) => {
  const data = await getAnalytics()
  return c.json(data)
})
