import { useCallback, useEffect, useRef } from "react";

/** Speak Japanese text with the browser's TTS, preferring a Japanese voice. */
export function useSpeak(): (text: string) => void {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const pick = () => {
      const voices = synth.getVoices();
      voiceRef.current =
        voices.find((v) => v.name === "Kyoko") ??
        voices.find((v) => v.lang === "ja-JP") ??
        voices.find((v) => v.lang.toLowerCase().startsWith("ja")) ??
        null;
    };
    pick();
    synth.addEventListener("voiceschanged", pick);
    return () => synth.removeEventListener("voiceschanged", pick);
  }, []);

  return useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ja-JP";
    utt.rate = 0.6;
    if (voiceRef.current) utt.voice = voiceRef.current;
    synth.speak(utt);
  }, []);
}
