import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/store/auth';

export function LandingPage() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const signIn = useAuth((s) => s.signIn);
  const signUp = useAuth((s) => s.signUp);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user !== null) {
      void navigate('/practice', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main className='flex min-h-svh items-center justify-center'>
        <p className='text-body-sm text-fg-subtle'>Loading...</p>
      </main>
    );
  }

  return (
    <main className='mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-8 px-4 py-12'>
      <div className='emboss-bg on-cream flex w-full flex-col items-center gap-5 rounded-2xl p-10 text-center'>
        <span className='hanko' style={{ fontSize: 80 }} />
        <div className='flex flex-col gap-2'>
          <h1 className='text-display font-bold tracking-tight text-fg'>AburunGo</h1>
          <p className='text-body text-fg-subtle'>Practical Japanese for real life.</p>
        </div>
      </div>

      <AuthForm onSignIn={signIn} onSignUp={signUp} loading={loading} />

      <section className='emboss-bg on-warm w-full rounded-2xl p-6'>
        <h2 className='mb-4 text-heading-sm font-semibold text-fg'>How it works</h2>
        <ol className='flex flex-col gap-3'>
          {[
            {
              step: '1',
              title: 'See an English phrase',
              body: 'Each card shows a real-life situation — ordering food, asking directions, checking into a hotel.',
            },
            {
              step: '2',
              title: 'Type or speak the Japanese',
              body: 'Type the reading in hiragana, katakana, or romaji — or tap Speak to use your microphone.',
            },
            {
              step: '3',
              title: 'Get spaced repetition',
              body: 'Cards you know well come back less often. Cards you struggle with come back sooner. 228 phrases across 20 real-life scenarios.',
            },
          ].map(({ step, title, body }) => (
            <li key={step} className='flex gap-3'>
              <span className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-body-sm font-bold text-white'>
                {step}
              </span>
              <div>
                <p className='text-body font-medium text-fg'>{title}</p>
                <p className='text-body-sm text-fg-subtle'>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
