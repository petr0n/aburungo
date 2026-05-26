import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { adminAuth } from '../../middleware/adminAuth.js'
import { getLogEntries } from '../../lib/logger.js'
import type { LogLevel } from '../../lib/logger.js'

export const adminLogsRoutes = new Hono()

adminLogsRoutes.use('*', adminAuth)

const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const

// GET /api/admin/logs?level=error&limit=100
adminLogsRoutes.get(
  '/',
  zValidator(
    'query',
    z.object({
      level: z.enum(LEVELS).optional(),
      limit: z.coerce.number().int().min(1).max(500).optional().default(100),
    }),
  ),
  (c) => {
    const { level, limit } = c.req.valid('query')
    const entries = getLogEntries(level as LogLevel | undefined, limit)
    return c.json({ data: entries, total: entries.length })
  },
)
