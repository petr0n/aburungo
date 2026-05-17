/**
 * Plays a phrase's pronunciation audio.
 *
 * Renders nothing when the phrase has no audioUrl, so callers don't need to
 * branch. Audio sourcing (recordings vs TTS vs licensed) is undecided —
 * whichever we pick, the only requirement is that audioUrl points to
 * something the <audio> element can play.
 */
import { useRef } from 'react'

type Props = {
  src: string | undefined
  label?: string
}

export function AudioButton({ src, label = 'Play audio' }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  if (src === undefined) return null

  function play() {
    const el = audioRef.current
    if (el === null) return
    el.currentTime = 0
    void el.play()
  }

  return (
    <>
      <audio ref={audioRef} src={src} preload="none" />
      <button
        type="button"
        onClick={play}
        aria-label={label}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 active:bg-zinc-100"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z"
          />
        </svg>
      </button>
    </>
  )
}
