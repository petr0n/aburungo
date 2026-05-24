import { useEffect, useRef, useState } from 'react';
import { MicIcon, SpinnerIcon } from 'aburungo-design-system';

// Minimal declarations for the Web Speech API (not yet in TS's lib.dom for all targets).
interface SpeechRecognitionResultItem {
  readonly transcript: string;
}
interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionResultItem;
}
interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResultEvent {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent {
  readonly error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type Status = 'idle' | 'listening' | 'processing' | 'error';

type Props = {
  /** Called with the final transcript when the user finishes speaking. */
  onResult: (transcript: string) => void;
  /** BCP-47 language tag. Defaults to Japanese. */
  lang?: string;
  disabled?: boolean;
};

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function VoiceInput({ onResult, lang = 'ja-JP', disabled }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const SpeechRecognitionAPI = getSpeechRecognition();

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  function start() {
    if (!SpeechRecognitionAPI || disabled) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setStatus('listening');
      setErrorMsg('');
    };

    recognition.onresult = (event) => {
      setStatus('processing');
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      onResult(transcript);
      setStatus('idle');
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setStatus('idle');
      } else {
        setErrorMsg('Could not hear you. Try again.');
        setStatus('error');
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setStatus((s) => (s === 'listening' ? 'idle' : s));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stop() {
    recognitionRef.current?.stop();
    setStatus('idle');
  }

  if (!SpeechRecognitionAPI) {
    return (
      <p className='text-body-sm text-fg-subtle'>
        Voice input is not supported in this browser. Try Chrome or Safari.
      </p>
    );
  }

  const isListening = status === 'listening';
  const isProcessing = status === 'processing';

  return (
    <div className='flex flex-col items-center gap-3'>
      {/* Mic button with pulse ring when listening */}
      <div className='relative flex items-center justify-center'>
        {isListening && (
          <span className='absolute inline-flex h-16 w-16 animate-ping rounded-full bg-error-500 opacity-30' />
        )}
        <button
          type='button'
          onClick={isListening ? stop : start}
          disabled={disabled ?? isProcessing}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          className={[
            'relative z-10 flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            isListening
              ? 'bg-error-500 text-fg-inverse active:bg-error-fg'
              : 'border-2 border-border-strong bg-bg text-fg-muted active:bg-surface-2',
            (disabled ?? isProcessing) ? 'opacity-50' : '',
          ].join(' ')}
        >
          {isProcessing ? (
            <SpinnerIcon className='h-5 w-5 animate-spin' />
          ) : (
            <MicIcon className='h-6 w-6' />
          )}
        </button>
      </div>

      <p className='text-body-sm text-fg-subtle'>
        {status === 'idle' && 'Tap to speak'}
        {status === 'listening' && 'Listening… tap to stop'}
        {status === 'processing' && 'Processing…'}
        {status === 'error' && (
          <span className='text-error-fg'>{errorMsg}</span>
        )}
      </p>
    </div>
  );
}
