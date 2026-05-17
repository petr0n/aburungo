import { useState } from 'react'
import type { Phrase } from '@/types'
import { compareAnswer } from '@/lib/compareAnswer'
import { FillInput } from './FillInput'
import { VoiceInput } from './VoiceInput'
import { AudioButton } from './AudioButton'

type Phase = 'input' | 'result'
type InputMode = 'text' | 'voice'

type Props = {
  phrase: Phrase
  onNext: (correct: boolean) => void
}

export function FillBlankCard({ phrase, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>('input')
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [correct, setCorrect] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')

  function handleSubmit(value: string) {
    const isCorrect = compareAnswer(value, phrase.reading)
    setUserAnswer(value)
    setCorrect(isCorrect)
    setPhase('result')
  }

  function handleNext() {
    onNext(correct)
    setPhase('input')
    setUserAnswer('')
    setCorrect(false)
  }

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {phrase.scenario}
        </span>
        <AudioButton src={phrase.audioUrl} />
      </header>

      {/* Prompt */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-zinc-500">How do you say…</p>
        <p className="text-2xl font-semibold text-zinc-900">{phrase.english}</p>
        {phrase.notes !== undefined && (
          <p className="text-sm italic text-zinc-400">{phrase.notes}</p>
        )}
      </div>

      {phase === 'input' && (
        <>
          {/* Input mode toggle */}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={[
                'h-9 rounded-lg px-4 text-sm font-medium transition-colors',
                inputMode === 'text'
                  ? 'bg-zinc-900 text-white'
                  : 'border border-zinc-300 text-zinc-600 active:bg-zinc-100',
              ].join(' ')}
            >
              Type
            </button>
            <button
              type="button"
              onClick={() => setInputMode('voice')}
              className={[
                'h-9 rounded-lg px-4 text-sm font-medium transition-colors',
                inputMode === 'voice'
                  ? 'bg-zinc-900 text-white'
                  : 'border border-zinc-300 text-zinc-600 active:bg-zinc-100',
              ].join(' ')}
            >
              Speak
            </button>
          </div>

          {inputMode === 'text' ? (
            <FillInput
              onSubmit={handleSubmit}
              placeholder="Type the Japanese…"
            />
          ) : (
            <VoiceInput onResult={handleSubmit} />
          )}
        </>
      )}

      {phase === 'result' && (
        <div className="flex flex-col gap-4">
          {/* Result banner */}
          <div
            className={[
              'rounded-xl p-4 text-center',
              correct ? 'bg-green-50' : 'bg-red-50',
            ].join(' ')}
          >
            <p
              className={[
                'text-lg font-semibold',
                correct ? 'text-green-700' : 'text-red-700',
              ].join(' ')}
            >
              {correct ? 'Correct!' : 'Not quite'}
            </p>
            {!correct && userAnswer !== '' && (
              <p className="mt-1 font-jp text-sm text-red-500">
                You answered: {userAnswer}
              </p>
            )}
          </div>

          {/* Correct answer */}
          <div className="flex flex-col items-center gap-1 rounded-xl bg-zinc-50 p-4 text-center">
            <p className="font-jp text-2xl text-zinc-900">{phrase.japanese}</p>
            <p className="font-jp text-base text-zinc-500">{phrase.reading}</p>
            <p className="text-sm italic text-zinc-400">{phrase.romaji}</p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="h-12 w-full rounded-xl bg-zinc-900 text-base font-medium text-white active:bg-zinc-800"
          >
            Next
          </button>
        </div>
      )}
    </article>
  )
}
