/**
 * AuthForm — sign-in / sign-up form.
 *
 * Toggles between modes. Fires callbacks up to the caller; no Supabase calls
 * here. Inputs and buttons are ≥ 44px tall per touch-first design rules.
 */
import { useState } from 'react'

type Mode = 'sign-in' | 'sign-up'

type Props = {
  onSignIn: (email: string, password: string) => Promise<string | null>
  onSignUp: (email: string, password: string) => Promise<string | null>
  loading: boolean
}

export function AuthForm(props: Props) {
  const { onSignIn, onSignUp, loading } = props

  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const handler = mode === 'sign-in' ? onSignIn : onSignUp
    const err = await handler(email.trim(), password)
    if (err !== null) {
      setError(err)
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'))
    setError(null)
  }

  const isSignIn = mode === 'sign-in'

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={(e) => { void handleSubmit(e) }} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="auth-email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            disabled={loading}
            className="min-h-[44px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent,#aa3bff)] disabled:opacity-50"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="auth-password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            required
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            disabled={loading}
            className="min-h-[44px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent,#aa3bff)] disabled:opacity-50"
            placeholder={isSignIn ? 'Your password' : 'Choose a password'}
          />
        </div>

        {error !== null ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || email.trim() === '' || password === ''}
          className="min-h-[44px] rounded-lg bg-[var(--accent,#aa3bff)] px-4 py-2 text-base font-semibold text-white transition-opacity active:opacity-80 disabled:opacity-50"
        >
          {loading ? 'Please wait…' : isSignIn ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500">
        {isSignIn ? 'New here?' : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={toggleMode}
          disabled={loading}
          className="min-h-[44px] font-medium text-[var(--accent,#aa3bff)] underline-offset-2 hover:underline disabled:opacity-50"
        >
          {isSignIn ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}
