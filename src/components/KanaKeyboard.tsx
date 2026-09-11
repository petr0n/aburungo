import { useState } from "react";
import { KanaKeyboard as KanaKeyboardDisplay } from "aburungo-design-system";
import type { KanaScript } from "aburungo-design-system";

type Props = {
  /** The kana entered so far. The mark keys read its last character. */
  value: string;
  onKey: (kana: string) => void;
  onBackspace: () => void;
  onReplaceLast: (kana: string) => void;
};

/** Holds the script toggle; everything else belongs to whoever owns the buffer. */
export function KanaKeyboard({ value, onKey, onBackspace, onReplaceLast }: Props) {
  const [script, setScript] = useState<KanaScript>("hiragana");

  return (
    <KanaKeyboardDisplay
      script={script}
      value={value}
      onScriptChange={setScript}
      onKey={onKey}
      onBackspace={onBackspace}
      onReplaceLast={onReplaceLast}
    />
  );
}
