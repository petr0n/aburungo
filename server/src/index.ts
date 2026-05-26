import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger as honoLogger } from 'hono/logger'
import { logger } from './lib/logger.js'
import { audioRoutes } from './routes/audio.js'
import { conversationRoutes } from './routes/conversation.js'
import { feedbackRoutes } from './routes/feedback.js'
import { kanjiRoutes } from './routes/kanji.js'
import { progressRoutes } from './routes/progress.js'
import { sttRoutes } from './routes/stt.js'
import { vocabularyRoutes } from './routes/vocabulary.js'
import { adminUserRoutes } from './routes/admin/users.js'
import { adminFeedbackRoutes } from './routes/admin/feedback.js'
import { adminHealthRoutes } from './routes/admin/health.js'
import { adminLogsRoutes } from './routes/admin/logs.js'
import { adminAnalyticsRoutes } from './routes/admin/analytics.js'
import { adminContentRoutes } from './routes/admin/content.js'

const app = new Hono()

// Use hono's built-in logger for request logging (feeds into pino ring buffer via stdout)
app.use('*', honoLogger((msg) => logger.info({ msg })))
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  })
)

app.route('/api/vocabulary', vocabularyRoutes)
app.route('/api/kanji', kanjiRoutes)
app.route('/api/progress', progressRoutes)
app.route('/api/audio', audioRoutes)
app.route('/api/stt', sttRoutes)
app.route('/api/conversation', conversationRoutes)
app.route('/api/feedback', feedbackRoutes)
app.route('/api/admin/users', adminUserRoutes)
app.route('/api/admin/feedback', adminFeedbackRoutes)
app.route('/api/admin/health', adminHealthRoutes)
app.route('/api/admin/logs', adminLogsRoutes)
app.route('/api/admin/analytics', adminAnalyticsRoutes)
app.route('/api/admin/content', adminContentRoutes)

app.get('/health', (c) => c.json({ ok: true }))

const port = parseInt(process.env.PORT ?? '3000')
serve({ fetch: app.fetch, port }, () => {
  logger.info({ msg: `Server running on http://localhost:${port}` })
})
