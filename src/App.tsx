import { useEffect } from 'react'
import { AuthForm } from '@/components/AuthForm'
import { FillBlankScreen } from '@/components/FillBlankScreen'
import { useAuth } from '@/store/auth'
import heroImage from '@/assets/hero.png'

export default function App() {
  const user = useAuth((s) => s.user)
  const loading = useAuth((s) => s.loading)
  const initialize = useAuth((s) => s.initialize)
  const signIn = useAuth((s) => s.signIn)
  const signUp = useAuth((s) => s.signUp)
  const signOut = useAuth((s) => s.signOut)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-zinc-500">Loading…</p>
      </main>
    )
  }

  if (user !== null) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-0 px-4">
        <header className="flex items-center justify-between py-4">
          <h1 className="text-lg font-semibold text-zinc-900">AburunGo</h1>
          <button
            type="button"
            onClick={() => { void signOut() }}
            className="min-h-[44px] px-3 text-sm text-zinc-500 active:text-zinc-900"
          >
            Sign out
          </button>
        </header>
        <div className="flex flex-1 flex-col justify-center py-6">
          <FillBlankScreen />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <img
          src={heroImage}
          alt="AburunGo — stacked study cards"
          width={220}
          height={220}
          className="select-none"
        />
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">AburunGo</h1>
        <p className="text-zinc-500">Practical Japanese for real life.</p>
      </div>

      <AuthForm onSignIn={signIn} onSignUp={signUp} loading={loading} />
    </main>
  )
}
