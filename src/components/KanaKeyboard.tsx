import { useState } from 'react'
import type { KanaRow } from '@/lib/kanaData'
import {
  HIRAGANA_BASIC,
  HIRAGANA_VOICED,
  HIRAGANA_SMALL,
  KATAKANA_BASIC,
  KATAKANA_VOICED,
  KATAKANA_SMALL,
} from '@/lib/kanaData'

type Script = 'hiragana' | 'katakana'
type Section = 'basic' | 'voiced' | 'small'

type Props = {
  onKey: (kana: string) => void
  onBackspace: () => void
}

const SECTION_LABELS: Record<Section, string> = {
  basic: 'あ〜ん',
  voiced: '゛゜',
  small: '小',
}

export function KanaKeyboard({ onKey, onBackspace }: Props) {
  const [script, setScript] = useState<Script>('hiragana')
  const [section, setSection] = useState<Section>('basic')

  const rows: readonly KanaRow[] =
    script === 'hiragana'
      ? section === 'basic'
        ? HIRAGANA_BASIC
        : section === 'voiced'
          ? HIRAGANA_VOICED
          : HIRAGANA_SMALL
      : section === 'basic'
        ? KATAKANA_BASIC
        : section === 'voiced'
          ? KATAKANA_VOICED
          : KATAKANA_SMALL

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
      {/* Script + section toggles */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {(['hiragana', 'katakana'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScript(s)}
              className={[
                'h-9 rounded-lg px-3 text-sm font-medium transition-colors',
                script === s
                  ? 'bg-zinc-900 text-white'
                  : 'border border-zinc-300 text-zinc-600 active:bg-zinc-100',
              ].join(' ')}
            >
              {s === 'hiragana' ? 'ひら' : 'カタ'}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(['basic', 'voiced', 'small'] as const).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSection(sec)}
              className={[
                'h-9 rounded-lg px-3 text-sm font-medium transition-colors',
                section === sec
                  ? 'bg-zinc-900 text-white'
                  : 'border border-zinc-300 text-zinc-600 active:bg-zinc-100',
              ].join(' ')}
            >
              {SECTION_LABELS[sec]}
            </button>
          ))}
        </div>
      </div>

      {/* Kana grid */}
      <div className="flex flex-col gap-1">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-5 gap-1">
            {row.map((cell, colIdx) =>
              cell === null ? (
                <div key={colIdx} />
              ) : (
                <button
                  key={colIdx}
                  type="button"
                  onClick={() => onKey(cell)}
                  className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white font-jp text-lg text-zinc-900 shadow-sm active:bg-zinc-100"
                >
                  {cell}
                </button>
              ),
            )}
          </div>
        ))}
      </div>

      {/* Utility row */}
      <div className="grid grid-cols-5 gap-1">
        <div className="col-span-3" />
        <button
          type="button"
          onClick={() => onKey('ー')}
          className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white font-jp text-lg text-zinc-900 shadow-sm active:bg-zinc-100"
        >
          ー
        </button>
        <button
          type="button"
          onClick={onBackspace}
          aria-label="Backspace"
          className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm active:bg-zinc-100"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
