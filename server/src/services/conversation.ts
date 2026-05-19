import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../lib/supabase.js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

const SYSTEM_PROMPT = (jlpt: JlptLevel) => `\
You are Hana, a friendly Japanese conversation partner. Speak naturally and casually.
Adjust vocabulary and grammar complexity to JLPT ${jlpt} level.
Use Japanese script (hiragana, katakana, kanji) appropriate to ${jlpt}, with furigana in parentheses for kanji above ${jlpt} level.
Keep responses concise — 1-3 sentences unless the student asks for more.
Gently correct mistakes by modelling the correct form in your reply without lecturing.`

export async function createSession(
  userId: string,
  jlpt: JlptLevel = 'N4',
): Promise<{ sessionId: string }> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId, type: 'conversation' })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // Store JLPT level in the opening system message so it's recoverable
  await supabase.from('conversation_messages').insert({
    session_id: (data as { id: string }).id,
    role: 'system',
    content: SYSTEM_PROMPT(jlpt),
  })

  return { sessionId: (data as { id: string }).id }
}

export async function* streamReply(
  userId: string,
  sessionId: string,
  userMessage: string,
): AsyncGenerator<string> {
  // Verify session belongs to user
  const { data: session, error: sessionErr } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (sessionErr || !session) throw new Error('Session not found')

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
    system: systemMsg?.content ?? SYSTEM_PROMPT('N4'),
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
