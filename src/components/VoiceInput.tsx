import { useEffect, useRef, useState } from "react";
import { VoiceInput as VoiceInputDisplay } from "aburungo-design-system";
import type { VoiceInputStatus } from "aburungo-design-system";

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

type Props = {
  onResult: (transcript: string) => void;
  lang?: string;
  disabled?: boolean;
};

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function VoiceInput({ onResult, lang = "ja-JP", disabled }: Props) {
  const [status, setStatus] = useState<VoiceInputStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
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
      setStatus("listening");
      setErrorMessage("");
    };

    recognition.onresult = (event) => {
      setStatus("processing");
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      onResult(transcript);
      setStatus("idle");
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        setStatus("idle");
      } else {
        setErrorMessage("Could not hear you. Try again.");
        setStatus("error");
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setStatus((s) => (s === "listening" ? "idle" : s));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stop() {
    recognitionRef.current?.stop();
    setStatus("idle");
  }

  if (!SpeechRecognitionAPI) {
    return (
      <p className="text-body-sm text-fg-subtle">Voice input is not supported in this browser. Try Chrome or Safari.</p>
    );
  }

  return (
    <VoiceInputDisplay
      status={status}
      onPress={status === "listening" ? stop : start}
      disabled={disabled}
      errorMessage={errorMessage}
    />
  );
}
