import { Hono } from 'hono'
import { adminAuth } from '../../middleware/adminAuth.js'
import { supabase } from '../../lib/supabase.js'

export const adminHealthRoutes = new Hono()

adminHealthRoutes.use('*', adminAuth)

adminHealthRoutes.get('/', async (c) => {
  const dbStart = Date.now()
  const { error: dbError } = await supabase.from('users').select('id').limit(1)
  const dbLatencyMs = Date.now() - dbStart

  return c.json({
    api: { ok: true, uptimeMs: Number(process.uptime() * 1000) },
    db: { ok: !dbError, latencyMs: dbLatencyMs, error: dbError?.message ?? null },
    node: process.version,
    env: process.env.NODE_ENV ?? 'development',
    checkedAt: new Date().toISOString(),
  })
})
