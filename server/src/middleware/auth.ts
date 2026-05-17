import type { Context, Next } from 'hono'
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
  if (error || !data.user) return c.json({ error: 'Unauthorized' }, 401)

  c.set('user', { id: data.user.id, email: data.user.email })
  await next()
}
