import { Hono } from 'hono'
import { streamText } from 'hono/streaming'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { auth } from '../middleware/auth.js'
import { assessCanDo, createSession, streamReply } from '../services/conversation.js'
import type { JlptLevel } from '../services/conversation.js'
import { MAX_SCOPE_TURNS, MAX_SCOPE_WORDS } from '../services/conversationPrompt.js'

export const conversationRoutes = new Hono()

conversationRoutes.use('*', auth)

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const

// POST /api/conversation/session — create a new conversation session
conversationRoutes.post(
  '/session',
  zValidator(
    'json',
    // The word list arrives from the client because unit content is bundled
    // there, not in the database. Bounded here as well as in the prompt
    // builder: an unbounded list is unbounded API spend on someone else's
    // token budget.
    z.object({
      jlpt: z.enum(JLPT_LEVELS).optional(),
      scope: z
        .object({
          situation: z.string().min(1).max(120),
          canDo: z.string().min(1).max(240),
          words: z
            .array(
              z.object({
                japanese: z.string().min(1).max(60),
                reading: z.string().min(1).max(60),
                english: z.string().min(1).max(120),
              }),
            )
            .max(MAX_SCOPE_WORDS),
          maxTurns: z.number().int().min(1).max(MAX_SCOPE_TURNS),
        })
        .optional(),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { jlpt, scope } = c.req.valid('json')
    const result = await createSession(user.id, (jlpt ?? 'N4') as JlptLevel, scope)
    return c.json(result)
  },
)

// POST /api/conversation/message — send a message, stream Claude Haiku reply
conversationRoutes.post(
  '/message',
  zValidator(
    'json',
    z.object({
      sessionId: z.string().uuid(),
      message: z.string().min(1).max(2000),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { sessionId, message } = c.req.valid('json')

    return streamText(c, async (stream) => {
      for await (const chunk of streamReply(user.id, sessionId, message)) {
        await stream.write(chunk)
      }
    })
  },
)

// POST /api/conversation/assess — judge a finished session against one can-do
//
// Deliberately takes no transcript. The service reads it from the database, so
// a client cannot submit a conversation it did not have. `canDo` and
// `situation` are only labels for the judgement and are sanitised downstream.
conversationRoutes.post(
  '/assess',
  zValidator(
    'json',
    z.object({
      sessionId: z.string().uuid(),
      canDo: z.string().min(1).max(240),
      situation: z.string().min(1).max(120),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const { sessionId, canDo, situation } = c.req.valid('json')
    return c.json(await assessCanDo(user.id, sessionId, canDo, situation))
  },
)
