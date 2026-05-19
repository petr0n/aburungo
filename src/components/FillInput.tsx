import { useEffect, useRef, useState } from 'react';
import { KanaKeyboard } from './KanaKeyboard';
import { convertRomaji, finalizeRomaji } from '@/lib/romajiToKana';

type InputMode = 'romaji' | 'kana' | 'system';

type Props = {
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const MODE_LABELS: Record<InputMode, string> = {
  romaji: 'Romaji',
  kana: 'Kana grid',
  system: 'JP keyboard',
};

const SYSTEM_HINT =
  'Switch your keyboard to Japanese (日本語) — on iOS: Settings → General → Keyboard → Keyboards → Add New Keyboard → Japanese. On Android: Settings → General Management → Language → On-screen Keyboard → add Japanese.';

export function FillInput({ onSubmit, placeholder, disabled }: Props) {
  const [mode, setMode] = useState<InputMode>('romaji');
  const [romaji, setRomaji] = useState('');
  const [kana, setKana] = useState('');
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear state when mode changes
  useEffect(() => {
    setRomaji('');
    setKana('');
    inputRef.current?.focus();
  }, [mode]);

  // Derived display values for romaji mode
  const { converted, pending } = convertRomaji(romaji);

  function handleRomajiChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRomaji(e.target.value);
  }

  function handleRomajiKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  function handleKanaKey(char: string) {
    setKana((prev) => prev + char);
  }

  function handleKanaBackspace() {
    setKana((prev) => {
      // Remove last character — handles multi-byte correctly
      return [...prev].slice(0, -1).join('');
    });
  }

  function handleSystemChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKana(e.target.value);
  }

  function handleSystemKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  function handleSubmit() {
    let value = '';
    if (mode === 'romaji') {
      value = finalizeRomaji(romaji);
    } else {
      value = kana;
    }
    if (value.trim() === '') return;
    onSubmit(value.trim());
    setRomaji('');
    setKana('');
  }

  const canSubmit =
    !disabled &&
    (mode === 'romaji' ? romaji.trim() !== '' : kana.trim() !== '');

  return (
    <div className='flex w-full flex-col gap-3'>
      {/* Mode picker */}
      <div className='flex gap-1 rounded-xl border border-border bg-surface p-1'>
        {(['romaji', 'kana', 'system'] as const).map((m) => (
          <button
            key={m}
            type='button'
            onClick={() => setMode(m)}
            className={[
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              mode === m
                ? 'bg-bg text-fg shadow-card'
                : 'text-fg-subtle active:bg-surface-2',
            ].join(' ')}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Romaji mode */}
      {mode === 'romaji' && (
        <div className='flex flex-col gap-2'>
          {/* Live kana preview */}
          <div className='min-h-10 rounded-xl border border-border bg-surface px-4 py-2 font-jp text-jp-lg text-fg'>
            {converted !== '' || pending !== '' ? (
              <>
                <span>{converted}</span>
                <span className='text-fg-faint'>{pending}</span>
              </>
            ) : (
              <span className='text-body text-fg-faint'>
                {placeholder ?? 'Kana preview'}
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            type='text'
            value={romaji}
            onChange={handleRomajiChange}
            onKeyDown={handleRomajiKeyDown}
            disabled={disabled}
            placeholder='Type romaji here…'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='none'
            spellCheck={false}
            className='h-12 w-full rounded-xl border border-border-strong px-4 text-body text-fg placeholder:text-fg-faint focus:border-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50'
          />
        </div>
      )}

      {/* Kana grid mode */}
      {mode === 'kana' && (
        <div className='flex flex-col gap-2'>
          {/* Accumulated kana display */}
          <div className='min-h-12 rounded-xl border border-border bg-surface px-4 py-2 font-jp text-jp-lg text-fg'>
            {kana !== '' ? (
              kana
            ) : (
              <span className='text-body text-fg-faint'>
                {placeholder ?? 'Tap kana below...'}{' '}
              </span>
            )}
          </div>
          <KanaKeyboard
            onKey={handleKanaKey}
            onBackspace={handleKanaBackspace}
          />
        </div>
      )}

      {/* System IME mode */}
      {mode === 'system' && (
        <div className='flex flex-col gap-2'>
          <input
            ref={inputRef}
            type='text'
            value={kana}
            onChange={handleSystemChange}
            onKeyDown={handleSystemKeyDown}
            disabled={disabled}
            placeholder={placeholder ?? 'Type in Japanese…'}
            lang='ja'
            inputMode='text'
            autoComplete='off'
            autoCorrect='off'
            spellCheck={false}
            className='h-12 w-full rounded-xl border border-border-strong px-4 font-jp text-jp text-fg placeholder:font-sans placeholder:text-body placeholder:text-fg-faint focus:border-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50'
          />
          <div className='flex items-start gap-2'>
            <p className='text-body-sm text-fg-subtle'>
              Switch your device keyboard to Japanese (日本語).
            </p>
            <button
              type='button'
              onClick={() => setShowHint((h) => !h)}
              className='shrink-0 text-body-sm text-fg-faint underline active:text-fg-muted'
            >
              How?
            </button>
          </div>
          {showHint && (
            <p className='rounded-xl bg-surface p-3 text-body-sm text-fg-muted'>
              {SYSTEM_HINT}
            </p>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type='button'
        onClick={handleSubmit}
        disabled={!canSubmit}
        className='h-12 w-full rounded-xl bg-fg text-body font-medium text-fg-inverse transition-colors disabled:opacity-40 active:bg-fg-muted'
      >
        Check answer
      </button>
    </div>
  );
}
