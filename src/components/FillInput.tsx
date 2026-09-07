import { useEffect, useRef, useState } from "react";
import { FillInput as FillInputDisplay } from "aburungo-design-system";
import type { InputMode } from "aburungo-design-system";
import type { KanaScript, KanaSection } from "aburungo-design-system";
import { convertRomaji, finalizeRomaji } from "@/lib/romajiToKana";

type Props = {
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Drive the input method from outside. Supply both to control it; supply
   * neither and this component keeps its own. A caller that shows the picker
   * somewhere steadier than inside the card needs the state up there with it,
   * and the callers that do not care should not have to hold it.
   */
  mode?: InputMode;
  onModeChange?: (mode: InputMode) => void;
  /** Forwarded: hide the built-in picker when the caller renders its own. */
  showModePicker?: boolean;
};

export function FillInput({ onSubmit, placeholder, disabled, mode: modeProp, onModeChange, showModePicker }: Props) {
  const [ownMode, setOwnMode] = useState<InputMode>("romaji");
  const mode = modeProp ?? ownMode;
  const [romaji, setRomaji] = useState("");
  const [kana, setKana] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [kanaScript, setKanaScript] = useState<KanaScript>("hiragana");
  const [kanaSection, setKanaSection] = useState<KanaSection>("basic");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the active text input when mode changes
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
      kanaSection={kanaSection}
      canSubmit={canSubmit}
      disabled={disabled}
      placeholder={placeholder}
      showSystemHint={showHint}
      inputRef={inputRef}
      showModePicker={showModePicker}
      onModeChange={(m) => {
        setRomaji("");
        setKana("");
        if (onModeChange !== undefined) onModeChange(m);
        else setOwnMode(m);
      }}
      onRomajiChange={setRomaji}
      onKanaKey={(char) => setKana((prev) => prev + char)}
      onKanaBackspace={() => setKana((prev) => [...prev].slice(0, -1).join(""))}
      onKanaScriptChange={setKanaScript}
      onKanaSectionChange={setKanaSection}
      onSystemChange={setKana}
      onSubmit={handleSubmit}
      onToggleSystemHint={() => setShowHint((h) => !h)}
    />
  );
}
