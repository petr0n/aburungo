import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/store/auth';
import heroImage from '@/assets/hero.png';

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
      <div className='flex flex-col items-center gap-4 text-center'>
        <img
          src={heroImage}
          alt='AburunGo — stacked study cards'
          width={220}
          height={220}
          className='select-none'
        />
        <h1 className='text-display font-bold tracking-tight text-fg'>
          AburunGo
        </h1>
        <p className='text-body text-fg-subtle'>
          Practical Japanese for real life.
        </p>
      </div>

      <AuthForm onSignIn={signIn} onSignUp={signUp} loading={loading} />
    </main>
  );
}
