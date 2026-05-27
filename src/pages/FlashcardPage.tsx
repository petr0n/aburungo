import { Link } from 'react-router'
import { FlashcardScreen } from '@/components/FlashcardScreen'
import { useAuth } from '@/store/auth'

export function FlashcardPage() {
  const signOut = useAuth((s) => s.signOut)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-0 px-4">
      <header className="flex items-center justify-between py-4">
        <span className="flex items-center gap-2">
          <span className="hanko" style={{ fontSize: 32 }} />
          <h1 className="text-heading-sm font-semibold text-fg">AburunGo</h1>
        </span>
        <div className="flex items-center gap-1">
          <Link
            to="/kana"
            className="flex min-h-[44px] items-center px-3 text-body-sm text-fg-subtle active:text-fg"
          >
            Kana
          </Link>
          <Link
            to="/practice"
            className="flex min-h-[44px] items-center px-3 text-body-sm text-fg-subtle active:text-fg"
          >
            Fill-in
          </Link>
          <button
            type="button"
            onClick={() => {
              void signOut()
            }}
            className="min-h-[44px] px-3 text-body-sm text-fg-subtle active:text-fg"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="flex flex-1 flex-col justify-center py-6">
        <FlashcardScreen />
      </div>
    </main>
  )
}
