import { useEffect } from 'react';
import { useSession } from '@/store/session';
import { FillBlankCard } from './FillBlankCard';

export function FillBlankScreen() {
  const status = useSession((s) => s.status);
  const error = useSession((s) => s.error);
  const queue = useSession((s) => s.queue);
  const currentIndex = useSession((s) => s.currentIndex);
  const initialize = useSession((s) => s.initialize);
  const rate = useSession((s) => s.rate);
  const reset = useSession((s) => s.reset);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className='flex min-h-[40vh] items-center justify-center'>
        <p className='text-body-sm text-fg-faint'>Loading review queue...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-col items-center gap-4 text-center'>
        <p className='text-heading-sm font-semibold text-fg'>Couldn't load cards</p>
        <p className='text-body text-fg-subtle'>{error}</p>
        <button
          type='button'
          onClick={() => { reset(); void initialize(); }}
          className='h-12 rounded-xl border border-border-strong px-6 text-body font-medium text-fg-muted active:bg-surface-2'
        >
          Try again
        </button>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className='flex flex-col items-center gap-4 text-center'>
        <p className='text-heading-sm font-semibold text-fg'>All caught up!</p>
        <p className='text-body text-fg-subtle'>
          No phrases due for review right now.
        </p>
        <button
          type='button'
          onClick={() => { reset(); void initialize(); }}
          className='h-12 rounded-xl border border-border-strong px-6 text-body font-medium text-fg-muted active:bg-surface-2'
        >
          Start over
        </button>
      </div>
    );
  }

  const card = queue[currentIndex];
  if (card === undefined) return null;

  return (
    <FillBlankCard
      key={card.id}
      card={card}
      onNext={(correct) => void rate(correct ? 'got-it' : 'didnt')}
    />
  );
}
