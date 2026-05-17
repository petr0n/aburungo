import { useAuth } from '@/store/auth'

export function PracticePage() {
  const signOut = useAuth((s) => s.signOut)
  const user = useAuth((s) => s.user)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">AburunGo</h1>
      <p className="text-zinc-600">Welcome, {user?.email}</p>
      <p className="text-sm text-zinc-400">Fill-in-the-blank practice — coming soon.</p>
      <button
        type="button"
        onClick={() => { void signOut() }}
        className="min-h-[44px] rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors active:bg-zinc-100"
      >
        Sign out
      </button>
    </main>
  )
}
