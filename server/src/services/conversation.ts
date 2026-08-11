import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../lib/supabase.js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

import { buildSystemPrompt, type ConversationScope, type JlptLevel } from './conversationPrompt.js'
import {
  ASSESSOR_MAX_TOKENS,
  buildAssessorPrompt,
  parseAssessment,
  type Assessment,
  type TranscriptTurn,
} from './canDoPrompt.js'

export type { JlptLevel, ConversationScope, Assessment }

/**
 * Open a session. With a `scope` this becomes a unit practice session —
 * one situation, that unit's vocabulary, a handful of turns — instead of the
 * open-ended companion.
 */
export async function createSession(
  userId: string,
  jlpt: JlptLevel = 'N4',
  scope?: ConversationScope,
): Promise<{ sessionId: string }> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId, type: 'conversation' })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // The opening system message is the session's memory of its own scope —
  // streamReply replays the stored history, so nothing needs to be re-sent.
  await supabase.from('conversation_messages').insert({
    session_id: (data as { id: string }).id,
    role: 'system',
    content: buildSystemPrompt(jlpt, scope),
  })

  return { sessionId: (data as { id: string }).id }
}

/** Throws unless the session exists and belongs to this user. */
async function assertOwnsSession(userId: string, sessionId: string): Promise<void> {
  const { data, error } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (error || !data) throw new Error('Session not found')
}

/**
 * The second agent of the can-do checkpoint (DR-022).
 *
 * Reads the transcript from the database rather than accepting one from the
 * client. That is the whole security model here: a client that could post its
 * own transcript could award itself every can-do on the ladder, and the only
 * thing standing between the two is that this function never looks at what the
 * caller sent.
 */
export async function assessCanDo(
  userId: string,
  sessionId: string,
  canDo: string,
  situation: string,
): Promise<Assessment> {
  await assertOwnsSession(userId, sessionId)

  const { data: rows } = await supabase
    .from('conversation_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  const turns: TranscriptTurn[] = (rows ?? [])
    .filter((r) => r.role === 'user' || r.role === 'assistant')
    .map((r) => ({ role: r.role as 'user' | 'assistant', content: r.content as string }))

  // Nothing was said, so there is nothing to judge. Short-circuit rather than
  // spending a call to be told so.
  if (!turns.some((t) => t.role === 'user')) {
    return { verified: false, note: 'Have a go at the conversation first, then check it here.' }
  }

  const reply = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: ASSESSOR_MAX_TOKENS,
    messages: [{ role: 'user', content: buildAssessorPrompt(canDo, situation, turns) }],
  })

  const text = reply.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('')

  return parseAssessment(text)
}

export async function* streamReply(
  userId: string,
  sessionId: string,
  userMessage: string,
): AsyncGenerator<string> {
  await assertOwnsSession(userId, sessionId)

  // Load history
  const { data: rows } = await supabase
    .from('conversation_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  const history = rows ?? []
  const systemMsg = history.find((r) => r.role === 'system')
  const chatHistory = history.filter((r) => r.role !== 'system')

  // Persist user message
  await supabase.from('conversation_messages').insert({
    session_id: sessionId,
    role: 'user',
    content: userMessage,
  })

  // Stream Claude Haiku reply
  let fullReply = ''
  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    // The stored system message carries the session's scope. The fallback is
    // only for a session whose opening insert failed, and is intentionally the
    // unscoped prompt — better an open conversation than a silently unbounded
    // one claiming to be scoped.
    system: systemMsg?.content ?? buildSystemPrompt('N4'),
    messages: [
      ...chatHistory.map((r) => ({
        role: r.role as 'user' | 'assistant',
        content: r.content as string,
      })),
      { role: 'user', content: userMessage },
    ],
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      fullReply += event.delta.text
      yield event.delta.text
    }
  }

  // Persist assistant reply
  await supabase.from('conversation_messages').insert({
    session_id: sessionId,
    role: 'assistant',
    content: fullReply,
  })
}
