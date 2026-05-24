import { apiFetch } from './client'

export type AdminUser = {
  id: string
  email: string | null
  suspended: boolean
  created_at: string
  totalReviewed: number
  streak: number
}

export type AdminUserDetail = AdminUser & {
  masteryBreakdown: Record<string, number>
  kanjiBreakdown: Record<string, number>
}

export type FeedbackStatus = 'open' | 'reviewed' | 'resolved'

export type FeedbackItem = {
  id: string
  userId: string | null
  type: 'bug' | 'suggestion' | 'other'
  message: string
  status: FeedbackStatus
  screenshotUrl: string | null
  createdAt: string
}

export type HealthStatus = {
  api: { ok: boolean; uptimeMs: number }
  db: { ok: boolean; latencyMs: number; error: string | null }
  node: string
  env: string
  checkedAt: string
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await apiFetch<{ data: AdminUser[] }>('/api/admin/users')
  return res.data
}

export async function fetchAdminUser(id: string): Promise<AdminUserDetail> {
  const res = await apiFetch<{ data: AdminUserDetail }>(`/api/admin/users/${id}`)
  return res.data
}

export async function updateAdminUser(
  id: string,
  patch: { suspended?: boolean },
): Promise<void> {
  await apiFetch(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export async function fetchAdminFeedback(status?: FeedbackStatus): Promise<FeedbackItem[]> {
  const qs = status ? `?status=${status}` : ''
  const res = await apiFetch<{ data: FeedbackItem[] }>(`/api/admin/feedback${qs}`)
  return res.data
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
): Promise<void> {
  await apiFetch(`/api/admin/feedback/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function fetchAdminHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>('/api/admin/health')
}
