import { useState } from 'react';
import { BackspaceIcon } from 'aburungo-design-system';
import type { KanaRow } from '@/lib/kanaData';
import {
  HIRAGANA_BASIC,
  HIRAGANA_VOICED,
  HIRAGANA_SMALL,
  KATAKANA_BASIC,
  KATAKANA_VOICED,
  KATAKANA_SMALL,
} from '@/lib/kanaData';

type Script = 'hiragana' | 'katakana';
type Section = 'basic' | 'voiced' | 'small';

type Props = {
  onKey: (kana: string) => void;
  onBackspace: () => void;
};

const SECTION_LABELS: Record<Section, string> = {
  basic: 'あ〜ん',
  voiced: '゛゜',
  small: '小',
};

export function KanaKeyboard({ onKey, onBackspace }: Props) {
  const [script, setScript] = useState<Script>('hiragana');
  const [section, setSection] = useState<Section>('basic');

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
          : KATAKANA_SMALL;

  return (
    <div className='flex w-full flex-col gap-2 rounded-2xl border border-border bg-surface p-3'>
      {/* Script + section toggles */}
      <div className='flex items-center justify-between gap-2'>
        <div className='flex gap-1'>
          {(['hiragana', 'katakana'] as const).map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => setScript(s)}
              className={[
                'h-9 rounded-lg px-3 font-jp text-sm font-medium transition-colors',
                script === s
                  ? 'bg-fg text-fg-inverse'
                  : 'border border-border-strong text-fg-muted active:bg-surface-2',
              ].join(' ')}
            >
              {s === 'hiragana' ? 'ひら' : 'カタ'}
            </button>
          ))}
        </div>

        <div className='flex gap-1'>
          {(['basic', 'voiced', 'small'] as const).map((sec) => (
            <button
              key={sec}
              type='button'
              onClick={() => setSection(sec)}
              className={[
                'h-9 rounded-lg px-3 font-jp text-sm font-medium transition-colors',
                section === sec
                  ? 'bg-fg text-fg-inverse'
                  : 'border border-border-strong text-fg-muted active:bg-surface-2',
              ].join(' ')}
            >
              {SECTION_LABELS[sec]}
            </button>
          ))}
        </div>
      </div>

      {/* Kana grid */}
      <div className='flex flex-col gap-1'>
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className='grid grid-cols-5 gap-1'>
            {row.map((cell, colIdx) =>
              cell === null ? (
                <div key={colIdx} />
              ) : (
                <button
                  key={colIdx}
                  type='button'
                  onClick={() => onKey(cell)}
                  className='flex h-11 items-center justify-center rounded-xl border border-border bg-bg font-jp text-jp text-fg shadow-key active:bg-surface-2'
                >
                  {cell}
                </button>
              ),
            )}
          </div>
        ))}
      </div>

      {/* Utility row */}
      <div className='grid grid-cols-5 gap-1'>
        <div className='col-span-3' />
        <button
          type='button'
          onClick={() => onKey('ー')}
          className='flex h-11 items-center justify-center rounded-xl border border-border bg-bg font-jp text-jp text-fg shadow-key active:bg-surface-2'
        >
          ー
        </button>
        <button
          type='button'
          onClick={onBackspace}
          aria-label='Backspace'
          className='flex h-11 items-center justify-center rounded-xl border border-border bg-bg text-fg-muted shadow-key active:bg-surface-2'
        >
          <BackspaceIcon className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
