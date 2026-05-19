import { Link } from 'react-router';

export function HowToPage() {
  return (
    <main className='mx-auto flex min-h-svh w-full max-w-xl flex-col px-4'>
      <header className='flex items-center justify-between py-4'>
        <Link
          to='/practice'
          className='min-h-[44px] flex items-center text-body-sm text-fg-subtle active:text-fg'
        >
          ← Back
        </Link>
        <h1 className='text-heading-sm font-semibold text-fg'>How it works</h1>
        <div className='w-16' />
      </header>

      <div className='flex flex-col gap-6 py-6'>
        <section className='rounded-2xl border border-border bg-surface p-6'>
          <h2 className='mb-4 text-heading-sm font-semibold text-fg'>Studying</h2>
          <ol className='flex flex-col gap-4'>
            {[
              {
                step: '1',
                title: 'See an English phrase',
                body: 'Each card shows a real-life situation — ordering food, asking for directions, checking into a hotel.',
              },
              {
                step: '2',
                title: 'Type or speak the Japanese',
                body: 'Type the reading in hiragana, katakana, or romaji — or tap Speak to use your microphone.',
              },
              {
                step: '3',
                title: 'Mark yourself honestly',
                body: 'Got it right? The card comes back less often. Struggled? It comes back sooner. No tricks.',
              },
            ].map(({ step, title, body }) => (
              <li key={step} className='flex gap-3'>
                <span className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-body-sm font-bold text-white'>
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

        <section className='rounded-2xl border border-border bg-surface p-6'>
          <h2 className='mb-4 text-heading-sm font-semibold text-fg'>Content</h2>
          <ul className='flex flex-col gap-2'>
            {[
              '228 phrases across 20 real-life scenarios',
              'Scenarios include: restaurant, transit, hotel, airport, emergency, doctor, izakaya, onsen, and more',
              '2,140 Joyo kanji with readings and meanings',
              'All content from verified sources — no made-up Japanese',
            ].map((item) => (
              <li key={item} className='flex gap-2 text-body-sm text-fg-subtle'>
                <span className='text-brand'>•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className='rounded-2xl border border-border bg-surface p-6'>
          <h2 className='mb-4 text-heading-sm font-semibold text-fg'>Tips</h2>
          <ul className='flex flex-col gap-2'>
            {[
              'Romaji is accepted — but try switching to hiragana as soon as you can',
              'Tap the speaker icon to hear the phrase spoken aloud (coming soon)',
              'Reviews are scheduled automatically — check back daily for best results',
              'Use the Speak mode to practise your pronunciation with the microphone',
            ].map((item) => (
              <li key={item} className='flex gap-2 text-body-sm text-fg-subtle'>
                <span className='text-brand'>•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
