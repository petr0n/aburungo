import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { useAuth } from "@/store/auth";
import { useProgress } from "@/store/progress";
import { AdminRoute } from "@/components/AdminRoute";
import { LandingPage } from "@/pages/LandingPage";
import { PracticePage } from "@/pages/PracticePage";
import { HowToPage } from "@/pages/HowToPage";
import { KanaPage } from "@/pages/KanaPage";
import { KanaPracticePage } from "@/pages/KanaPracticePage";
import { FlashcardPage } from "@/pages/FlashcardPage";
import { KanjiPage } from "@/pages/KanjiPage";
import { ConversationPage } from "@/pages/ConversationPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminFeedbackPage } from "@/pages/admin/AdminFeedbackPage";
import { AdminHealthPage } from "@/pages/admin/AdminHealthPage";
import { AdminAnalyticsPage } from "@/pages/admin/AdminAnalyticsPage";
import { AdminContentPage } from "@/pages/admin/AdminContentPage";
import { AdminLogsPage } from "@/pages/admin/AdminLogsPage";

export default function App() {
  const initialize = useAuth((s) => s.initialize);
  const authLoading = useAuth((s) => s.loading);
  const user = useAuth((s) => s.user);
  const loadStats = useProgress((s) => s.loadStats);
  const loadKana = useProgress((s) => s.loadKana);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (authLoading) return;
    const userId = user?.id ?? null;
    void loadKana(userId);
    void loadStats(userId);
  }, [authLoading, user?.id, loadKana, loadStats]);

  return (
    <Routes>
      {/* Public — no auth required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/kana" element={<KanaPage />} />
      <Route path="/kana/practice" element={<KanaPracticePage />} />
      <Route path="/flashcard" element={<FlashcardPage />} />
      <Route path="/kanji" element={<KanjiPage />} />
      <Route path="/how-to" element={<HowToPage />} />

      {/* Conversation: public route — page handles its own guest gate */}
      <Route path="/conversation" element={<ConversationPage />} />
      {/* Profile: public route — page handles guest vs signed-in view */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Admin only */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/health" element={<AdminHealthPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/logs" element={<AdminLogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
