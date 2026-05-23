import { useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { useAuth } from '@/store/auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LandingPage } from '@/pages/LandingPage'
import { PracticePage } from '@/pages/PracticePage'
import { HowToPage } from '@/pages/HowToPage'
import { KanaPracticePage } from '@/pages/KanaPracticePage'
import { FlashcardPage } from '@/pages/FlashcardPage'

export default function App() {
  const initialize = useAuth((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/kana" element={<KanaPracticePage />} />
        <Route path="/flashcard" element={<FlashcardPage />} />
        <Route path="/how-to" element={<HowToPage />} />
      </Route>
    </Routes>
  )
}
