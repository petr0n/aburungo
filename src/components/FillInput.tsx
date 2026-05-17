import { useEffect, useRef, useState } from 'react'
import { KanaKeyboard } from './KanaKeyboard'
import { convertRomaji, finalizeRomaji } from '@/lib/romajiToKana'

type InputMode = 'romaji' | 'kana' | 'system'

type Props = {
  onSubmit: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const MODE_LABELS: Record<InputMode, string> = {
  romaji: 'Romaji',
  kana: 'Kana grid',
  system: 'JP keyboard',
}

const SYSTEM_HINT =
  'Switch your keyboard to Japanese (日本語) — on iOS: Settings → General → Keyboard → Keyboards → Add New Keyboard → Japanese. On Android: Settings → General Management → Language → On-screen Keyboard → add Japanese.'

export function FillInput({ onSubmit, placeholder, disabled }: Props) {
  const [mode, setMode] = useState<InputMode>('romaji')
  const [romaji, setRomaji] = useState('')
  const [kana, setKana] = useState('')
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Clear state when mode changes
  useEffect(() => {
    setRomaji('')
    setKana('')
    inputRef.current?.focus()
  }, [mode])

  // Derived display values for romaji mode
  const { converted, pending } = convertRomaji(romaji)

  function handleRomajiChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRomaji(e.target.value)
  }

  function handleRomajiKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  function handleKanaKey(char: string) {
    setKana((prev) => prev + char)
  }

  function handleKanaBackspace() {
    setKana((prev) => {
      // Remove last character — handles multi-byte correctly
      return [...prev].slice(0, -1).join('')
    })
  }

  function handleSystemChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKana(e.target.value)
  }

  function handleSystemKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  function handleSubmit() {
    let value = ''
    if (mode === 'romaji') {
      value = finalizeRomaji(romaji)
    } else {
      value = kana
    }
    if (value.trim() === '') return
    onSubmit(value.trim())
    setRomaji('')
    setKana('')
  }

  const canSubmit =
    !disabled &&
    (mode === 'romaji' ? romaji.trim() !== '' : kana.trim() !== '')

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Mode picker */}
      <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
        {(['romaji', 'kana', 'system'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={[
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              mode === m
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 active:bg-zinc-100',
            ].join(' ')}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Romaji mode */}
      {mode === 'romaji' && (
        <div className="flex flex-col gap-2">
          {/* Live kana preview */}
          <div className="min-h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 font-jp text-xl text-zinc-900">
            {converted !== '' || pending !== '' ? (
              <>
                <span>{converted}</span>
                <span className="text-zinc-400">{pending}</span>
              </>
            ) : (
              <span className="text-zinc-400 text-base">{placeholder ?? 'Kana preview'}</span>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={romaji}
            onChange={handleRomajiChange}
            onKeyDown={handleRomajiKeyDown}
            disabled={disabled}
            placeholder="Type romaji here…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-zinc-300 px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none disabled:opacity-50"
          />
        </div>
      )}

      {/* Kana grid mode */}
      {mode === 'kana' && (
        <div className="flex flex-col gap-2">
          {/* Accumulated kana display */}
          <div className="min-h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 font-jp text-xl text-zinc-900">
            {kana !== '' ? (
              kana
            ) : (
              <span className="text-zinc-400 text-base">{placeholder ?? 'Tap kana below…'}</span>
            )}
          </div>
          <KanaKeyboard onKey={handleKanaKey} onBackspace={handleKanaBackspace} />
        </div>
      )}

      {/* System IME mode */}
      {mode === 'system' && (
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="text"
            value={kana}
            onChange={handleSystemChange}
            onKeyDown={handleSystemKeyDown}
            disabled={disabled}
            placeholder={placeholder ?? 'Type in Japanese…'}
            lang="ja"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-12 w-full rounded-xl border border-zinc-300 px-4 font-jp text-lg text-zinc-900 placeholder:text-zinc-400 placeholder:font-sans placeholder:text-base focus:border-zinc-500 focus:outline-none disabled:opacity-50"
          />
          <div className="flex items-start gap-2">
            <p className="text-sm text-zinc-500">
              Switch your device keyboard to Japanese (日本語).
            </p>
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="shrink-0 text-sm text-zinc-400 underline active:text-zinc-600"
            >
              How?
            </button>
          </div>
          {showHint && (
            <p className="rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600">{SYSTEM_HINT}</p>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="h-12 w-full rounded-xl bg-zinc-900 text-base font-medium text-white transition-opacity disabled:opacity-40 active:bg-zinc-800"
      >
        Check answer
      </button>
    </div>
  )
}
