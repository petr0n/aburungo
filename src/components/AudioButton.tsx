import { useRef, useState } from "react";
import { AudioButton as AdsAudioButton } from "aburungo-design-system";

type AudioState = "idle" | "loading" | "playing";

type Props = {
  src: string | undefined;
  label?: string;
};

export function AudioButton({ src, label = "Play audio" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>("idle");

  if (src === undefined) return null;

  function handlePress() {
    const el = audioRef.current;
    if (el === null || state !== "idle") return;
    setState("loading");
    el.currentTime = 0;
    void el.play();
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlaying={() => setState("playing")}
        onEnded={() => setState("idle")}
        onError={() => setState("idle")}
      />
      <AdsAudioButton state={state} onPress={handlePress} label={label} />
    </>
  );
}
