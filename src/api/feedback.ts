import { apiFetch } from './client'

export type FeedbackType = 'bug' | 'suggestion' | 'other'

export async function submitFeedback(
  type: FeedbackType,
  message: string,
): Promise<void> {
  await apiFetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({ type, message }),
  })
}
