import type { Context, Next } from 'hono'
import { supabase } from '../lib/supabase.js'

export async function adminAuth(c: Context, next: Next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return c.json({ error: 'Unauthorized' }, 401)

  const role = (data.user.app_metadata as Record<string, unknown>)?.role
  if (role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  c.set('user', { id: data.user.id, email: data.user.email })
  await next()
}
