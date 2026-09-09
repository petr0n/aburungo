import { useEffect, useRef, useState } from "react";
import { FillInput as FillInputDisplay } from "aburungo-design-system";
import type { InputMode } from "aburungo-design-system";
import type { KanaScript } from "aburungo-design-system";
import { convertRomaji, finalizeRomaji } from "@/lib/romajiToKana";

type Props = {
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Forwarded: hide the built-in picker when the caller renders its own. */
  showModePicker?: boolean;
} & ModeControl;

/**
 * Drive the input method from outside, or do not -- but not half of each.
 *
 * A caller that shows the picker somewhere steadier than inside the card needs
 * the state up there with it; callers that do not care should not have to hold
 * it. Splitting the pair breaks both ways -- `mode` alone emits changes nothing
 * acts on, `onModeChange` alone never moves the mode -- so the union makes
 * either half on its own a type error rather than a silent dead control.
 */
type ModeControl =
  | { mode: InputMode; onModeChange: (mode: InputMode) => void }
  | { mode?: undefined; onModeChange?: undefined };

export function FillInput({ onSubmit, placeholder, disabled, mode: modeProp, onModeChange, showModePicker }: Props) {
  const [ownMode, setOwnMode] = useState<InputMode>("romaji");
  const mode = modeProp ?? ownMode;
  const [romaji, setRomaji] = useState("");
  const [kana, setKana] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [kanaScript, setKanaScript] = useState<KanaScript>("hiragana");
  const inputRef = useRef<HTMLInputElement>(null);

  // Drop whatever was typed in the previous input when the mode changes.
  //
  // Derived during render rather than in an effect: resetting state from an
  // effect costs a second render pass and eslint rejects it outright. This is
  // React's own "adjust state when a prop changes" shape.
  //
  // It is not enough to clear inside the change handler below, which is where
  // this used to live -- the mode can also change from outside through props,
  // and a handler only sees the switches it makes itself, so the old romaji
  // stayed in the buffer when the caller's own picker moved the mode.
  const [lastMode, setLastMode] = useState(mode);
  if (mode !== lastMode) {
    setLastMode(mode);
    setRomaji("");
    setKana("");
  }

  // Focus is a DOM effect, so it stays one.
  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  const { converted, pending } = convertRomaji(romaji);

  const canSubmit = !disabled && (mode === "romaji" ? romaji.trim() !== "" : kana.trim() !== "");

  function handleSubmit() {
    const value = mode === "romaji" ? finalizeRomaji(romaji) : kana;
    if (value.trim() === "") return;
    onSubmit(value.trim());
    setRomaji("");
    setKana("");
  }

  return (
    <FillInputDisplay
      mode={mode}
      romajiValue={romaji}
      kanaValue={kana}
      converted={converted}
      pending={pending}
      kanaScript={kanaScript}
      canSubmit={canSubmit}
      disabled={disabled}
      placeholder={placeholder}
      showSystemHint={showHint}
      inputRef={inputRef}
      showModePicker={showModePicker}
      onModeChange={(m) => {
        if (onModeChange !== undefined) onModeChange(m);
        else setOwnMode(m);
      }}
      onRomajiChange={setRomaji}
      onKanaKey={(char) => setKana((prev) => prev + char)}
      onKanaBackspace={() => setKana((prev) => [...prev].slice(0, -1).join(""))}
      onKanaScriptChange={setKanaScript}
      onKanaReplaceLast={(k) => setKana((prev) => [...prev].slice(0, -1).join("") + k)}
      onSystemChange={setKana}
      onSubmit={handleSubmit}
      onToggleSystemHint={() => setShowHint((h) => !h)}
    />
  );
}
