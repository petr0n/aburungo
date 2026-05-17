import { useEffect, useRef, useState } from 'react'

// Minimal declarations for the Web Speech API (not yet in TS's lib.dom for all targets).
interface SpeechRecognitionResultItem {
  readonly transcript: string
}
interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionResultItem
}
interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult
}
interface SpeechRecognitionResultEvent {
  readonly results: SpeechRecognitionResultList
}
interface SpeechRecognitionErrorEvent {
  readonly error: string
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

type Status = 'idle' | 'listening' | 'processing' | 'error'

type Props = {
  /** Called with the final transcript when the user finishes speaking. */
  onResult: (transcript: string) => void
  /** BCP-47 language tag. Defaults to Japanese. */
  lang?: string
  disabled?: boolean
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function VoiceInput({ onResult, lang = 'ja-JP', disabled }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const SpeechRecognitionAPI = getSpeechRecognition()

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  function start() {
    if (!SpeechRecognitionAPI || disabled) return

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setStatus('listening')
      setErrorMsg('')
    }

    recognition.onresult = (event) => {
      setStatus('processing')
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      onResult(transcript)
      setStatus('idle')
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setStatus('idle')
      } else {
        setErrorMsg('Could not hear you. Try again.')
        setStatus('error')
      }
    }

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setStatus((s) => (s === 'listening' ? 'idle' : s))
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  function stop() {
    recognitionRef.current?.stop()
    setStatus('idle')
  }

  if (!SpeechRecognitionAPI) {
    return (
      <p className="text-sm text-zinc-500">
        Voice input is not supported in this browser. Try Chrome or Safari.
      </p>
    )
  }

  const isListening = status === 'listening'
  const isProcessing = status === 'processing'

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Mic button with pulse ring when listening */}
      <div className="relative flex items-center justify-center">
        {isListening && (
          <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-red-400 opacity-30" />
        )}
        <button
          type="button"
          onClick={isListening ? stop : start}
          disabled={disabled ?? isProcessing}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          className={[
            'relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            isListening
              ? 'bg-red-500 text-white active:bg-red-600'
              : 'border-2 border-zinc-300 bg-white text-zinc-700 active:bg-zinc-100',
            disabled ?? isProcessing ? 'opacity-50' : '',
          ].join(' ')}
        >
          {isProcessing ? (
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="text-sm text-zinc-500">
        {status === 'idle' && 'Tap to speak'}
        {status === 'listening' && 'Listening… tap to stop'}
        {status === 'processing' && 'Processing…'}
        {status === 'error' && <span className="text-red-500">{errorMsg}</span>}
      </p>
    </div>
  )
}
