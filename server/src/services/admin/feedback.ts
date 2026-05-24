import { supabase } from '../../lib/supabase.js'
import type { FeedbackRow } from '../../db/types.js'

export type FeedbackItem = {
  id: string
  userId: string | null
  type: 'bug' | 'suggestion' | 'other'
  message: string
  status: 'open' | 'reviewed' | 'resolved'
  screenshotUrl: string | null
  createdAt: string
}

function toItem(row: FeedbackRow): FeedbackItem {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    message: row.message,
    status: row.status,
    screenshotUrl: row.screenshot_url,
    createdAt: row.created_at,
  }
}

export async function listFeedback(
  status?: 'open' | 'reviewed' | 'resolved',
): Promise<FeedbackItem[]> {
  let query = supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => toItem(r as FeedbackRow))
}

export async function updateFeedbackStatus(
  id: string,
  status: 'open' | 'reviewed' | 'resolved',
): Promise<void> {
  const { error } = await supabase
    .from('feedback')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function submitFeedback(
  userId: string,
  type: 'bug' | 'suggestion' | 'other',
  message: string,
): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('feedback')
    .insert({ user_id: userId, type, message })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return { id: (data as { id: string }).id }
}
