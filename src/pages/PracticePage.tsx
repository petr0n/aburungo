import { FillBlankScreen } from '@/components/FillBlankScreen';
import { useAuth } from '@/store/auth';

export function PracticePage() {
  const signOut = useAuth((s) => s.signOut);

  return (
    <main className='mx-auto flex min-h-svh w-full max-w-xl flex-col gap-0 px-4'>
      <header className='flex items-center justify-between py-4'>
        <h1 className='text-heading-sm font-semibold text-fg'>AburunGo</h1>
        <button
          type='button'
          onClick={() => {
            void signOut();
          }}
          className='min-h-[44px] px-3 text-body-sm text-fg-subtle active:text-fg'
        >
          Sign out
        </button>
      </header>
      <div className='flex flex-1 flex-col justify-center py-6'>
        <FillBlankScreen />
      </div>
    </main>
  );
}
