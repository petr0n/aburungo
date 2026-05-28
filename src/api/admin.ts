import { apiFetch } from "./client";

export type AdminUser = {
  id: string;
  email: string | null;
  suspended: boolean;
  created_at: string;
  totalReviewed: number;
  streak: number;
};

export type AdminUserDetail = AdminUser & {
  masteryBreakdown: Record<string, number>;
  kanjiBreakdown: Record<string, number>;
};

export type FeedbackStatus = "open" | "reviewed" | "resolved";

export type FeedbackItem = {
  id: string;
  userId: string | null;
  type: "bug" | "suggestion" | "other";
  message: string;
  status: FeedbackStatus;
  screenshotUrl: string | null;
  createdAt: string;
};

export type HealthStatus = {
  api: { ok: boolean; uptimeMs: number };
  db: { ok: boolean; latencyMs: number; error: string | null };
  node: string;
  env: string;
  checkedAt: string;
};

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await apiFetch<{ data: AdminUser[] }>("/api/admin/users");
  return res.data;
}

export async function fetchAdminUser(id: string): Promise<AdminUserDetail> {
  const res = await apiFetch<{ data: AdminUserDetail }>(`/api/admin/users/${id}`);
  return res.data;
}

export async function updateAdminUser(id: string, patch: { suspended?: boolean }): Promise<void> {
  await apiFetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function fetchAdminFeedback(status?: FeedbackStatus): Promise<FeedbackItem[]> {
  const qs = status ? `?status=${status}` : "";
  const res = await apiFetch<{ data: FeedbackItem[] }>(`/api/admin/feedback${qs}`);
  return res.data;
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus): Promise<void> {
  await apiFetch(`/api/admin/feedback/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>("/api/admin/health");
}

// --- Logs ---

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export type LogEntry = {
  level: LogLevel;
  time: string;
  msg: string;
  route?: string;
  method?: string;
  status?: number;
  duration?: number;
  err?: string;
  [key: string]: unknown;
};

export async function fetchAdminLogs(level?: LogLevel, limit = 100): Promise<LogEntry[]> {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  params.set("limit", String(limit));
  const res = await apiFetch<{ data: LogEntry[] }>(`/api/admin/logs?${params}`);
  return res.data;
}

// --- Analytics ---

export type DailyReviews = { date: string; count: number };

export type MissedCard = {
  id: string;
  japanese: string;
  english: string;
  deck: string;
  againCount: number;
  totalCount: number;
  againRatio: number;
};

export type MissedKanji = {
  id: string;
  character: string;
  meanings: string[];
  againCount: number;
  totalCount: number;
  againRatio: number;
};

export type FsrsDistribution = {
  new: number;
  learning: number;
  review: number;
  relearning: number;
};

export type AnalyticsData = {
  reviewsPerDay: DailyReviews[];
  mostMissedCards: MissedCard[];
  mostMissedKanji: MissedKanji[];
  cardFsrsDistribution: FsrsDistribution;
  kanjiFsrsDistribution: FsrsDistribution;
  totalUsers: number;
  totalReviews: number;
  cachedAt: string;
};

export async function fetchAdminAnalytics(): Promise<AnalyticsData> {
  return apiFetch<AnalyticsData>("/api/admin/analytics");
}

// --- Content audit ---

export type CardAuditRow = {
  id: string;
  japanese: string;
  english: string;
  deck: string;
  issues: string[];
};

export type KanjiAuditRow = {
  id: string;
  character: string;
  issues: string[];
};

export type AudioCoverage = {
  total: number;
  withAudio: number;
  withoutAudio: number;
  coveragePercent: number;
};

export type ContentAuditData = {
  cards: CardAuditRow[];
  kanji: KanjiAuditRow[];
  audioCoverage: AudioCoverage;
  checkedAt: string;
};

export async function fetchAdminContent(): Promise<ContentAuditData> {
  return apiFetch<ContentAuditData>("/api/admin/content");
}
