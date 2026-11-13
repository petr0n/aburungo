import type { Context, Next } from 'hono'
import { isAuthRetryableFetchError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase.js'

export type AuthUser = {
  id: string
  email: string | undefined
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export async function auth(c: Context, next: Next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  const { data, error } = await supabase.auth.getUser(token)
  // Supabase unreachable or timed out (upstreamFetch) says nothing about the
  // token. Answering 401 made a network blip read as a bad login: three nightly
  // walks in a week failed on bursts of these.
  if (isAuthRetryableFetchError(error)) return c.json({ error: 'Auth service unavailable' }, 503)
  if (error || !data.user) return c.json({ error: 'Unauthorized' }, 401)

  c.set('user', { id: data.user.id, email: data.user.email })
  await next()
}
