/**
 * AuthForm — sign-in / sign-up form.
 *
 * Toggles between modes. Fires callbacks up to the caller; no Supabase calls
 * here. Inputs and buttons are ≥ 44px tall per touch-first design rules.
 */
import { useState } from 'react';
import { Button, TextInput } from 'aburungo-design-system';

type Mode = 'sign-in' | 'sign-up';

type Props = {
  onSignIn: (email: string, password: string) => Promise<string | null>;
  onSignUp: (email: string, password: string) => Promise<string | null>;
  loading: boolean;
};

export function AuthForm(props: Props) {
  const { onSignIn, onSignUp, loading } = props;

  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const handler = mode === 'sign-in' ? onSignIn : onSignUp;
    const err = await handler(email.trim(), password);
    if (err !== null) {
      setError(err);
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'));
    setError(null);
  }

  const isSignIn = mode === 'sign-in';

  return (
    <div className='mx-auto w-full max-w-sm'>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        noValidate
        className='flex flex-col gap-4'
      >
        <TextInput
          id='auth-email'
          label='Email'
          type='email'
          autoComplete='email'
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          disabled={loading}
          placeholder='you@example.com'
        />

        <TextInput
          id='auth-password'
          label='Password'
          type='password'
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          disabled={loading}
          placeholder={isSignIn ? 'Your password' : 'Choose a password'}
        />

        {error !== null ? (
          <p
            role='alert'
            className='rounded-lg bg-error-bg px-3 py-2 text-body-sm text-error-fg'
          >
            {error}
          </p>
        ) : null}

        <Button
          type='submit'
          disabled={email.trim() === '' || password === ''}
          loading={loading}
          fullWidth
          className='bg-brand-500 text-fg-inverse active:opacity-80'
        >
          {isSignIn ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <p className='mt-5 text-center text-body-sm text-fg-subtle'>
        {isSignIn ? 'New here?' : 'Already have an account?'}{' '}
        <button
          type='button'
          onClick={toggleMode}
          disabled={loading}
          className='min-h-[44px] font-medium text-brand-500 underline-offset-2 active:opacity-80 disabled:opacity-50'
        >
          {isSignIn ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
