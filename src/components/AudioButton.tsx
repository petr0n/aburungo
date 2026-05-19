/**
 * Plays a phrase's pronunciation audio.
 *
 * Renders nothing when the phrase has no audioUrl, so callers don't need to
 * branch. Audio sourcing (recordings vs TTS vs licensed) is undecided —
 * whichever we pick, the only requirement is that audioUrl points to
 * something the <audio> element can play.
 */
import { useRef } from 'react';
import { SpeakerIcon } from './icons';
import { IconButton } from './ui/IconButton';

type Props = {
  src: string | undefined;
  label?: string;
};

export function AudioButton({ src, label = 'Play audio' }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (src === undefined) return null;

  function play() {
    const el = audioRef.current;
    if (el === null) return;
    el.currentTime = 0;
    void el.play();
  }

  return (
    <>
      <audio ref={audioRef} src={src} preload='none' />
      <IconButton aria-label={label} onClick={play}>
        <SpeakerIcon className='h-5 w-5' />
      </IconButton>
    </>
  );
}
