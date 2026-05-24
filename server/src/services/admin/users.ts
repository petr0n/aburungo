import { supabase } from '../../lib/supabase.js'

export type AdminUserRow = {
  id: string
  email: string | null
  suspended: boolean
  created_at: string
  totalReviewed: number
  streak: number
}

export type AdminUserDetail = AdminUserRow & {
  masteryBreakdown: Record<string, number>
  kanjiBreakdown: Record<string, number>
}

export async function listUsers(): Promise<AdminUserRow[]> {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, suspended, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const { data: authList } = await supabase.auth.admin.listUsers()
  const emailMap = new Map(
    (authList?.users ?? []).map((u) => [u.id, u.email ?? null]),
  )

  const reviewCounts = await Promise.all(
    (users ?? []).map(async (u) => {
      const { count } = await supabase
        .from('review_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', u.id)
      return { id: u.id, count: count ?? 0 }
    }),
  )
  const reviewMap = new Map(reviewCounts.map((r) => [r.id, r.count]))

  return (users ?? []).map((u) => ({
    id: u.id as string,
    email: emailMap.get(u.id as string) ?? null,
    suspended: u.suspended as boolean,
    created_at: u.created_at as string,
    totalReviewed: reviewMap.get(u.id as string) ?? 0,
    streak: 0,
  }))
}

export async function getUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, suspended, created_at')
    .eq('id', userId)
    .single()

  if (error || !user) return null

  const { data: authUser } = await supabase.auth.admin.getUserById(userId)
  const email = authUser?.user?.email ?? null

  const [cardProgress, kanjiProgress, { count: totalReviewed }] = await Promise.all([
    supabase
      .from('user_card_progress')
      .select('state')
      .eq('user_id', userId),
    supabase
      .from('user_kanji_progress')
      .select('state')
      .eq('user_id', userId),
    supabase
      .from('review_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ])

  const masteryBreakdown: Record<string, number> = {}
  for (const row of cardProgress.data ?? []) {
    const s = row.state as string
    masteryBreakdown[s] = (masteryBreakdown[s] ?? 0) + 1
  }

  const kanjiBreakdown: Record<string, number> = {}
  for (const row of kanjiProgress.data ?? []) {
    const s = row.state as string
    kanjiBreakdown[s] = (kanjiBreakdown[s] ?? 0) + 1
  }

  return {
    id: user.id as string,
    email,
    suspended: user.suspended as boolean,
    created_at: user.created_at as string,
    totalReviewed: totalReviewed ?? 0,
    streak: 0,
    masteryBreakdown,
    kanjiBreakdown,
  }
}

export async function updateUser(
  userId: string,
  patch: { suspended?: boolean },
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', userId)

  if (error) throw new Error(error.message)
}
