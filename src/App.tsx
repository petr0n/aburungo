import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { useAuth } from "@/store/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { LandingPage } from "@/pages/LandingPage";
import { PracticePage } from "@/pages/PracticePage";
import { HowToPage } from "@/pages/HowToPage";
import { KanaPracticePage } from "@/pages/KanaPracticePage";
import { FlashcardPage } from "@/pages/FlashcardPage";
import { KanjiPage } from "@/pages/KanjiPage";
import { ConversationPage } from "@/pages/ConversationPage";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminFeedbackPage } from "@/pages/admin/AdminFeedbackPage";
import { AdminHealthPage } from "@/pages/admin/AdminHealthPage";
import { AdminAnalyticsPage } from "@/pages/admin/AdminAnalyticsPage";
import { AdminContentPage } from "@/pages/admin/AdminContentPage";
import { AdminLogsPage } from "@/pages/admin/AdminLogsPage";

export default function App() {
  const initialize = useAuth((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public — no auth required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/kana" element={<KanaPracticePage />} />
      <Route path="/flashcard" element={<FlashcardPage />} />
      <Route path="/kanji" element={<KanjiPage />} />
      <Route path="/how-to" element={<HowToPage />} />

      {/* Auth required — Conversation uses Anthropic API (paid cost) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/conversation" element={<ConversationPage />} />
      </Route>

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
